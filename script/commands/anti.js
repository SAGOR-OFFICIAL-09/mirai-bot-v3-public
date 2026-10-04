module.exports.config = {
    name: "anti",
    aliases: [],
    version: "4.1.5",
    hasPermssion: 1,
    credits: "Sagor",
    description: "Anti change Box chat vip pro",
    commandCategory: "Box chat",
    usages: "anti to toggle on/off",
    cooldowns: 5,
    images: [],
    dependencies: {
      "fs-extra": "",
    },
  };
  const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require("fs-extra");
  const path = require('path');
  const fs = require('fs');
  const axios = require('axios');
  module.exports.handleReply = async function ({ api, event, args, handleReply, Threads }) {
    const { senderID, threadID, messageID, messageReply } = event;
    const { author, permssion } = handleReply;
    const Tm = (require('moment-timezone')).tz('Asia/Dhaka').format('HH:mm:ss || DD/MM/YYYY');
    const pathData = global.anti;
    const dataAnti = JSON.parse(readFileSync(pathData, "utf8"));
  
    if(author !== senderID ) return api.sendMessage(`❎ You are not the command user`,threadID);
  
  var number = event.args.filter(i=> !isNaN(i))
   for (const num of number){
    switch (num) {
      case "1": {
        if (permssion < 1)
          return api.sendMessage(
            "⚠️ You don't have permission to use this command",
            threadID,
            messageID
          );
        var NameBox = dataAnti.boxname;
        const antiImage = NameBox.find(
          (item) => item.threadID === threadID
        );
        if (antiImage) {
          dataAnti.boxname = dataAnti.boxname.filter((item) => item.threadID !== threadID);
          api.sendMessage(
            "☑️ Anti group-name change mode disabled ",
            threadID,
            messageID
          );
        } else {
          var threadName = (await api.getThreadInfo(event.threadID)).threadName;
          dataAnti.boxname.push({
            threadID,
            name: threadName
          })
          api.sendMessage(
            "☑️ Anti group-name change mode enabled",
            threadID,
            messageID
          );
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "2": {
        if (permssion < 1)
          return api.sendMessage(
            "⚠️ You don't have permission to use this command",
            threadID,
            messageID
          );
        const antiImage = dataAnti.boximage.find(
          (item) => item.threadID === threadID
        );
        if (antiImage) {
          dataAnti.boximage = dataAnti.boximage.filter((item) => item.threadID !== threadID);
          api.sendMessage(
            "☑️ Anti group-photo change mode disabled",
            threadID,
            messageID
          );
        } else {
          var threadInfo = await api.getThreadInfo(event.threadID);
          let url = threadInfo.imageSrc;
          let response = await global.api.imgur(url);
          let img = response.link;
          dataAnti.boximage.push({
            threadID,
            url: img,
          });
          api.sendMessage("☑️ Anti group-photo change mode enabled", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "3": {
        if (permssion < 1)
          return api.sendMessage(
            "⚠️ You don't have permission to use this command",
            threadID,
            messageID
          );
        const NickName = dataAnti.antiNickname.find(
          (item) => item.threadID === threadID
        );
  
        if (NickName) {
          dataAnti.antiNickname = dataAnti.antiNickname.filter((item) => item.threadID !== threadID);
          api.sendMessage(
            "☑️ Anti nickname change mode disabled",
            threadID,
            messageID
          );
        } else {
          const nickName = (await api.getThreadInfo(event.threadID)).nicknames
          dataAnti.antiNickname.push({
            threadID,
            data: nickName
          });
          api.sendMessage(
            "☑️ Anti nickname change mode enabled",
            threadID,
            messageID
          );
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "4": {
        if (permssion < 1)
          return api.sendMessage(
            "⚠️ You don't have permission to use this command",
            threadID,
            messageID
          );
        const antiout = dataAnti.antiout;
        if (antiout[threadID] == true) {
          antiout[threadID] = false;
          api.sendMessage(
            "☑️ Anti-out mode disabled",
            threadID,
            messageID
          );
        } else {
          antiout[threadID] = true;
          api.sendMessage(
            "☑️ Anti-out mode enabled",
            threadID,
            messageID
          );
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
  case "5": {
    const filepath = path.join(__dirname, 'data', 'antiemoji.json');
    let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));  
    let emoji = "";
    try {
      let threadInfo = await api.getThreadInfo(threadID);
      emoji = threadInfo.emoji;
    } catch (error) {
      console.error("Error fetching thread emoji status:", error);
    }
    if (!data.hasOwnProperty(threadID)) {
      data[threadID] = {
        emoji: emoji,
        emojiEnabled: true
      };
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    } else {
      data[threadID].emojiEnabled = !data[threadID].emojiEnabled;
      if (data[threadID].emojiEnabled) {
        data[threadID].emoji = emoji;
      }
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    }
    const statusMessage = data[threadID].emojiEnabled ? "On" : "Off";
    api.sendMessage(`☑️ ${statusMessage} anti-emoji mode`, threadID, messageID);
    break;
  }
   case "6": {
    const filepath = path.join(__dirname, 'data', 'antitheme.json');
    let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    let theme = "";
    try {
      const threadInfo = await Threads.getInfo(threadID);
      theme = threadInfo.threadTheme.id;
    } catch (error) {
      console.error("Error fetching thread theme:", error);
    }
    if (!data.hasOwnProperty(threadID)) {
      data[threadID] = {
        themeid: theme || "",
        themeEnabled: true
      };
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    } else {
      data[threadID].themeEnabled = !data[threadID].themeEnabled;
      if (data[threadID].themeEnabled) {
        data[threadID].themeid = theme || "";
      }
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    }
    const statusMessage = data[threadID].themeEnabled ? "On" : "Off";
    api.sendMessage(`☑️ ${statusMessage} anti-theme mode`, threadID, messageID);
    break;
  }
    case "7": {
    const dataAnti = __dirname + '/data/antiqtv.json';
   const info = await api.getThreadInfo(event.threadID);
   if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
   return api.sendMessage('❎ Bot needs admin rights to execute this command', event.threadID, event.messageID);
   let data = JSON.parse(fs.readFileSync(dataAnti));
   const { threadID, messageID } = event;
   if (!data[threadID]) {
   data[threadID] = true;
   api.sendMessage(`☑️ Anti-qtv mode enabled`, threadID, messageID);
   } else {
   data[threadID] = false;
   api.sendMessage(`☑️ Anti-qtv mode disabled`, threadID, messageID);
   }
   fs.writeFileSync(dataAnti, JSON.stringify(data, null, 4));
   break;
  };
      case "9": {
        const antiImage = dataAnti.boximage.find(
          (item) => item.threadID === threadID
        );
        const antiBoxname = dataAnti.boxname.find(
          (item) => item.threadID === threadID
        );
        const antiNickname = dataAnti.antiNickname.find(
          (item) => item.threadID === threadID
        );
        return api.sendMessage(`[ CHECK ANTI BOX ]\n────────────────────\n|› 1. anti namebox: ${antiBoxname ? "on" : "off"}\n|› 2. anti imagebox: ${antiImage ? "on" : "off" }\n|› 3. anti nickname: ${antiNickname ? "on" : "off"}\n|› 4. anti out: ${dataAnti.antiout[threadID] ? "on" : "off"}\n────────────────────\n|› Above are the statuses of each anti`, threadID);
        break;
      }
      default: {
        return api.sendMessage(`❎ The number you chose is not in the command`, threadID);
        }
      }
    }
  };
  
  module.exports.run = async ({ api, event, args, permssion, Threads }) => {
    const { threadID, messageID, senderID } = event;
    const threadSetting = (await Threads.getData(String(threadID))).data || {};
    const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;
    return api.sendMessage(`╭─────────────⭓\n│ Anti Change Info Group\n├─────⭔\n│ 1. anti namebox: block group name change\n│ 2. anti boximage: block group photo change\n│ 3. anti nickname: block user nickname change\n│ 4. anti out: block members leaving freely\n│ 5. anti emoji: block group emoji change\n│ 6. anti theme: block group theme change\n│ 7. anti qtv: block admin change (avoid group theft)\n│ 8. anti join: block adding new members\n│ 9. check anti status of the group\n├────────⭔\n│ 📌 Reply with the number to select the mode you want to toggle\n╰─────────────⭓`,
          threadID, (error, info) => {
              if (error) {
                return api.sendMessage("❎ An error occurred!", threadID);
              } else {
                global.client.handleReply.push({
                  name: this.config.name,
                  messageID: info.messageID,
                  author: senderID,
                  permssion
            });
         }
     }, messageID);
  };