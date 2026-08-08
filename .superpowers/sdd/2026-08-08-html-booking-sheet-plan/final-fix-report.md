# Final Whole-Branch Fix Report

## Scope and base

- Base reviewed: `13f5e7c`.
- Review package read: `.superpowers/sdd/2026-08-08-html-booking-sheet-plan/review-3e3b428..13f5e7c.diff`.
- This change addresses every requested Important finding and the safe Minor findings without replacing the local background, semantic structure, inline SVG icons, sidebar, room controls, clipping behavior, PNG/PDF controls, or A4 ratio.

## Files changed

- `app.js`
  - Wraps every rendered room cell in a bounded `.text-clamp` element.
  - Checks `html2canvas` and, for PDF, `jspdf.jsPDF` before export; both button handlers catch errors and write an accessible failure message to `#exportStatus`.
  - Clears inline `transform` and `margin-bottom` styles on `beforeprint`.
  - Calculates mobile fit scale from the preview content width, so JavaScript is the only scaling mechanism.
- `index.html`
  - Sets `lang="en"`, changes default sidebar labels and sample service/policy copy to English, and adds the live export-status element.
- `style.css`
  - Uses fixed 760px-design typography and fixed region heights, two-line clamps, word-breaking, and hidden overflow for intro, booking fields, table cells, summary, and conditions.
  - Repositions title/intro/booking/summary/conditions to place the intro below the dark banner and reserve room above the background footer.
  - Removes viewport-relative page transforms, adds `touch-action: none`, and forces print `transform`/margins to neutral values with `!important`.
- `test/branch-fix-regressions.test.mjs`
  - Focused no-dependency regression checks for the review requirements.

## Evidence

### Bounds and geometry

At a 1440px desktop viewport, a focused runtime check filled a 500-character guest name, 20 long service lines, a 500-character policy, and long values for a newly added room. It reported:

```json
{
  "bounded": true,
  "overflows": {
    "booking": false,
    "conditions": false,
    "summary": false,
    "table": false
  },
  "rows": { "clientHeight": 52, "scrollHeight": 62, "rendered": 2 }
}
```

The two rendered table rows confirm that the existing table clipping remains active. Default desktop geometry on the 1074px-high fixed canvas was:

```json
{
  "title": { "top": 339, "bottom": 372, "height": 33 },
  "intro": { "top": 406, "bottom": 458, "height": 52 },
  "summary": { "top": 757, "bottom": 806, "height": 49 },
  "conditions": { "top": 810, "bottom": 941, "height": 131 },
  "titleColor": "rgb(255, 255, 255)",
  "introColor": "rgb(19, 37, 26)",
  "pageHeight": 1074
}
```

This places the white title inside the green banner, moves the dark intro onto the pale paper below it, and ends conditions before the footer message artwork.

At a 375px mobile viewport, the sheet used `translate(0px, 0px) scale(0.473684)` and retained a computed 33px title font with `touch-action: none`; it is therefore a uniform scale of the 760px design rather than a second viewport-relative typesetting pass.

### Runtime and asset checks

- Browser runtime console error list: `[]`.
- `file assets/booking-background-english.png`:

  ```text
  PNG image data, 1055 x 1491, 8-bit/color RGB, non-interlaced
  ```

- `sips -g pixelWidth -g pixelHeight assets/booking-background-english.png`:

  ```text
  pixelWidth: 1055
  pixelHeight: 1491
  ```

- Production HTML/CSS/JS has no reference to `assets/reference.png` or `assets/booking-confirmation-english.png`.
- Header checks for both required export CDN URLs returned `HTTP/2 200`.

## Commands run and outputs

```text
node --test test/branch-fix-regressions.test.mjs
# tests 4
# pass 4
# fail 0

node --check app.js
# exit 0

git diff --check
# exit 0

curl -fsS http://127.0.0.1:4173/index.html | rg -q 'booking-background-english\.png|sheet-content|details-table|condition-grid|exportStatus'
# exit 0

curl -fsSI https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js | head -1
HTTP/2 200

curl -fsSI https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js | head -1
HTTP/2 200
```

## Remaining limitations

- Exports intentionally still depend on the two existing CDN scripts. If either is blocked or unavailable, the UI now reports the specific failure instead of silently rejecting; bundling those libraries locally was outside this focused fix.
- Fixed A4 space necessarily clips content beyond the allocated two table rows, two lines per cell/value, and two visible condition lines. This retains the requested clipping behavior while preventing user text from covering unrelated regions.
- Browser print-preview dialogs were not opened as part of automated verification. Print behavior is guarded both by the `beforeprint` inline-style cleanup and by `@media print` rules with `!important` transform and margin resets.
