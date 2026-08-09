const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');

const background = fs.readFileSync('assets/booking-background-english.png');
const css = fs.readFileSync('style.css', 'utf8');

assert.equal(
  crypto.createHash('sha256').update(background).digest('hex'),
  'd1726582c228b72c2ac4642dae52339b6215fab06b65bbabb0ce9c5e7fa5851c'
);
assert.match(css, /\.sheet-title[^}]*top:\s*32\.6%/);
assert.match(css, /\.intro[^}]*top:\s*39\.5%/);
assert.match(css, /\.booking-section[^}]*top:\s*44\.5%/);
assert.match(css, /\.details-section[^}]*top:\s*60\.6%/);
assert.match(css, /\.summary-grid[^}]*top:\s*calc\(71\.8%/);
assert.match(css, /\.conditions-section[^}]*top:\s*calc\(76\.9%/);

console.log('background geometry: ok');
