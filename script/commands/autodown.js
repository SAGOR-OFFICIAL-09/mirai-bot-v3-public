const axios = require('axios');
const BASE_URL = 'http://dongdev.click/api/down/media';

this.config = {
  name: "autodown",
  aliases: [],
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Sagor", 
  description: "Autodown Facebook, Tiktok, YouTube, Instagram, Bilibili, Douyin, Capcut, Threads",
  commandCategory: "Utilities",
  usages: "[]",
  cooldowns: 5,
  prefix: true
};
this.handleEvent = async ({ api, event, args }) => {
  if (event.senderID == api.getCurrentUserID()) return;
  if (!args) return;
  let stream = (url, ext = 'jpg') => require('axios').get(url, { responseType: 'stream' }).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  const head = app => `[ AUTODOWN - ${app} ]\n────────────────`;
  for (const url of args) {
    let res;
    try {
      res = (await axios.get(`${BASE_URL}?url=${encodeURIComponent(url)}`, { timeout: 30000 })).data;
    } catch (e) {
      send('[ AUTODOWN ]\n\u09a1\u09be\u0989\u09a8\u09b2\u09cb\u09a1 \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8 \u098f\u0996\u09a8 \u09ac\u09a8\u09cd\u09a7 \u0986\u099b\u09c7, \u09aa\u09b0\u09c7 \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09cb\u0964');
      continue;
    }
    if (/(^https:\/\/)(\w+\.|m\.)?(facebook|fb)\.(com|watch)\//.test(url)) {
      if (res.attachments && res.attachments.length > 0) {
        let attachment = [];
        if (res.queryStorieID) {
            const match = res.attachments.find(item => item.id == res.queryStorieID);
            if (match && match.type === 'Video') {
                const videoUrl = match.url.hd || match.url.sd;
                attachment.push(await stream(videoUrl, 'mp4'));
            } else if (match && match.type === 'Photo') {
                const photoUrl = match.url;
                attachment.push(await stream(photoUrl, 'jpg'));
            }
        } else {
            for (const attachmentItem of res.attachments) {
                if (attachmentItem.type === 'Video') {
                    const videoUrl = attachmentItem.url.hd || attachmentItem.url.sd;
                    attachment.push(await stream(videoUrl, 'mp4'));
                } else if (attachmentItem.type === 'Photo') {
                    attachment.push(await stream(attachmentItem.url, 'jpg'));
                }
            }
        }
        send({ body: `${head('FACEBOOK')}\n⩺ Title: ${res.message || "No title"}\n${res.like ? `⩺ Likes: ${res.like}\n` : ''}${res.comment ? `⩺ Comments: ${res.comment}\n` : ''}${res.share ? `⩺ Shares: ${res.share}\n` : ''}⩺ Author: ${res.author || "unknown"}`.trim(), attachment });
      }
    } else if (/^(https:\/\/)(www\.|vt\.|vm\.|m\.|web\.|v\.|mobile\.)?(tiktok\.com|t\.co|twitter\.com|youtube\.com|instagram\.com|bilibili\.com|douyin\.com|capcut\.com|threads\.net)\//.test(url)) {
      const platform = /tiktok\.com/.test(url) ? 'TIKTOK' : /twitter\.com/.test(url) ? 'TWITTER' : /youtube\.com/.test(url) ? 'YOUTUBE' : /instagram\.com/.test(url) ? 'INSTAGRAM' : /bilibili\.com/.test(url) ? 'BILIBILI' : /douyin\.com/.test(url) ? 'DOUYIN' : /threads\.net/.test(url) ? 'THREADS' : /capcut\.com/.test(url) ? 'CAPCUT' : 'UNKNOWN';
      let attachments = [];        
      if (res.attachments && res.attachments.length > 0) {
          for (const at of res.attachments) {
             if (at.type === 'Video') {
                  attachments.push(await stream(at.url, 'mp4'));
             } else if (at.type === 'Photo') {
                  attachments.push(await stream(at.url, 'jpg'));
             } else if (at.type === 'Audio') {
                  attachments.push(await stream(at.url, 'mp3'));
                }
           }
        send({ body: `${head(platform)}\n⩺ Title: ${res.message || "No title"}`, attachment: attachments });
      }
    }
  }
};

this.run = async () => {};