const fs = require('fs');
const path = require('path');

const extFile = 'C:\\Users\\User\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (!fs.existsSync(extFile)) {
  console.log("Extension file not found at:", extFile);
  process.exit(1);
}

const content = fs.readFileSync(extFile, 'utf8');
console.log("Extension file loaded, length:", content.length);

const keywords = ['.pb', 'decompress', 'compress', 'pbFile', 'conversation', 'gzip', 'zlib', 'lz4'];
keywords.forEach(kw => {
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(kw, idx);
    if (idx === -1) break;
    count++;
    if (count <= 5) {
      console.log(`Keyword "${kw}" Match ${count} at ${idx}:`);
      console.log(content.slice(Math.max(0, idx - 150), Math.min(content.length, idx + 250)));
      console.log("-".repeat(50));
    }
    idx += kw.length;
  }
  console.log(`Total matches for "${kw}": ${count}`);
});
