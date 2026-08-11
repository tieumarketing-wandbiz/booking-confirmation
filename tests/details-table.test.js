const assert = require('node:assert/strict');
const fs = require('node:fs');

const css = fs.readFileSync('style.css', 'utf8');

assert.match(css, /\.details-table th:nth-child\(2\), \.details-table td:nth-child\(2\) \{ width: 9%; \}/);
assert.match(css, /\.details-table th:nth-child\(4\), \.details-table td:nth-child\(4\) \{ width: 20%; \}/);
assert.match(css, /\.details-table td:nth-child\(3\) \.text-clamp \{[^}]*max-height: none;[^}]*-webkit-line-clamp: unset;/s);

console.log('details table geometry: ok');
