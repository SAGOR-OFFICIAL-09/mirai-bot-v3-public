// ============================================================
//  COMMAND TEMPLATE
//  How to make a new command:
//  1. Copy this file and rename it (example: mycommand.js)
//     - the file name MUST NOT contain the word "example"
//  2. Change "name" below to your command name
//  3. Write your code inside run()
//  4. Restart the bot (or use: cmd load <name>)
// ============================================================

module.exports.config = {
  name: "mycommand",        // <-- CHANGE THIS: the word you type in chat
  aliases: [],              // other names that also run it, example: ["mc", "myc"]
  version: "1.0.0",
  hasPermssion: 0,          // 0 = everyone | 1 = group admin | 2 = bot admin
  credits: "Sagor",
  description: "Write what your command does here",
  commandCategory: "Tools", // group name shown in the menu
  usages: "[text]",         // example usage shown in help
  cooldowns: 5              // seconds a user must wait before using again
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, senderID } = event;

  // args = words typed after the command name
  // example: "mycommand hello world"  ->  args = ["hello", "world"]
  const text = args.join(" ");

  if (!text) {
    return api.sendMessage(
      `❌ Please give me some text.\n📌 Usage: mycommand [text]`,
      threadID, messageID
    );
  }

  // ---- your code starts here ----

  return api.sendMessage(`✅ You said: ${text}`, threadID, messageID);

  // ---- your code ends here ----
};

// ============================================================
//  USEFUL THINGS YOU CAN USE:
// ------------------------------------------------------------
//  api.sendMessage("hello", threadID, messageID)
//      -> send a message (messageID = reply to the user)
//
//  event.senderID
//      -> Facebook ID of the person who used the command
//
//  (await Users.getName(senderID))
//      -> name of the person
//
//  args[0], args[1], ...
//      -> first word, second word, ...
// ============================================================
