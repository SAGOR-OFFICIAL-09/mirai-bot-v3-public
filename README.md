# Mirai Bot V3 🤖

A Facebook Messenger chatbot built on the Mirai V3 framework, customized with automatic noprefix, command aliases, and Asia/Dhaka timezone.

## ✨ Features

- 💬 **Messenger chatbot** — auto reply, group management, fun commands
- ⚡ **Automatic noprefix** — every command works with or without prefix (`ping` or `!ping`)
- 🔗 **Command aliases** — give any command alternative names via `aliases: []`
- 🌍 **Timezone** — Asia/Dhaka
- 🗣️ **Language** — English
- 🔄 **Auto-restart** — `index.js` restarts the bot if it crashes
- 🍪 **Cookie login** — via the `FACEBOOK_COOKIE` Replit Secret or a local ignored `cookie.txt`

## 📋 Requirements

- [Node.js](https://nodejs.org/en/) v20 or higher
- A Facebook account to use as the bot (a spare account is recommended)

## ⚙️ Installation

```sh
# 1. Clone the repo
git clone https://github.com/SAGOR-OFFICIAL-09/mirai-bot-v3.git
cd mirai-bot-v3

# 2. Install dependencies
npm install

# 3. Configure the bot
#    Edit config.json — set PREFIX, BOTNAME, ADMINBOT ids, etc.
#    See config.guide.md for a full explanation of every option.

# 4. Add your Facebook cookie securely
#    On Replit, save it as the FACEBOOK_COOKIE secret.
#    For local development, use an ignored cookie.txt file.

# 5. Start the bot
npm start
```

> ⚠️ **Never commit or share your Facebook cookie** — anyone with it can access your account.
> If a cookie was committed to a public repository, rotate the session; removing the file
> from the latest commit does not erase it from Git history.

## 🗂️ Project Structure

```
├── index.js              # Entry point (npm start) — auto-restarts the bot
├── includes/
│   ├── sagor.js          # Main bot file
│   ├── handle/           # Command / event / schedule handlers
│   ├── controllers/      # Users, threads, currencies controllers
│   └── database/         # Database setup & models
├── script/
│   ├── commands/         # Bot commands (20 built-in)
│   └── events/           # Bot events (join / leave notifications)
├── sagor-fca/            # Facebook chat API (vendored)
├── config.json           # Bot settings — see config.guide.md
├── config.guide.md       # Bengali guide for every config option
└── cookie.txt            # Optional local cookie (ignored by Git)
```

## ⌨️ Commands

Type `menu` (or `!menu`) in chat to see all commands.

**Noprefix:** all commands work without any prefix. `ping`, `help`, `menu` — just type the name.

**Aliases:** each command supports alternative names:

```js
module.exports.config = {
    name: "ping",
    aliases: ["p", "pong"],   // "p" or "pong" also runs this command
    ...
};
```

## 🛠️ Configuration

All settings live in `config.json`:

| Setting | Description |
|---|---|
| `BOTNAME` | Bot display name |
| `PREFIX` | Command prefix (default `!`) |
| `language` | Bot language (`en`) |
| `ADMINBOT` | Bot admin Facebook IDs |
| `NDH` | Supporter Facebook IDs |
| `commandDisabled` | Commands to disable |
| `eventDisabled` | Events to disable |

📖 **Full option guide (Bengali):** [`config.guide.md`](config.guide.md)

## 📝 Notes

- The bot logs in using **only** `cookie.txt` — no email/password needed.
- Timezone is fixed to **Asia/Dhaka**.
- `package-lock.json` and the database file are auto-generated — no need to commit them.

## 📄 License

GPL-3.0 — based on Mirai Bot V3 by Sagor.
