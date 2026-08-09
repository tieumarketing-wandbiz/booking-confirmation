# Dynamic Booking Layout Design

## Goal

Replace the current English booking-sheet background and footer artwork, then make the sheet reflow its lower sections when additional rooms are added so content never overlaps the footer artwork.

## Approved direction

- Use `ChatGPT Image Aug 9, 2026, 02_14_22 PM.png` as the A4 background.
- Use `ChatGPT Image Aug 9, 2026, 02_10_09 PM.png` as a transparent footer artwork layer containing the closing message.
- Keep the existing HTML-rendered title, booking fields, details table, summary, and conditions sections.
- Keep the current absolute A4 coordinate system, but calculate lower-section geometry from the rendered room count instead of relying on fixed top percentages.

## Layout behavior

The content stack remains ordered as:

`title → intro → booking → details → summary → conditions → footer artwork`

The booking and title areas stay anchored to the new background. The details table height is derived from the number of rooms, capped by the printable sheet area. Summary and conditions move below the table with a consistent gap. The footer artwork is positioned after conditions and centered horizontally. When the calculated footer area becomes shorter than the artwork's preferred height, its width scales down proportionally; it must retain a minimum readable scale and must never overlap the conditions section.

The existing export and mobile gesture behavior must continue to work. The PNG footer remains an image layer so its transparent background preserves the paper texture underneath.

## Files and responsibilities

- `assets/booking-background-english.png`: replaced with the new 1055×1491 background.
- `assets/booking-footer-english.png`: new transparent footer artwork asset.
- `index.html`: adds a dedicated footer artwork image layer inside `.sheet-content`.
- `style.css`: defines dynamic lower-section variables, footer image geometry, and transition-safe dimensions.
- `app.js`: measures room count/table height, updates CSS custom properties, and applies compact footer sizing when space is constrained.

## Acceptance criteria

1. The new background and footer artwork render in the preview and export paths.
2. With one room, the details, summary, conditions, and footer are visually balanced and centered.
3. Adding rooms pushes the details table, summary, and conditions downward in order.
4. With multiple rooms, the footer artwork scales down before it overlaps any table or condition content.
5. Removing rooms restores the preferred footer scale and spacing.
6. `node --check app.js` and `git diff --check` pass.
