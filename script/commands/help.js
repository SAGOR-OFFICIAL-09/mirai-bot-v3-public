const axios = require('axios');

this.config = {
    name: "help",
    aliases: [],
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Sagor",
    description: "View command list and info",
    commandCategory: "Box chat",
    usages: "[command name/all]",
    cooldowns: 5,
    images: [],
};

this.run = async function({ api, event, args }) {
    const { threadID: tid, messageID: mid, senderID: sid } = event;
    var type = !args[0] ? "" : args[0].toLowerCase();
    var msg = "", array = [], i = 0;
    const cmds = global.client.commands;
    const TIDdata = global.data.threadData.get(tid) || {};
    const admin = global.config.ADMINBOT;
    const NameBot = global.config.BOTNAME;
    const version = this.config.version;
    var prefix = TIDdata.PREFIX || global.config.PREFIX;

    if (type == "all") {
        for (const cmd of cmds.values()) {
            msg += `${++i}. ${cmd.config.name}\n→ Description: ${cmd.config.description}\n────────────────\n`;
        }
        return api.sendMessage(msg, tid, mid);
    }

    if (type) {
        for (const cmd of cmds.values()) {
            array.push(cmd.config.name.toString());
        }
        if (!array.find(n => n == args[0].toLowerCase())) {
            const stringSimilarity = require('string-similarity');
            commandName = args.shift().toLowerCase() || "";
            var allCommandName = [];
            const commandValues = Object.keys(cmds);
            for (const cmd of commandValues) allCommandName.push(cmd);
            const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
            if (checker.bestMatch.rating >= 0.5) command = global.client.commands.get(checker.bestMatch.target);
            msg = `❎ Command '${type}' not found in the system.\n📝 Similar command found '${checker.bestMatch.target}'`;
            return api.sendMessage(msg, tid, mid);
        }
        const cmd = cmds.get(type).config;
        const img = cmd.images;
        let image = [];
        for (let i = 0; i < img.length; i++) {
            const a = img[i];
            const stream = (await axios.get(a, {
                responseType: "stream"
            })).data;
            image.push(stream);
        }
        msg = `[ USER GUIDE ]\n─────────────────\n[📜] - Command name: ${cmd.name}\n[👤] - Author: ${cmd.credits}\n[🌾] - Version: ${cmd.version}\n[🌴] - Permission: ${TextPr(cmd.hasPermssion)}\n[📝] - Description: ${cmd.description}\n[🏷️] - Category: ${cmd.commandCategory}\n[🍁] - Usage: ${cmd.usages}\n[⏳] - Cooldown: ${cmd.cooldowns}s\n─────────────────\n📌 Guide For New Users`;
        return api.sendMessage({ body: msg, attachment: image }, tid, mid);
    } else {
        CmdCategory();
        array.sort(S("nameModule"));
        for (const cmd of array) {
            msg += `│\n│ ${cmd.cmdCategory.toUpperCase()}\n├────────⭔\n│ Total commands: ${cmd.nameModule.length} commands\n│ ${cmd.nameModule.join(", ")}\n├────────⭔\n`;
        }
        msg += `📝 Total commands: ${cmds.size} commands\n👤 Total bot admins: ${admin.length}\n→ Bot Name: ${NameBot}\n🔰 Version: ${version}\n→ Admin: Pham Minh Dong\n📎 Link: ${global.config.FACEBOOK_ADMIN}\n${prefix}help + command name for details\n${prefix}help + all to see all commands`;
        return api.sendMessage(`╭─────────────⭓\n${msg}`, tid);
    }

    function CmdCategory() {
        for (const cmd of cmds.values()) {
            const {
                commandCategory,
                hasPermssion,
                name: nameModule
            } = cmd.config;
            if (!array.find(i => i.cmdCategory == commandCategory)) {
                array.push({
                    cmdCategory: commandCategory,
                    permission: hasPermssion,
                    nameModule: [nameModule]
                });
            } else {
                const find = array.find(i => i.cmdCategory == commandCategory);
                find.nameModule.push(nameModule);
            }
        }
    }
};

function S(k) {
    return function(a, b) {
        let i = 0;
        if (a[k].length > b[k].length) {
            i = 1;
        } else if (a[k].length < b[k].length) {
            i = -1;
        }
        return i * -1;
    };
}

function TextPr(permission) {
    p = permission;
    return p == 0 ? "Member" : p == 1 ? "Administrator" : p == 2 ? "Admin Bot" : "Full Access";
}