# config.json গাইড (বাংলায়)

এই ফাইল থেকে তোমার বটের সব সেটিং বদলাতে পারবে। শুধু `config.json` এডিট করলেই হবে, কোডে হাত দিতে হবে না।

## 🤖 বটের পরিচয়

| সেটিং | মানে | উদাহরণ |
|---|---|---|
| `BOTNAME` | বটের নাম (মেনুতে দেখায়) | `"Mirai-V3-Unofficial"` |
| `PREFIX` | কমান্ডের আগে যে চিহ্ন দিতে হয় | `"!"` → `!ping` |
| _(noprefix)_ | ✅ সব command সবসময় automatic prefix ছাড়া চলে — কিছুই করতে হবে না | `ping` বা `!ping` দুটোই কাজ করে, নতুন command-ও automatic |
| `language` | বটের ভাষা (`en` / `vi`) | `"en"` |

## 🛡️ ReactBy (reaction guard)

কেউ bot-এর message-এ খারাপ react দিলে bot action নেবে:

```json
"reactBy": {
    "enable": true,          // on/off
    "unsend": ["😡", "🤬"],   // এই emoji দিলে bot নিজের message delete করে দেবে
    "kick": []               // এই emoji দিলে reactor-কে group থেকে kick করবে
}
```

💡 শুধু **bot-এর নিজের message**-এ react দিলেই কাজ করে।

## 🔒 Whitelist Mode

```json
"whiteListMode": {
    "enable": false,          // true করলে শুধু নিচের ID-রা bot ব্যবহার করতে পারবে
    "whiteListIds": ["10001", "10002"]
},
"whiteListModeThread": {
    "enable": false,          // true করলে শুধু নিচের group-গুলোতে bot কাজ করবে
    "whiteListThreadIds": ["20001"]
}
```

💡 Bot admin-রা সবসময় bypass করে (নিজেকে lockout হওয়ার ভয় নেই)।

## 📱 Telegram Notification

Bot-এর সব খবর Telegram-এ পাবে:

```json
"telegram": {
    "enable": true,
    "botToken": "123456:ABC-DEF...",
    "chatId": "987654321"
}
```

**যা যা যাবে:**
- 🤖 Bot start হলে (কয়টা command load হলো)
- ⏰ প্রতি ঘণ্টায় uptime check
- ❌ কোনো command-এ error হলে
- 🚨 Bot crash করলে

💡 **Token/ID কীভাবে পাবে:**
1. Telegram-এ @BotFather-কে `/newbot` পাঠিয়ে bot বানাও → **token** দেবে
2. @userinfobot-কে message দাও → **chatId** দেবে
3. দুটোই config.json-এ বসিয়ে `"enable": true` করো

## 👑 অ্যাডমিন

| সেটিং | মানে | উদাহরণ |
|---|---|---|
| `ADMINBOT` | বট অ্যাডমিনদের Facebook ID (লিস্ট) | `["100001234567890"]` |
| `NDH` | সাপোর্টারদের Facebook ID (লিস্ট) | `["502275138"]` |
| `FACEBOOK_ADMIN` | তোমার Facebook ID | `"100001234567890"` |
| `BOXADMIN` | অ্যাডমিন গ্রুপের thread ID | `"6804616456270022"` |

💡 **Facebook ID বের করা:** https://findmyfbid.in সাইটে প্রোফাইল লিংক দিলেই ID পাবে।

## ⚙️ চালু/বন্ধ

| সেটিং | মানে |
|---|---|
| `DeveloperMode` | `true` করলে প্রতিটা কমান্ডের লগ দেখাবে (ডিবাগের জন্য) |
| `autoCreateDB` | `true` থাকলে ডাটাবেজ নিজে নিজে তৈরি হবে |
| `allowInbox` | `true` থাকলে ইনবক্সেও (গ্রুপ ছাড়া) বট কাজ করবে |
| `commandDisabled` | যেসব কমান্ড বন্ধ রাখতে চাও → `["ban", "kick"]` |
| `eventDisabled` | যেসব ইভেন্ট বন্ধ রাখতে চাও → `["joinNoti"]` |

## 📋 মেনু সেটিং

```json
"menu": {
    "autoUnsend": {
        "status": true,   // মেনু মেসেজ নিজে নিজে ডিলিট হবে কিনা
        "timeOut": 60     // কত সেকেন্ড পর ডিলিট হবে
    }
}
```

## 🔌 FCAOption (সাধারণত বদলানোর দরকার নেই)

Facebook কানেকশনের সেটিং। ডিফল্ট যেমন আছে তেমনই রাখো।

| সেটিং | মানে |
|---|---|
| `forceLogin` | জোর করে লগইন করবে |
| `listenEvents` | গ্রুপ ইভেন্ট (join/leave) শুনবে |
| `updatePresence` | অনলাইন স্ট্যাটাস আপডেট করবে |
| `listenTyping` | টাইপিং দেখবে |
| `logLevel` | লগের পরিমাণ (`error` = শুধু এরর) |
| `selfListen` | নিজের মেসেজেও রেসপন্ড করবে |
| `selfListenEvent` | নিজের ইভেন্টেও রেসপন্ড করবে |
| `autoMarkDelivery` | মেসেজ ডেলিভারি মার্ক করবে |
| `autoReconnect` | কানেকশন গেলে আবার কানেক্ট করবে |

---

⚠️ **নোট:** বট লগইন করে শুধু `cookie.txt` দিয়ে — তাই config-এ EMAIL/PASSWORD লাগে না (সরিয়ে দেওয়া হয়েছে)।
