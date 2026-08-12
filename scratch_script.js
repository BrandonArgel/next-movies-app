const fs = require('fs');

const enUs = JSON.parse(fs.readFileSync('src/messages/en-US.json', 'utf8'));
const zhCn = JSON.parse(fs.readFileSync('src/messages/zh-CN.json', 'utf8'));

const missing = [];

function findMissing(en, zh, path = "") {
    for (const key in en) {
        if (!(key in zh)) {
            missing.push(path + key);
            zh[key] = en[key];
        } else if (typeof en[key] === 'object' && en[key] !== null) {
            findMissing(en[key], zh[key], path + key + ".");
        }
    }
}

findMissing(enUs, zhCn);
console.log("Missing keys added to zh-CN:", missing);

fs.writeFileSync('src/messages/zh-CN-merged.json', JSON.stringify(zhCn, null, 2), 'utf8');
