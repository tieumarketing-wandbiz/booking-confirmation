# HTML Booking Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the supplied blank-banner artwork as the A4 background and render the English booking confirmation content, table, fields, and decorative SVG icons as responsive HTML.

**Architecture:** Copy the current project-root files into the isolated worktree, then replace the old generated sheet with a fixed-ratio A4 composition. The background supplies branding and scenery; a semantic `.sheet-content` layer renders editable content. A local SVG icon factory keeps icons crisp in preview and export without an icon CDN.

**Tech Stack:** Vanilla HTML, CSS, JavaScript, inline SVG, local PNG background, html2canvas, jsPDF.

## Global Constraints

- Use the supplied blank-banner A4 artwork as the background; the completed reference image is not a production asset.
- Render title, booking fields, details table, summary, conditions, and icons as editable HTML/CSS.
- Use normalized percentage coordinates based on 1055 × 1491.
- Keep English preview, current sidebar, room add/remove, PNG/PDF, and mobile preview behavior.
- Format dates in English long form such as `June 3, 2026`; escape all user-entered content.
- Do not duplicate branding, contact details, botanical artwork, or footer already in the background.

---

### Task 1: Copy the project-root baseline and add the background

**Files:** Copy `/Users/apple/Documents/Project/phieu khach hang/index.html`, `style.css`, and `app.js`; create `assets/booking-background-english.png`; modify `index.html`.

**Interfaces:** Produces `#page` with `.template-bg`, `.sheet-content`, and stable dynamic IDs for later tasks.

- [ ] **Step 1: Copy the project-root files into the worktree**

```bash
cp "/Users/apple/Documents/Project/phieu khach hang/index.html" index.html
cp "/Users/apple/Documents/Project/phieu khach hang/style.css" style.css
cp "/Users/apple/Documents/Project/phieu khach hang/app.js" app.js
```

- [ ] **Step 2: Copy the supplied blank-banner image**

```bash
cp /var/folders/8r/q3kygtjs2vq_ntrfc1mm3rqr0000gn/T/codex-clipboard-ca32594b-f651-4934-8334-aabee114c113.png assets/booking-background-english.png
file assets/booking-background-english.png
```

Expected: `PNG image data, 1055 x 1491`.

- [ ] **Step 3: Replace only the old preview article**

Keep the existing `<aside>` and external export scripts. Replace `<article id="page">` with this semantic layer:

```html
<article id="page" aria-label="Booking confirmation preview">
  <img class="template-bg" src="assets/booking-background-english.png" alt="Lá Đỏ Homestay booking confirmation background">
  <div class="sheet-content">
    <h1 class="sheet-title">BOOKING CONFIRMATION</h1>
    <section class="intro"><p class="greeting">Dear Ms/Mr, <strong id="introGuest"></strong></p><p>Thank you for choosing La Do Homestay for your upcoming stay.</p><p>We are pleased to confirm your reservation as follows:</p></section>
    <section class="booking-section"><h2 class="section-heading"><span id="bookingIcon"></span>BOOKING INFORMATION</h2><div class="booking-grid">
      <div class="booking-field"><span id="guestIcon"></span><span>Guest Name:</span><strong id="guest"></strong></div><div class="booking-field"><span id="moonIcon"></span><span>Number of Nights:</span><strong id="nights"></strong></div>
      <div class="booking-field"><span id="checkinIcon"></span><span>Check-in Date:</span><strong id="checkin"></strong></div><div class="booking-field"><span id="checkoutIcon"></span><span>Check-out Date:</span><strong id="checkout"></strong></div>
      <div class="booking-field"><span id="inTimeIcon"></span><span>Check-in Time:</span><strong id="inTime"></strong></div><div class="booking-field"><span id="outTimeIcon"></span><span>Check-out Time:</span><strong id="outTime"></strong></div>
    </div></section>
    <section class="details-section"><h2 class="section-heading"><span id="buildingIcon"></span>DETAILS</h2><table class="details-table"><thead><tr><th>No.</th><th>No. of<br>Rooms</th><th>Guest List</th><th>Room Type</th><th>Package</th><th>No. of<br>Guests</th><th>Room Rate<br>(VND)</th><th>Extra<br>Bed</th></tr></thead><tbody id="rows"></tbody></table></section>
    <section class="summary-grid"><div class="summary-card"><span id="totalIcon"></span><span>Total (VND):</span><strong id="total"></strong></div><div class="summary-card"><span id="walletIcon"></span><span class="summary-copy"><span>Deposit &amp; Payment:</span><span>Customer has deposited</span></span><strong id="deposit"></strong></div></section>
    <section class="conditions-section"><h2 class="section-heading"><span id="clipboardIcon"></span>PACKAGE &amp; BOOKING CONDITIONS</h2><div class="condition-grid"><div class="condition-row"><span id="servicesIcon"></span><span>Included Services</span><div id="services"></div></div><div class="condition-row"><span id="policyIcon"></span><span>Cancellation Policy</span><div id="policy"></div></div></div></section>
  </div>
</article>
```

- [ ] **Step 4: Assert the asset and regions, then commit**

```bash
file assets/booking-background-english.png
rg -n 'booking-background-english|sheet-content|details-table|condition-grid|id="rows"' index.html
git add assets/booking-background-english.png index.html app.js style.css
git commit -m "feat: add HTML booking sheet composition"
```

### Task 2: Replace preview CSS with normalized A4 geometry

**Files:** `style.css`.

**Interfaces:** Consumes Task 1 classes and produces an aligned responsive HTML sheet.

- [ ] **Step 1: Replace accumulated preview rules with the active layout**

Use `#page { position:relative; width:760px; aspect-ratio:1055 / 1491; height:auto; margin:0 auto; overflow:hidden; }`, `.template-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:fill; pointer-events:none; }`, and `.sheet-content { position:absolute; inset:0; color:#13251a; font-family:"DM Serif Display", Georgia, serif; }`.

- [ ] **Step 2: Add normalized region anchors**

Use `.sheet-title { left:14%; top:29.3%; width:72%; }`, `.intro { left:14%; top:36.1%; width:72%; }`, `.booking-section { left:8%; top:41.7%; width:84%; }`, `.details-section { left:8%; top:59.3%; width:84%; }`, `.summary-grid { left:8%; top:71.5%; width:84%; }`, and `.conditions-section { left:8%; top:77.5%; width:84%; }`, all with `position:absolute` and `clamp()` typography.

- [ ] **Step 3: Style components to match reference #2**

Use dark green `#063b23`, warm gold `#c0ad72`, 11–12px radii, dotted field rules, two-column booking grid, eight-column table widths `8% 12% 17% 17% 12% 11% 13% 10%`, left-align guest list/room type, and two-row condition cards. Preserve line breaks with `white-space:pre-line`.

- [ ] **Step 4: Add responsive/print rules and commit**

Scale the whole composition below 900px; in print hide the sidebar, remove preview padding/shadow, and set `#page` to `210mm × 297mm`.

```bash
git diff --check && git add style.css && git commit -m "feat: style HTML booking sheet regions"
```

### Task 3: Render inline SVG icons and bind dynamic data

**Files:** `app.js`; adjust `index.html` selectors only if required.

**Interfaces:** Produces `icon(name)`, `formatDate(value)`, `escapeHtml(value)`, room editor rendering, and `updatePreview()`.

- [ ] **Step 1: Add the local icon factory**

Create `iconPaths` for `user`, `moon`, `calendar`, `clock`, `building`, `wallet`, `clipboard`, `bell`, and `shield`. Return SVG with `currentColor`, `stroke-linecap`, `stroke-linejoin`, `aria-hidden="true"`, and initialize all icon target IDs in `renderIcons()`.

```js
function icon(name, className = '') { return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`; }
```

- [ ] **Step 2: Add safe formatting helpers**

Implement `escapeHtml(value)`, `formatNumber(value)`, and `formatDate(value)` using `Intl.DateTimeFormat('en-US', {month:'long', day:'numeric', year:'numeric'})`.

- [ ] **Step 3: Rebuild `updatePreview()` and room rows**

Set `introGuest`, six booking values, formatted dates, nights, total, deposit, services, and policy. Render rows with escaped values, `String(index + 1).padStart(2, '0')`, and `${count} adults`; render services as escaped bullet spans. Keep add/remove room controls.

- [ ] **Step 4: Keep export A4-safe and commit**

Make `capturePage()` temporarily clear preview transform/margin before html2canvas capture, then restore the styles. Run `node --check app.js` and commit:

```bash
node --check app.js && git diff --check && git add app.js index.html && git commit -m "feat: render booking data and inline SVG icons"
```

### Task 4: Verify visual alignment, interactions, and exports

**Files:** Modify only verified defects in `index.html`, `style.css`, or `app.js`.

- [ ] **Step 1: Serve the worktree**

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/index.html`.

- [ ] **Step 2: Compare against reference #2**

Confirm title/banner, intro, booking cards, details table, summary, conditions, and SVG icons align; branding and footer appear exactly once from the background.

- [ ] **Step 3: Verify interactions**

Change every form field, add two rooms, remove one, and confirm values, nights, services, policy, and total update without overflow outside their regions.

- [ ] **Step 4: Verify responsive/export behavior**

Inspect desktop/mobile preview, click PNG/PDF exports, then run `node --check app.js && git diff --check && curl -fsS http://127.0.0.1:4173/index.html | rg -q 'booking-background-english.png|sheet-content|details-table|condition-grid' && file assets/booking-background-english.png && git status --short`. Expected: syntax/diff checks pass, local page contains all regions, asset reports 1055 × 1491, and only intentional changes remain.

