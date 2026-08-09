# Dynamic Booking Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the English background/footer artwork and reflow the lower booking-sheet sections as rooms are added.

**Architecture:** Keep the A4 preview and existing HTML-rendered fields. Add a transparent footer image layer and use CSS custom properties set by `updateSheetGeometry()` to shift the summary/conditions stack by the added table-row height. Anchor the footer artwork to the bottom and compute its width from the remaining height so it shrinks before overlap.

**Tech Stack:** Static HTML, CSS custom properties/layout, browser JavaScript, PNG assets, existing html2canvas/jsPDF export.

## Global Constraints

- Preserve the 1055×1491 A4 coordinate system and existing responsive/print/export behavior.
- Keep `index.html` English by default.
- Use the supplied PNG files without editing their visual content.
- Do not add runtime dependencies or a test framework.

---

### Task 1: Install the supplied visual assets and footer layer

**Files:**
- Copy: `/Users/apple/Downloads/ChatGPT Image Aug 9, 2026, 02_14_22 PM.png` → `assets/booking-background-english.png`
- Copy: `/Users/apple/Downloads/ChatGPT Image Aug 9, 2026, 02_10_09 PM.png` → `assets/booking-footer-english.png`
- Modify: `index.html` around the background image in `.sheet-content`
- Modify: `style.css` around `.template-bg` and `.sheet-content`

**Interfaces:**
- Produces `.footer-artwork`, a transparent image layer available to the geometry updater.

- [ ] **Step 1: Copy the supplied assets**

```bash
cp "/Users/apple/Downloads/ChatGPT Image Aug 9, 2026, 02_14_22 PM.png" assets/booking-background-english.png
cp "/Users/apple/Downloads/ChatGPT Image Aug 9, 2026, 02_10_09 PM.png" assets/booking-footer-english.png
```

- [ ] **Step 2: Add the footer image element**

Add immediately after `.template-bg`:

```html
<img class="footer-artwork" src="assets/booking-footer-english.png" alt="Thank you and best regards">
```

- [ ] **Step 3: Add base footer layer styling**

```css
.footer-artwork {
  position: absolute;
  left: 50%;
  top: auto;
  bottom: var(--footer-bottom, 1.5%);
  width: var(--footer-width, 38%);
  max-width: none;
  transform: translateX(-50%);
  pointer-events: none;
}
```

- [ ] **Step 4: Validate the assets**

Run:

```bash
file assets/booking-background-english.png assets/booking-footer-english.png
git diff --check
```

Expected: background is 1055×1491 RGB, footer is 1254×519 RGBA, and no whitespace errors are reported.

- [ ] **Step 5: Commit**

```bash
git add assets/booking-background-english.png assets/booking-footer-english.png index.html style.css
git commit -m "feat: add updated booking background and footer art"
```

### Task 2: Reflow lower sections from room count

**Files:**
- Modify: `style.css` geometry rules for `.details-section`, `.summary-grid`, `.conditions-section`, and `.footer-artwork`
- Modify: `app.js` after `updatePreview()` and in the room add/remove flow

**Interfaces:**
- `updateSheetGeometry()` reads `rooms.length` and writes `--lower-shift`, `--details-body-height`, `--footer-width`, and `--footer-bottom` on `#page`.

- [ ] **Step 1: Add CSS custom-property geometry defaults**

Keep the details anchor fixed, then shift the sections below its table body:

```css
#page {
  --lower-shift: 0px;
  --details-body-height: 26px;
  --footer-width: 38%;
  --footer-bottom: 1.5%;
}
.details-section { top: 59.3%; }
.summary-grid { top: calc(70.5% + var(--lower-shift)); }
.conditions-section { top: calc(75.4% + var(--lower-shift)); }
```

- [ ] **Step 2: Add the geometry updater**

Implement this behavior in `app.js`:

```js
function updateSheetGeometry() {
  const roomCount = Math.max(1, rooms.length);
  const rowHeight = 26;
  const pageHeight = page.clientHeight || 1074;
  const lowerShift = Math.max(0, roomCount - 1) * rowHeight;
  const detailsBodyHeight = roomCount * rowHeight;
  const conditionsBottom = (0.754 * pageHeight) + lowerShift + (0.122 * pageHeight);
  const availableFooterHeight = Math.max(0, pageHeight - conditionsBottom);
  const footerHeightPerWidthPercent = (page.clientWidth / pageHeight) * (519 / 1254);
  const footerWidth = Math.max(0, Math.min(72, (availableFooterHeight / pageHeight * 100) / footerHeightPerWidthPercent * 0.9));
  const footerHeight = page.clientWidth * (footerWidth / 100) * (519 / 1254);
  const footerBottom = Math.max(0, (pageHeight - conditionsBottom - footerHeight) / 2);

  page.style.setProperty('--lower-shift', `${lowerShift}px`);
  page.style.setProperty('--details-body-height', `${detailsBodyHeight}px`);
  page.style.setProperty('--footer-width', `${footerWidth}%`);
  page.style.setProperty('--footer-bottom', `${footerBottom}px`);
}
```

Call it at the end of `updatePreview()` after room rows and condition text are rendered. Since add/remove already calls `updatePreview()`, all room changes update the stack automatically.

- [ ] **Step 3: Make the details table height follow its section**

Use the dynamic body height while preserving the existing clipping safety:

```css
.details-table tbody { max-height: var(--details-body-height, 26px); }
```

Keep room rows at their existing compact 26px height so additional rows consume predictable space. Anchor the footer to the bottom:

```css
.footer-artwork { top: auto; bottom: var(--footer-bottom, 1.5%); width: var(--footer-width, 38%); }
```

- [ ] **Step 4: Verify geometry states with a deterministic DOM-style calculation**

Run a small Node assertion against the geometry formulas for room counts 1, 2, 4, and 6. Assert that `lowerShift` and `detailsBodyHeight` increase by 26px per extra room, the calculated footer width stays between 0% and 72%, and the footer's top/bottom gaps remain equal whenever positive space remains.

- [ ] **Step 5: Commit**

```bash
git add style.css app.js
git commit -m "feat: reflow booking sheet for multiple rooms"
```

### Task 3: Verify preview, print, and export safety

**Files:**
- Modify: `style.css` only if print rules need to clear geometry variables.
- Modify: `app.js` only if export capture needs to include the new footer layer.

- [ ] **Step 1: Run static checks**

```bash
node --check app.js
git diff --check
```

- [ ] **Step 2: Run content assertions**

Confirm with `rg` that the new background path, footer path, CSS variables, and `updateSheetGeometry()` are all present, and that the old footer text is not duplicated in HTML.

- [ ] **Step 3: Exercise room add/remove behavior**

Use the existing add-room/remove-room event path and verify that each path ends in `updatePreview()` and therefore `updateSheetGeometry()`.

- [ ] **Step 4: Verify print/export invariants**

Confirm `beforeprint` still clears transform/margins, `afterprint` restores mobile fit, and `capturePage()` still captures the complete `#page` including the footer image.

- [ ] **Step 5: Commit any hardening changes**

```bash
git add style.css app.js
git commit -m "fix: harden dynamic booking layout exports"
```
