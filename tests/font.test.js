const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

assert.match(html, /family=Be\+Vietnam\+Pro:wght@400;600;700/);
assert.match(css, /\.sheet-content[^}]*font-family:\s*"DM Serif Display"/);
assert.match(css, /#page\.lang-vi \.sheet-content[^}]*font-family:\s*"Be Vietnam Pro"/);

console.log('font locale: ok');
