const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

assert.match(html, /<img class="sidebar-logo" src="assets\/logo-la-do\.png"/);
assert.ok(fs.existsSync('assets/logo-la-do.png'));

console.log('sidebar logo: ok');
