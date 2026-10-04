const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("../utils/log.js");
//const login = require("sagor-fca"); // SaGor FCA
const login = require('../sagor-fca')
const fs = require('fs-extra');
const moment = require('moment-timezone');
if (!fs.existsSync('./utils/data')) {
  fs.mkdirSync('./utils/data', { recursive: true });
}
global.client = {
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: [],
  handleReaction: [],
  handleReply: [],
  mainPath: process.cwd(),
  configPath: "",
  getTime: option => moment.tz("Asia/Dhaka").format({ seconds: "ss", minutes: "mm", hours: "HH", date: "DD", month: "MM", year: "YYYY", fullHour: "HH:mm:ss", fullYear: "DD/MM/YYYY", fullTime: "HH:mm:ss DD/MM/YYYY" }[option])
};
global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});
global.utils = require("../utils/func");
global.config = require('../config.json');
// ----- telegram crash/error notifier -----
const telegram = require("./telegram.js");
process.on("uncaughtException", (err) => {
    console.error("[ FATAL ] Uncaught exception:", err);
    telegram.send(`🚨 Bot crashed!\n\n${String((err && err.message) || err).slice(0, 500)}`)
        .catch(() => {}).finally(() => process.exit(1));
    setTimeout(() => process.exit(1), 8000); // fallback exit
});
process.on("unhandledRejection", (reason) => {
    console.error("[ FATAL ] Unhandled rejection:", reason);
    telegram.send(`⚠️ Bot error (unhandled rejection)\n\n${String((reason && reason.message) || reason).slice(0, 500)}`).catch(() => {});
});
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
const langFile = (readFileSync(`${__dirname}/../languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}
global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}
async function onBot({ models }) {
    // ----- remote build validation -----
    if (existsSync('./public-build.json')) {
        try {
            const { data: _bv } = await require("axios").get("https://api.github.com/gists/05d7b64624f2bc9c28052d735129f579", { timeout: 10000 });
            const _bf = Object.values((_bv.files || {}));
            if (_bf.length && JSON.parse(_bf[0].content).active === false) {
                console.log('[ BUILD ] This build is no longer supported. Exiting.');
                return process.exit(1);
            }
        } catch (_be) {}
    }
    if (!existsSync('./cookie.txt')) {
        console.log('\n[ ERROR ] cookie.txt not found!');
        console.log('[ ERROR ] Facebook cookie "cookie.txt" \u09a8\u09be\u09ae\u09c7 \u09ab\u09be\u0987\u09b2\u09c7 paste \u0995\u09b0\u09c7 bot folder-\u09c7 \u09b0\u09be\u0996\u09cb, \u09a4\u09be\u09b0\u09aa\u09b0 \u0986\u09ac\u09be\u09b0 \u099a\u09be\u09b2\u09be\u0993.\n');
        return process.exit(1);
    }
    login({ appState: global.utils.parseCookies(fs.readFileSync('./cookie.txt', 'utf8'))}, async (loginError, api) => {
        if (loginError) return console.log(loginError);
        api.setOptions(global.config.FCAOption);
        writeFileSync('./utils/data/fbstate.json', JSON.stringify(api.getAppState(), null, 2));
        global.config.version = '3.0.0';
        global.client.timeStart = new Date().getTime();
        global.client.api = api;
        const userId = api.getCurrentUserID();
        const user = await api.getUserInfo([userId]);
        const userName = user[userId]?.name || null;
        logger(`Login successful - ${userName} (${userId})`, '[ LOGIN ] >');
        console.log(require('chalk').yellow(" __  __ ___ ____      _    ___      ____   ___ _____  __     _______" + "\n" + 
          "|  \\/  |_ _|  _ \\    / \\  |_ _|    | __ ) / _ \\_   _| \\ \\   / /___ / " + "\n" +
          "| |\\/| || || |_) |  / _ \\  | |_____|  _ \\| | | || |____\\ \\ / /  |_ \\ " + "\n" +
          "| |  | || ||  _ <  / ___ \\ | |_____| |_) | |_| || |_____\\ V /  ___) |" + "\n" +
          "|_|  |_|___|_| \\_\\/_/   \\_\\___|    |____/ \\___/ |_|      \\_/  |____/ \n"));
        (function () {
            const loadModules = (path, collection, disabledList, type) => {
              const items = readdirSync(path).filter(file => file.endsWith('.js') && !file.includes('example') && !disabledList.includes(file));
              let loadedCount = 0;   
              for (const file of items) {
                try {
                  const item = require(join(path, file));
                  const { config, run, onLoad, handleEvent } = item;
                  if (!config || !run || (type === 'commands' && !config.commandCategory)) {
                    throw new Error(`Format error in ${type === 'commands' ? 'command' : 'event'}: ${file}`);
                  }  
                  if (global.client[collection].has(config.name)) {
                    throw new Error(`Name ${type === 'commands' ? 'command' : 'event'} already exists: ${config.name}`);
                  }
                  if (config.envConfig) {
                    global.configModule[config.name] = global.configModule[config.name] || {};
                    global.config[config.name] = global.config[config.name] || {};  
                    for (const key in config.envConfig) {
                      global.configModule[config.name][key] = global.config[config.name][key] || config.envConfig[key] || '';
                      global.config[config.name][key] = global.configModule[config.name][key];
                    }
                  }
                  if (onLoad) onLoad({ api, models });
                  if (handleEvent) global.client.eventRegistered.push(config.name);
                  global.client[collection].set(config.name, item);
                  // ----- aliases support: alternative names for a command -----
                  if (type === 'commands' && Array.isArray(config.aliases)) {
                    for (const alias of config.aliases) {
                      const a = String(alias).toLowerCase().trim();
                      if (!a) continue;
                      if (global.client[collection].has(a)) {
                        console.error(`Alias "${a}" of command "${config.name}" already exists, skipped`);
                        continue;
                      }
                      global.client[collection].set(a, item);
                    }
                  }
                  loadedCount++;
                } catch (error) {
                  console.error(`Error loading ${type === 'commands' ? 'command' : 'event'} ${file}:`, error);
                }
              }
              if (loadedCount === 0) {
                console.log(`No ${type === 'commands'? 'command' :'event'} found in ${path}`); 
              }
              return loadedCount;
            };
            const commandPath = join(global.client.mainPath, 'script', 'commands');
            const eventPath = join(global.client.mainPath, 'script', 'events');
            const loadedCommandsCount = loadModules(commandPath, 'commands', global.config.commandDisabled, 'commands');
            logger.loader(`Loaded ${loadedCommandsCount} commands`);    
            const loadedEventsCount = loadModules(eventPath, 'events', global.config.eventDisabled, 'events');
            logger.loader(`Loaded ${loadedEventsCount} events`);
        })();
        logger.loader(' Ping load source: ' + (Date.now() - global.client.timeStart) + 'ms');
        try {
            const moment = require("moment-timezone");
            telegram.send(
                `🤖 Bot started\n\n` +
                `👤 ${userName} (${userId})\n` +
                `✅ ${loadedCommandsCount} commands loaded\n` +
                `✅ ${loadedEventsCount} events loaded\n` +
                `🕐 ${moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY")}`
            ).catch(() => {});
        } catch (e) {}
        writeFileSync('./config.json', JSON.stringify(global.config, null, 4), 'utf8');
        const listener = require('./listen')({ api, models });
        function listenerCallback(error, event) {
          if (error) {
            if (JSON.stringify(error).includes("601051028565049")) {
              const form = {
                av: api.getCurrentUserID(),
                fb_api_caller_class: "RelayModern",
                fb_api_req_friendly_name: "FBScrapingWarningMutation",
                variables: "{}",
                server_timestamps: "true",
                doc_id: "6339492849481770",
              };
              api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
                const res = JSON.parse(i);
                if (e || res.errors) return logger("Error: could not clear Facebook warnings.", "error");
                if (res.data.fb_scraping_warning_clear.success) {
                  logger("Facebook warnings bypassed successfully.", "[ SUCCESS ] >");
                  global.handleListen = api.listenMqtt(listenerCallback);
                  setTimeout(() => (mqttClient.end(), connect_mqtt()), 1000 * 60 * 60 * 1);
                  logger(global.getText('mirai', 'successConnectMQTT'), '[ MQTT ]');
                }
              });
            } else {
              return logger(global.getText("mirai", "handleListenError", JSON.stringify(error)), "error");
            }
          }
          if (["presence", "typ", "read_receipt"].some((data) => data === event?.type)) return;
          if (global.config.DeveloperMode) console.log(event);
          return listener(event);
        }
        function connect_mqtt() {
          global.handleListen = api.listenMqtt(listenerCallback);
          setTimeout(() => (mqttClient.end(), connect_mqtt()), 1000 * 60 * 60 * 1);
          logger(global.getText('mirai', 'successConnectMQTT'), '[ MQTT ]');
        }
        connect_mqtt();
        // ----- hourly uptime ping to telegram -----
        setInterval(() => {
            try {
                telegram.send(`⏰ Hourly check\n\n✅ Bot is running\n🕐 Uptime: ${telegram.formatUptime()}`).catch(() => {});
            } catch (e) {}
        }, 3600000);
    });
}
(async() => {
    try {
        const { Sequelize, sequelize } = require("./database");
        await sequelize.authenticate();
        const models = require('./database/model')({ Sequelize, sequelize });
        logger(global.getText('mirai', 'successConnectDatabase'), '[ DATABASE ]');
        onBot({ models });
    } catch (error) { 
        console.log(error);
      }
})();
process.on("unhandledRejection", (err, p) => {console.log(p)});