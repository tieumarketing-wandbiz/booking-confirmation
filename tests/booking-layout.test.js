const assert = require('node:assert/strict');
const { getSheetGeometry } = require('../layout.js');

const oneRow = getSheetGeometry({ bodyHeight: 26, pageWidth: 760, pageHeight: 1074 });
const wrappedRows = getSheetGeometry({ bodyHeight: 78, pageWidth: 760, pageHeight: 1074 });

assert.equal(oneRow.lowerShift, 0);
assert.equal(oneRow.detailsBodyHeight, 26);
assert.equal(wrappedRows.lowerShift, 52);
assert.equal(wrappedRows.detailsBodyHeight, 78);
assert.ok(Math.abs(oneRow.conditionsBottom - (0.891 * 1074)) < 0.01);
assert.ok(oneRow.footerTop >= oneRow.conditionsBottom);
assert.ok(wrappedRows.footerTop >= wrappedRows.conditionsBottom);
assert.ok(wrappedRows.footerWidth < oneRow.footerWidth);
assert.ok(Math.abs(oneRow.topGap - oneRow.footerBottom) < 0.01);
assert.ok(Math.abs(wrappedRows.topGap - wrappedRows.footerBottom) < 0.01);

console.log('booking layout geometry: ok');
