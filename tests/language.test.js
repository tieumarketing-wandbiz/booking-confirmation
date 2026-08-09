const assert = require('node:assert/strict');
const { getLocale } = require('../language.js');

const vietnamese = getLocale('vi');
const english = getLocale('en');

assert.equal(vietnamese.title, 'XÁC NHẬN ĐẶT PHÒNG');
assert.equal(vietnamese.bookingHeading, 'THÔNG TIN ĐẶT PHÒNG');
assert.equal(vietnamese.tableRate, 'Giá phòng<br>(VNĐ)');
assert.equal(vietnamese.adults, 'người lớn');
assert.equal(english.title, 'BOOKING CONFIRMATION');
assert.equal(getLocale('unknown').title, english.title);

console.log('language copy: ok');
