module.exports.config = {
    name: "money",
    aliases: [],
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Sagor",
    description: "set and check money?",
    commandCategory: "User",
    usages: "/money [ + , - , * , / , ++ , -- , +- , +% , -% ]",
    cooldowns: 0,
    usePrefix: false,
  };
  
  module.exports.run = async function ({ Currencies, api, event, args, Users,permssion }) {
    const axios = require("axios")
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;
    let targetID = senderID;
    if (type == 'message_reply') {
    targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    }
    const name = (await Users.getNameUser(targetID))
    const i = (url) => axios.get(url, { responseType: "stream", }).then((r) => r.data);
    const link = "https://files.catbox.moe/shxujt.gif";
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Dhaka").format('HH:mm:ss - DD/MM/YYYY');
    const money = (await Currencies.getData(targetID)).money;
    const mon = args[1]
    try { switch (args[0]) {
    case "+": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID,parseInt(mon))
    return api.sendMessage({body:`💸 ${name}'s money increased by ${mon}$\n💸 Balance now ${money + parseInt(mon)}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
       
    case "-": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID,parseInt(-mon))
    return api.sendMessage({body:`💸 ${name}'s money decreased by ${mon}$\n💸 Balance now ${money - mon}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
       
    case "*": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID, parseInt(money * (args[1] - 1)))
    return api.sendMessage({body:`💸 ${name}'s money multiplied by ${mon} times\n💸 Balance now ${money * mon}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
       
    case "/": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID, parseInt(-money + (money / mon)))
    return api.sendMessage({body:`💸 ${name}'s money divided by ${args[1]} times\n💸 Balance now ${money / mon}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
       
    case "++": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID, Infinity);
    return api.sendMessage({body:`💸 ${name}'s money set to unlimited\n💸 Balance now Infinity$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
       
    case "--": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.decreaseMoney(targetID, parseInt(money))
    return api.sendMessage({body:`💸 ${name}'s money has been reset\n💸 Balance now 0$\n⏰ ${time}`,attachment: await i(link)},event.threadID)}
       
    case "+-": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.decreaseMoney(targetID, parseInt(money))
    await Currencies.increaseMoney(targetID, parseInt(mon))
    return api.sendMessage({body:`💸 ${name}'s money set to ${mon}$\n💸 Current money ${mon}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
       
    case "^": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID, parseInt(-money + Math.pow(money, mon)))
    return api.sendMessage({body:`💸 ${name} 's money raised to the power of ${mon} times\n💸 Current money ${Math.pow(money, mon)}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
  
    case "√": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID, parseInt(-money + Math.pow(money, 1/args[1])))
    return api.sendMessage({body:`💸 ${name} 's money rooted by ${args[1]}\n💸 Balance now ${Math.pow(money, 1/args[1])}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
  
    case "+%": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID, parseInt(money / (100 / args[1])))
    return api.sendMessage({body:`💸 ${name}'s money increased by ${args[1]}%\n💸 Balance now ${money + (money / (100 / args[1]))}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
  
    case "-%": {
    if(permssion < 2) return api.sendMessage("You don't have permission",event.threadID)
    await Currencies.increaseMoney(targetID, parseInt(-(money / (100 / args[1]))))
    return api.sendMessage({body:`💸 ${name}'s money decreased by ${args[1]}%\n💸 Balance now ${money - (money / (100 / args[1]))}$\n⏰ ${time}`,attachment:await i(link)},event.threadID)}
        
    case "pay": {
    const money2 = (await Currencies.getData(event.senderID)).money;
    var bet = args[1] === 'all' ? money2 : args[1]
    if (money < 1) return api.sendMessage({body:"You have less than 1$ or the transfer amount exceeds your balance",attachment: await i(link)},event.threadID)
    await Currencies.increaseMoney(event.senderID, parseInt(-bet))
    await Currencies.increaseMoney(targetID, parseInt(bet))
   return api.sendMessage(`Transferred ${name} ${bet}$`,event.threadID)}
  } 
        } catch(e) {console.log(e)}
    if (money === Infinity) return api.sendMessage(`${name} has unlimited money`,event.threadID)
    if (money === null) return api.sendMessage(`${name} has 0$`,event.threadID)
    if (!args[0] || !args[1]) return api.sendMessage(`${name} has ${money}$`,event.threadID)
  }