// Inlines images + icons into code.js. Run: node figma-plugin/build.js (from design/)
const fs = require('fs'), path = require('path');
const ICONS = require('../icons.js');
const dir = path.join(__dirname, '..');
const b64 = f => fs.readFileSync(path.join(dir, f)).toString('base64');
const assets = {
  hero: b64('assets/hero.jpg'), t1: b64('assets/t1.jpg'), t2: b64('assets/t2.jpg'), t3: b64('assets/t3.jpg'), t4: b64('assets/t4.jpg'),
  original: b64('assets/original.jpg'), board1: b64('export/board-b1.jpg'), board2: b64('export/board-b2.jpg')
};
const head = `const ASSETS = ${JSON.stringify(assets)};\nconst ICON_PATHS = ${JSON.stringify(ICONS.paths)};\nconst SYS_SVG = ${JSON.stringify(ICONS.sys('#FFFFFF'))};`;
const src = fs.readFileSync(path.join(__dirname, 'src.js'), 'utf8').replace('/*__ASSETS__*/', head);
fs.writeFileSync(path.join(__dirname, 'code.js'), src);
console.log('code.js', (src.length / 1024).toFixed(0) + ' KB');
