# English Booking Template Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generated booking-sheet artwork with the supplied English A4 image and position all editable booking values as responsive overlays on top of it.

**Architecture:** `#page` becomes a fixed-ratio A4 composition with the replacement image as a full-size background layer and a semantic `.overlay` layer above it. The existing sidebar remains the data source; `update()` writes values into overlay elements and rebuilds only the room-row overlays. The existing mobile scaling and PNG/PDF capture remain in place.

**Tech Stack:** Vanilla HTML, CSS, JavaScript, local PNG asset, html2canvas, jsPDF.

## Global Constraints

- Use the supplied image as the complete visual template; do not recreate its labels, icons, borders, or closing artwork in HTML.
- Use normalized percentage positions based on the source image dimensions 1055 × 1491.
- Keep English as the default preview language and keep the current editor/sidebar and PNG/PDF actions.
- Keep the current room add/remove behavior and calculate total from room-rate values.
- Keep the page at A4 aspect ratio and use a local background image for export reliability.

---

### Task 1: Install the replacement template asset and simplify preview markup

**Files:**
- Create: `assets/booking-confirmation-english.png` (copy of the supplied 1055 × 1491 PNG)
- Modify: `index.html:1` (preview article only)
- Modify: `app.js:1` (remove footer injection and target the overlay)

**Interfaces:**
- Consumes: Existing form field names and room array `r`.
- Produces: `#page` containing `.template-bg` and `.overlay`, with stable IDs `guest`, `nights`, `checkin`, `checkout`, `inTime`, `outTime`, `total`, `deposit`, `services`, `policy`, and `rows`.

- [ ] **Step 1: Copy the supplied image into the asset directory**

Run:

```bash
cp /var/folders/8r/q3kygtjs2vq_ntrfc1mm3rqr0000gn/T/codex-clipboard-94ecb62c-93ec-461e-889f-dca3bb86c066.png assets/booking-confirmation-english.png
file assets/booking-confirmation-english.png
```

Expected: the file reports a 1055 × 1491 PNG.

- [ ] **Step 2: Replace the generated document body with the background and overlay skeleton**

Keep the existing `<aside>` editor unchanged. Replace the current `<article id="page">...</article>` contents with:

```html
<article id="page" aria-label="Booking confirmation preview">
  <img class="template-bg" src="assets/booking-confirmation-english.png" alt="English booking confirmation template">
  <div class="overlay" aria-live="polite">
    <span id="greetingGuest" class="overlay-value greeting-guest"></span>

    <span id="guest" class="overlay-value field-guest"></span>
    <span id="nights" class="overlay-value field-nights"></span>
    <span id="checkin" class="overlay-value field-checkin"></span>
    <span id="checkout" class="overlay-value field-checkout"></span>
    <span id="inTime" class="overlay-value field-in-time"></span>
    <span id="outTime" class="overlay-value field-out-time"></span>

    <div id="rows" class="room-rows"></div>

    <span id="total" class="overlay-value summary-total"></span>
    <span id="deposit" class="overlay-value summary-deposit"></span>
    <div id="services" class="overlay-value services-value"></div>
    <span id="policy" class="overlay-value policy-value"></span>
  </div>
</article>
```

- [ ] **Step 3: Remove obsolete footer/template injection from `app.js`**

Delete the statements that insert `assets/footer-message.png`, move `<footer>`, and append the footer a second time. Keep `const rows=document.querySelector('#rows')`; it now points to the overlay room container. Keep `serviceBullets()` but make it write into the new `#services` element.

- [ ] **Step 4: Run a static syntax check**

Run:

```bash
node --check app.js
```

Expected: no syntax errors.

- [ ] **Step 5: Commit the asset and markup boundary**

```bash
git add assets/booking-confirmation-english.png index.html app.js
git commit -m "feat: add English booking template overlay shell"
```

### Task 2: Add normalized overlay geometry and responsive styling

**Files:**
- Modify: `style.css` (replace the accumulated preview override rules with one active template-overlay section)

**Interfaces:**
- Consumes: `.template-bg`, `.overlay`, overlay IDs/classes from Task 1.
- Produces: A full-size A4 composition where every dynamic value scales with `#page`.

- [ ] **Step 1: Define the fixed-ratio page and image layer**

Use this base geometry:

```css
#page {
  position: relative;
  width: 760px;
  aspect-ratio: 1055 / 1491;
  height: auto;
  overflow: hidden;
  background: #f7f2e6;
}

.template-bg {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  user-select: none;
  pointer-events: none;
}

.overlay {
  position: absolute;
  inset: 0;
  font-family: "DM Serif Display", Georgia, serif;
  color: #17231d;
}

.overlay-value { position: absolute; box-sizing: border-box; }
```

- [ ] **Step 2: Position booking-information values using image-relative percentages**

Add these anchors; tune only by a few percentage points after visual inspection:

```css
.greeting-guest { left: 24%; top: 36.6%; width: 52%; text-align: center; font-size: 1.2%; }
.field-guest   { left: 16.5%; top: 46.6%; width: 31%; text-align: right; }
.field-nights  { left: 60.5%; top: 46.6%; width: 28%; text-align: right; }
.field-checkin { left: 16.5%; top: 50.6%; width: 31%; text-align: right; }
.field-checkout{ left: 60.5%; top: 50.6%; width: 28%; text-align: right; }
.field-in-time { left: 16.5%; top: 54.5%; width: 31%; text-align: right; }
.field-out-time{ left: 60.5%; top: 54.5%; width: 28%; text-align: right; }
```

Use `font-size: clamp(8px, 1.15vw, 13px)` for field values on screen; because `#page` scales as a unit, keep the value line-height compact and avoid fixed pixel widths that drift during export.

- [ ] **Step 3: Position room rows inside the blank table body**

Use a row container and eight percentage columns matching the image header boundaries:

```css
.room-rows { left: 8%; top: 65%; width: 84%; height: 6.1%; display: grid; grid-auto-rows: 33.333%; }
.room-row { display: grid; grid-template-columns: 7.6% 11.8% 17.3% 16.7% 11.8% 10.3% 13.6% 10.9%; align-items: center; }
.room-row span { padding: 0 3px; text-align: center; line-height: 1.1; white-space: pre-line; overflow: hidden; }
.room-row .room-guests, .room-row .room-type { text-align: left; }
```

The row height must be derived from the container so one to three rows fit the existing blank body without moving any baked-in sections.

- [ ] **Step 4: Position summary and condition values**

Use these regions aligned to the blank areas in the image:

```css
.summary-total   { left: 17%; top: 73.3%; width: 28%; text-align: right; }
.summary-deposit { left: 60%; top: 73.3%; width: 28%; text-align: right; }
.services-value  { left: 41.5%; top: 82.8%; width: 47%; height: 3.5%; line-height: 1.35; white-space: pre-line; overflow: hidden; }
.policy-value    { left: 41.5%; top: 87.6%; width: 47%; height: 3.5%; line-height: 1.35; overflow: hidden; }
```

Render each service line as `• ${line}` and leave the baked-in “Included Services” and “Cancellation Policy” labels untouched.

- [ ] **Step 5: Preserve preview scaling and print/export behavior**

Update the existing mobile rules to scale the whole `#page` only; remove selectors that assume `.doc`, `header`, `footer`, `.info`, `.terms`, or generated `table` elements exist. Keep the current preview-mode and pointer gesture behavior, changing only the page height calculation to use the new aspect-ratio height (`1074px` at 760px width) when calculating margins.

- [ ] **Step 6: Commit the geometry layer**

```bash
git add style.css
git commit -m "feat: position booking values over English template"
```

### Task 3: Rebind dynamic room rows and English values

**Files:**
- Modify: `app.js` (editor-to-overlay rendering)

**Interfaces:**
- Consumes: FormData from `#form`, room records in `r`, and overlay IDs from Task 1.
- Produces: `update()` that renders all dynamic values without writing baked-in labels or duplicated artwork.

- [ ] **Step 1: Replace the generated table-row renderer with overlay row markup**

Inside `update()`, replace the current `<tr>` string with:

```js
rows.innerHTML = r.map((x, i) => `
  <div class="room-row">
    <span>${i + 1}</span>
    <span>1</span>
    <span class="room-guests">${escapeHtml(x.list || '')}</span>
    <span class="room-type">${escapeHtml(x.type || '')}</span>
    <span>${escapeHtml(x.pack || '—')}</span>
    <span>${escapeHtml(String(x.count || 0))}</span>
    <span>${fmt(x.rate)}</span>
    <span>${escapeHtml(x.bed || '—')}</span>
  </div>`).join('');
```

Add a small `escapeHtml(value)` helper before `update()` so editor-entered text cannot inject markup into the preview. Use the same helper for guest name, dates, times, services, and policy when assigning `innerHTML`; prefer `textContent` for plain value spans.

- [ ] **Step 2: Keep English as the initial render and preserve the existing language control safely**

Set the language select default to English in `index.html`. Keep `update()` from replacing any baked-in image labels. The existing `vi`/`en` arrays can remain only for the sidebar’s legacy state if needed, but no longer write `#title`, `#book`, `#detail`, or other removed label IDs.

- [ ] **Step 3: Render the greeting and numeric values**

Use:

```js
document.querySelector('#greetingGuest').textContent = v.guest || '';
document.querySelector('#guest').textContent = v.guest || '';
document.querySelector('#nights').textContent = String(n);
document.querySelector('#checkin').textContent = v.in || '';
document.querySelector('#checkout').textContent = v.out || '';
document.querySelector('#inTime').textContent = v.inTime || '';
document.querySelector('#outTime').textContent = v.outTime || '';
document.querySelector('#total').textContent = `${fmt(r.reduce((s, x) => s + (+x.rate || 0), 0))} VND`;
document.querySelector('#deposit').textContent = `${fmt(v.deposit)} VND`;
```

- [ ] **Step 4: Render services and policy without changing the background labels**

Keep `serviceBullets()` as the single renderer for services:

```js
function serviceBullets() {
  const value = new FormData(f).get('services') || '';
  services.innerHTML = value.split(/\n+/).filter(Boolean)
    .map(line => `<span>• ${escapeHtml(line)}</span>`).join('');
}
```

Set `policy.textContent` from the form and call both renderers from `update()` or from the existing listeners, not from duplicated event handlers.

- [ ] **Step 5: Run syntax and source checks**

Run:

```bash
node --check app.js
rg -n "footer-message|<header>|<table>|id=\"title\"|id=\"book\"|id=\"detail\"" index.html app.js style.css
```

Expected: no obsolete template markup or footer injection remains; `node --check` passes.

- [ ] **Step 6: Commit the data binding changes**

```bash
git add index.html app.js
git commit -m "feat: render booking data in overlay fields"
```

### Task 4: Verify layout and exports at desktop and mobile sizes

**Files:**
- Modify: `style.css` or `app.js` only if visual verification finds a concrete geometry defect.

**Interfaces:**
- Consumes: Completed overlay page and existing export controls.
- Produces: Verified working preview and exported A4 files.

- [ ] **Step 1: Start a local static server**

Run:

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/index.html` in a browser.

- [ ] **Step 2: Verify default English composition**

Confirm the supplied image fills the page with no repeated heading, table header, icons, footer image, or old green background. Confirm dynamic values appear only inside the six booking-information lines, table body, summary, and condition values.

- [ ] **Step 3: Verify all input updates**

Change guest, dates, times, deposit, services, cancellation policy, room list, room type, guest count, and room rate. Confirm nights and total update and each changed value remains inside its image-provided blank region.

- [ ] **Step 4: Verify row management and responsive preview**

Add two room rows, remove one, and verify the rows remain within the blank table body. Check desktop width and a mobile viewport; confirm the page scales without changing aspect ratio and preview mode still opens/closes.

- [ ] **Step 5: Verify PNG and PDF output**

Use “Xuất PNG” and “Xuất PDF”. Confirm both files contain the complete replacement background and overlays, preserve A4 proportions, and do not show missing-image or CORS artifacts.

- [ ] **Step 6: Run final checks and commit any verified tuning**

Run:

```bash
git diff --check
node --check app.js
git status --short
```

If geometry tuning was required, commit it with:

```bash
git add index.html style.css app.js
git commit -m "fix: tune booking overlay geometry"
```

