const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

assert.match(html, /class="footer-artwork" src="assets\/booking-footer-english\.png"/);
assert.doesNotMatch(css, /#page\.lang-vi \.footer-artwork\s*\{\s*display:\s*none/);

console.log('footer artwork: ok');
