// ============================================================
//  Telegram notifier — sends bot status/errors to Telegram.
//  Configure in config.json:
//    "telegram": { "enable": true, "botToken": "...", "chatId": "..." }
//  Get botToken from @BotFather, chatId from @userinfobot.
// ============================================================
const axios = require("axios");

function isEnabled() {
  const cfg = global.config && global.config.telegram;
  return !!(cfg && cfg.enable && cfg.botToken && cfg.chatId);
}

// fire-and-forget safe: never throws, never blocks the bot
async function send(text) {
  if (!isEnabled()) return false;
  const cfg = global.config.telegram;
  try {
    await axios.post(
      `https://api.telegram.org/bot${cfg.botToken}/sendMessage`,
      { chat_id: cfg.chatId, text: String(text).slice(0, 4000) },
      { timeout: 15000 }
    );
    return true;
  } catch (e) {
    console.error("[Telegram] notify failed:", e.message);
    return false;
  }
}

function formatUptime() {
  const s = Math.floor(process.uptime());
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

module.exports = { send, isEnabled, formatUptime };
