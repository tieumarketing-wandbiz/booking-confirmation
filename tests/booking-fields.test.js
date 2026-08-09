const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');

assert.match(html, /name="total"/);
assert.match(app, /data-room-key="pack"[^>]*placeholder="Package"/);
assert.match(app, /data-room-key="bed"[^>]*placeholder="Extra bed"/);
assert.match(app, /setText\('total', formatNumber\(values\.total\)\)/);

console.log('booking fields: ok');
