const crypto = require('crypto');
const os = require("os");
const { createWriteStream } = require('fs');
const axios = require('axios');

const utils = {
    throwError: function (command, threadID, messageID) {
        const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
        return global.client.api.sendMessage(global.getText("utils", "throwError", ((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX), command), threadID, messageID);
    },

    // Auto-detects cookie format and converts to appState array.
    // Supported: cookie string, JSON appState array, JSON object,
    // Netscape cookie file, multiline key=value.
    parseCookies: function (cookies) {
        const raw = String(cookies || '').trim();
        if (!raw) return [];
        const now = new Date().toISOString();
        const toAppState = (key, value) => ({
            key: String(key).trim(),
            value: String(value),
            domain: "facebook.com",
            path: "/",
            hostOnly: false,
            creation: now,
            lastAccessed: now
        });

        // 1. JSON appState array: [{"key":"c_user","value":"..."}, ...]
        if (raw.startsWith('[')) {
            try {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) {
                    const out = arr
                        .filter(c => c && (c.key || c.name) && c.value !== undefined && c.value !== null)
                        .map(c => toAppState(c.key || c.name, c.value));
                    if (out.length) return out;
                }
            } catch (e) {}
        }

        // 2. JSON object: {"c_user":"123", ...}
        if (raw.startsWith('{')) {
            try {
                const obj = JSON.parse(raw);
                if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                    const out = Object.entries(obj)
                        .filter(([k, v]) => k && v !== undefined && v !== null && String(v).length)
                        .map(([k, v]) => toAppState(k, v));
                    if (out.length) return out;
                }
            } catch (e) {}
        }

        // 3. Netscape cookie file (tab-separated)
        if (raw.includes('\t') && /facebook\.com/i.test(raw)) {
            const out = [];
            for (const line of raw.split(/\r?\n/)) {
                const lineTrim = line.trim();
                if (!lineTrim || lineTrim.startsWith('#')) continue;
                const parts = lineTrim.split('\t');
                if (parts.length >= 7 && parts[5] && parts[6] !== undefined) {
                    out.push(toAppState(parts[5], parts[6]));
                }
            }
            if (out.length) return out;
        }

        // 4. classic cookie string (also handles "Cookie:" prefix,
        //    "useragent=" suffix and multiline key=value)
        let str = raw.replace(/^Cookie:\s*/i, '');
        if (str.includes('useragent=')) str = str.split('useragent=')[0];
        str = str.replace(/\r?\n/g, ';');
        return str.split(';').map(pair => {
            const idx = pair.indexOf('=');
            if (idx < 0) return undefined;
            const key = pair.slice(0, idx).trim();
            const value = pair.slice(idx + 1).trim();
            return (key && value !== undefined) ? toAppState(key, value) : undefined;
        }).filter(Boolean);
    },

    cleanAnilistHTML: function (text) {
        return text
            .replace('<br>', '\n')
            .replace(/<\/?(i|em)>/g, '*')
            .replace(/<\/?b>/g, '**')
            .replace(/~!|!~/g, '||')
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", '"')
            .replace("&#039;", "'");
    },

    downloadFile: async function (url, path) {
        const response = await axios({
            method: 'GET',
            responseType: 'stream',
            url
        });

        const writer = createWriteStream(path);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    },

    getContent: async function (url) {
        try {
            const response = await axios({
                method: 'GET',
                url
            });

            return response;
        } catch (e) {
            console.log(e);
        }
    },

    randomString: function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length || 5;
        for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    },

    AES: {
        encrypt(cryptKey, crpytIv, plainData) {
            var encipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(crpytIv));
            var encrypted = encipher.update(plainData);
            encrypted = Buffer.concat([encrypted, encipher.final()]);
            return encrypted.toString('hex');
        },
        decrypt(cryptKey, cryptIv, encrypted) {
            encrypted = Buffer.from(encrypted, "hex");
            var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(cryptIv, 'binary'));
            var decrypted = decipher.update(encrypted);

            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return String(decrypted);
        },
        makeIv() { return Buffer.from(crypto.randomBytes(16)).toString('hex').slice(0, 16); }
    },

    homeDir: function () {
        var returnHome, typeSystem;
        const home = process.env["HOME"];
        const user = process.env["LOGNAME"] || process.env["USER"] || process.env["LNAME"] || process.env["USERNAME"];

        switch (process.platform) {
            case "win32": {
                returnHome = process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
                typeSystem = "win32"
                break;
            }
            case "darwin": {
                returnHome = home || (user ? '/Users/' + user : null);
                typeSystem = "darwin";
                break;
            }
            case "linux": {
                returnHome = home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
                typeSystem = "linux"
                break;
            }
            default: {
                returnHome = home || null;
                typeSystem = "unknow"
                break;
            }
        }

        return [typeof os.homedir === 'function' ? os.homedir() : returnHome, typeSystem];
    }
};

module.exports = utils;