module.exports.config = {
    name: 'listbox',
    aliases: [],
    version: '1.0.0',
    credits: "Sagor",
    hasPermssion: 3,
    description: '[Ban/Unban/Remove] List threads the bot has joined',
    commandCategory: 'System',
    images: [],
    usages: '[page number/all]',
    cooldowns: 5
};

module.exports.handleReply = async function({ api, event, args, Threads, handleReply }) {
    const { threadID, messageID } = event;
    if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
    var arg = event.body.split(" ");
    //var idgr = handleReply.groupid[arg[1] - 1];
    //var groupName = handleReply.groupName[arg[1] - 1];
    switch (handleReply.type) {
        case "reply":
            {
                if (arg[0] == "ban" || arg[0] == "Ban") {
                    var arrnum = event.body.split(" ");
                    var msg = "";
                    var modules = "[ 𝐌𝐎𝐃𝐄 ] - 𝗧𝗵𝘂̛̣𝗰 𝘁𝗵𝗶 𝗯𝗮𝗻 «\n"
                    var nums = arrnum.map(n => parseInt(n));
                    nums.shift();
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];

                        const data = (await Threads.getData(idgr)).data || {};
                        data.banned = true;
                        data.dateAdded = time;
                        var typef = await Threads.setData(idgr, { data });
                        global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
                        msg += typef + ' ' + groupName + '\n𝗧𝗜𝗗: ' + idgr + "\n";
                        console.log(modules, msg)
                    }
                    api.sendMessage(`=== [ 𝗕𝗔𝗡 𝗚𝗥𝗢𝗨𝗣 ] ===\n🎀 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱 𝗼𝗿𝗱𝗲𝗿 𝗳𝗿𝗼𝗺 𝗮𝗱𝗺𝗶𝗻, 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝘁𝗼 𝗯𝗮𝗻 𝗴𝗿𝗼𝘂𝗽.\n𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗮𝗱𝗺𝗶𝗻 𝘁𝗼 𝗴𝗲𝘁 𝘂𝗻𝗯𝗮𝗻𝗻𝗲𝗱\n🌐 𝗳𝗯 𝗮𝗱𝗺𝗶𝗻:\nfb.com/100068096370437`, idgr, () =>
                        api.sendMessage(`${global.data.botID}`, () =>
                            api.sendMessage(` [ 𝐌𝐎𝐃𝐄 ] - 𝗧𝗵𝘂̛̣𝗰 𝘁𝗵𝗶 𝗯𝗮𝗻 «\n(true/false) «\n\n ${msg}`, threadID, () =>
                                api.unsendMessage(handleReply.messageID))));
                    break;
                }

                if (arg[0] == "unban" || arg[0] == "Unban" || arg[0] == "ub" || arg[0] == "Ub") {
                    var arrnum = event.body.split(" ");
                    var msg = "";
                    var modules = "[ 𝐌𝐎𝐃𝐄 ] - 𝗧𝗵𝘂̛̣𝗰 𝘁𝗵𝗶 𝘂𝗻𝗯𝗮𝗻\n"
                    var nums = arrnum.map(n => parseInt(n));
                    nums.shift();
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];

                        const data = (await Threads.getData(idgr)).data || {};
                        data.banned = false;
                        data.dateAdded = null;
                        var typef = await Threads.setData(idgr, { data });
                        global.data.threadBanned.delete(idgr, 1);
                        msg += typef + ' ' + groupName + '\n𝗧𝗜𝗗: ' + idgr + "\n";
                        console.log(modules, msg)
                    }
                    api.sendMessage(`=== [ 𝗨𝗡𝗕𝗔𝗡 ] ===\n━━━━━━━━━━━━━━━━━━\n🎀 𝗬𝗼𝘂𝗿 𝗚𝗿𝗼𝘂𝗽 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱\n🎊 𝗪𝗶𝘀𝗵𝗶𝗻𝗴 𝘆𝗼𝘂𝗮̣𝗻 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗯𝗼𝘁 𝘃𝘃`, idgr, () =>
                        api.sendMessage(`${global.data.botID}`, () =>
                            api.sendMessage(`» [ 𝐌𝐎𝐃𝐄 ] - 𝗧𝗵𝘂̛̣𝗰 𝘁𝗵𝗶 𝘂𝗻𝗯𝗮𝗻 «(true/false)\n\n${msg}`, threadID, () =>
                                api.unsendMessage(handleReply.messageID))));
                    break;
                }

                if (arg[0] == "out" || arg[0] == "Out") {
                    var arrnum = event.body.split(" ");
                    var msg = "";
                    var modules = "[ 𝐌𝐎𝐃𝐄 ] - 𝗧𝗵𝘂̛̣𝗰 𝘁𝗵𝗶 𝗢𝘂𝘁\n"
                    var nums = arrnum.map(n => parseInt(n));
                    nums.shift();
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];
                        var typef = api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
                        msg += typef + ' ' + groupName + '\n» TID: ' + idgr + "\n";
                        console.log(modules, msg)
                    }
                    api.sendMessage(`== [ 𝗹𝗲𝗮𝘃𝗲 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽 ] ==\n━━━━━━━━━━━━━━━━━━\n🎊 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱 𝗼𝗿𝗱𝗲𝗿 𝗳𝗿𝗼𝗺 𝗮𝗱𝗺𝗶𝗻\n💞 𝗜'𝗺 𝗹𝗲𝗮𝘃𝗶𝗻𝗴, 𝗯𝘆𝗲\n🌹 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗮𝗱𝗺𝗶𝗻 𝘁𝗼 𝘂𝘀𝗲 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗮𝗴𝗮𝗶𝗻\n🌐 𝗳𝗯 𝗮𝗱𝗺𝗶𝗻:\nfb.com/100068096370437`, idgr, () =>
                        api.sendMessage(`${global.data.botID}`, () =>
                            api.sendMessage(`[ 𝐌𝐎𝐃𝐄 ] - 𝘁𝗵𝘂̛̣𝗰 𝘁𝗵𝗶 𝗼𝘂𝘁\n(true/false)\n\n${msg} `, threadID, () =>
                                api.unsendMessage(handleReply.messageID))));
                    break;
                }
            }
    }
};
module.exports.run = async function({ api, event, args }) {
  const permission = ["100074278195157"];
  if (!permission.includes(event.senderID)) return api.sendMessage("❎ You don't have permission :))", event.threadID, event.messageID);
    switch (args[0]) {
        case "all":
            {
                var inbox = await api.getThreadList(100, null, ['INBOX']);
                let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
                var listthread = [];
                var listbox = [];
                /////////
                for (var groupInfo of list) {
                    //let data = (await api.getThreadInfo(groupInfo.threadID));
                    //const listUserID = event.participantIDs.filter(ID => ID);
                    listthread.push({
                        id: groupInfo.threadID,
                        name: groupInfo.name || "Unnamed",
                        participants: groupInfo.participants.length
                    });
                }
                /////////
                var listbox = listthread.sort((a, b) => {
                    if (a.participants > b.participants) return -1;
                    if (a.participants < b.participants) return 1;
                });
                /////////  
                var groupid = [];
                var groupName = [];
                var page = 1;
                page = parseInt(args[0]) || 1;
                page < -1 ? page = 1 : "";
                var limit = 100000;
                var msg = "====『 𝗟𝗜𝗦𝗧 𝗡𝗛𝗢́𝗠 』====\n━━━━━━━━━━━━━━━━━━\n\n";
                var numPage = Math.ceil(listbox.length / limit);

                for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                    if (i >= listbox.length) break;
                    let group = listbox[i];
                    msg += `━━━━━━━━━━━━━━━━━━\n${i + 1}. ${group.name}\n💌 𝗧𝗜𝗗: ${group.id}\n👤 𝗦𝗼̂́ 𝘁𝗵𝗮̀𝗻𝗵 𝘃𝗶𝗲̂𝗻: ${group.participants}\n\n`;
                    groupid.push(group.id);
                    groupName.push(group.name);
                }
                msg += `\n𝗧𝗿𝗮𝗻𝗴 ${page}/${numPage}\n𝗗𝘂̀𝗻𝗴 ${global.config.PREFIX}𝗹𝗶𝘀𝘁𝗯𝗼𝘅 + 𝘀𝗼̂́ 𝘁𝗿𝗮𝗻𝗴/𝗮𝗹𝗹\n\n`

                api.sendMessage(msg + "━━━━━━━━━━━━━━━━━━\n→ 𝗥𝗲𝗽𝗹𝘆 𝗢𝘂𝘁, 𝗕𝗮𝗻, 𝗨𝗻𝗯𝗮𝗻 + 𝗻𝘂𝗺𝗯𝗲𝗿, \n→ 𝘆𝗼𝘂 𝗰𝗮𝗻 𝗿𝗲𝗽 𝗻𝗵𝗶𝗲̂̀𝘂 𝘀𝗼̂́, 𝗰𝗮́𝗰𝗵 𝗻𝗵𝗮𝘂 𝗯𝗮̆̀𝗻𝗴 𝗱𝗮̂́𝘂 𝗰𝗮́𝗰𝗵 đ𝗲̂̉ 𝗢𝘂𝘁, 𝗕𝗮𝗻, 𝗨𝗻𝗯𝗮𝗻 𝘁𝗵𝗿𝗲𝗮𝗱 đ𝗼́ 🌹", event.threadID, (e, data) =>
                    global.client.handleReply.push({
                        name: this.config.name,
                        author: event.senderID,
                        messageID: data.messageID,
                        groupid,
                        groupName,
                        type: 'reply'
                    })
                )
            }
            break;

        default:
            try {
                var inbox = await api.getThreadList(100, null, ['INBOX']);
                let list = [...inbox].filter(group =>  group.isSubscribed && group.isGroup);
                var listthread = [];
                var listbox = [];
                /////////
                for (var groupInfo of list) {
                    //let data = (await api.getThreadInfo(groupInfo.threadID));
                    //const listUserID = event.participantIDs.filter(ID => ID);
                    listthread.push({
                        id: groupInfo.threadID,
                        name: groupInfo.name || "Unnamed",
messageCount: groupInfo.messageCount,
                        participants: groupInfo.participants.length
                    });

                } //for
                var listbox = listthread.sort((a, b) => {
                    if (a.participants > b.participants) return -1;
                    if (a.participants < b.participants) return 1;
                });
                var groupid = [];
                var groupName = [];
                var page = 1;
                page = parseInt(args[0]) || 1;
                page < -1 ? page = 1 : "";
                var limit = 100;
                var msg = "=====『 𝗟𝗜𝗦𝗧 𝗡𝗛𝗢́𝗠 』=====\n\n";
                var numPage = Math.ceil(listbox.length / limit);

                for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                    if (i >= listbox.length) break;
                    let group = listbox[i];
                    msg += `━━━━━━━━━━━━━━━━━━\n${i + 1}. ${group.name}\n[🔰] → 𝗧𝗜𝗗: ${group.id}\n[👤] → 𝗦𝗼̂́ 𝘁𝗵𝗮̀𝗻𝗵 𝘃𝗶𝗲̂𝗻: ${group.participants}\n[💬] → 𝗧𝗼̂̉𝗻𝗴 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻: ${group.messageCount}\n`;
                    groupid.push(group.id);
                    groupName.push(group.name);
                }
                msg += `\n→ 𝗧𝗿𝗮𝗻𝗴 ${page}/${numPage}\𝗗𝘂̀𝗻𝗴 ${global.config.PREFIX}𝗹𝗶𝘀𝘁𝗯𝗼𝘅 + 𝘀𝗼̂́ 𝘁𝗿𝗮𝗻𝗴/𝗮𝗹𝗹\n`

                api.sendMessage(msg + "━━━━━━━━━━━━━━━━━━\n→ 𝗥𝗲𝗽𝗹𝘆 𝗢𝘂𝘁, 𝗕𝗮𝗻, 𝗨𝗻𝗯𝗮𝗻 + 𝗻𝘂𝗺𝗯𝗲𝗿, \n→ 𝘆𝗼𝘂 𝗰𝗮𝗻 𝗿𝗲𝗽 𝗻𝗵𝗶𝗲̂̀𝘂 𝘀𝗼̂́, 𝗰𝗮́𝗰𝗵 𝗻𝗵𝗮𝘂 𝗯𝗮̆̀𝗻𝗴 𝗱𝗮̂́𝘂 𝗰𝗮́𝗰𝗵 đ𝗲̂̉ 𝗢𝘂𝘁, 𝗕𝗮𝗻, 𝗨𝗻𝗯𝗮𝗻 𝘁𝗵𝗿𝗲𝗮𝗱 đ𝗼́ 🌹", event.threadID, (e, data) =>
                    global.client.handleReply.push({
                        name: this.config.name,
                        author: event.senderID,
                        messageID: data.messageID,
                        groupid,
                        groupName,
                        type: 'reply'
                    })
                )
            } catch (e) {
                return console.log(e)
            }
    }
};