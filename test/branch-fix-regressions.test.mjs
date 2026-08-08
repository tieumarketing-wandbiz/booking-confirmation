import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [html, css, script] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../style.css', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8')
]);

test('uses English defaults and keeps mobile gestures on the fixed sheet', () => {
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /Create booking confirmation/);
  assert.match(css, /\.preview\s*\{[^}]*touch-action:\s*none/s);
});

test('keeps fixed-page text and room rows inside their allocated regions', () => {
  assert.match(css, /\.intro\s*\{[^}]*(?:height|max-height):/s);
  assert.match(css, /\.booking-field\s*\{[^}]*height:/s);
  assert.match(css, /\.summary-card\s*\{[^}]*height:/s);
  assert.match(css, /\.condition-row\s*\{[^}]*height:/s);
  assert.match(css, /\.details-table tbody tr\s*\{[^}]*height:/s);
  assert.match(css, /\.text-clamp\s*\{[^}]*-webkit-line-clamp:/s);
});

test('uses a single JS scale for mobile and clears gesture styles for print', () => {
  const mobileRules = css.match(/@media \(max-width: 900px\)[\s\S]*?@media print/)?.[0] ?? '';
  assert.doesNotMatch(mobileRules, /#page\s*\{[^}]*transform:/s);
  assert.match(css, /@media print[\s\S]*?#page\s*\{[^}]*transform:\s*none\s*!important;/s);
  assert.match(css, /@media print[\s\S]*?#page\s*\{[^}]*margin:\s*0\s*!important;/s);
});

test('surfaces unavailable and failed export dependencies to the user', () => {
  assert.match(script, /function requireExportDependencies\(/);
  assert.match(script, /function showExportError\(/);
  assert.match(script, /html2canvas is unavailable/);
  assert.match(script, /jsPDF is unavailable/);
  assert.match(script, /catch \(error\)\s*\{\s*showExportError\(error\);/s);
});
