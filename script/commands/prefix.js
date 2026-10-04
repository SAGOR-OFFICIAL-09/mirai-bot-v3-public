const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "prefix",
  aliases: [],
  version: "2.0.0",
  hasPermission: 0,
  credits: "Sagor",
  description: "prefix bot",
  commandCategory: "System",
  usages: "[]",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, client }) {
  const { threadID, body } = event;
  if (!body) return;

  const { PREFIX } = global.config;
  const gio = moment.tz("Asia/Dhaka").format("HH:mm:ss || DD/MM/YYYY");

  let threadSetting = global.data.threadData.get(threadID) || {};
  let prefix = threadSetting.PREFIX || PREFIX;

  const lowerBody = body.toLowerCase();

  if (
    lowerBody === "prefix" ||
    lowerBody === "what is the bot prefix" ||
    lowerBody === "forgot prefix" ||
    lowerBody === "how to use"
  ) {
    api.sendMessage(
      `✏️ Group prefix: ${prefix}\n📎 System prefix: ${PREFIX}`,
      threadID,
      event.messageID
    );
  }
};

module.exports.run = async function () {};