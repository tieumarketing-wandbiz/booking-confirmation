# English Booking Template Overlay Design

## Goal

Replace the current generated booking-sheet artwork with the supplied English A4 booking confirmation image while keeping the existing data-entry sidebar, live preview, and PNG/PDF export behavior.

## Decisions

- Use the supplied image as the complete visual template. The image is 1055 × 1491 px and contains the branding, English labels, borders, icons, table headings, and closing message.
- Keep the editor/sidebar as the source of truth for dynamic values.
- Keep English as the default and supported preview language for this template. The existing Vietnamese option remains available in the editor but does not change baked-in labels in the image; dynamic value geometry is language-neutral.
- Render dynamic values in a transparent absolute-position overlay using percentages of the source image dimensions. This makes positions scale with the A4 preview and preserves export dimensions.
- Remove the current HTML-generated document labels, cards, table headings, and footer artwork from the rendered page so they cannot duplicate the baked-in content.

## Overlay regions

Coordinates below are based on the supplied 1055 × 1491 image and should be implemented as percentage-based CSS positions or equivalent normalized geometry.

- Greeting name: centered around the baked-in “Dear Ms/Mr,” line, with the guest name appended or placed as the dynamic suffix.
- Booking information values: six values aligned to the right side of the corresponding dotted lines in the two-column information box. The left column contains guest name, check-in date, and check-in time; the right column contains nights, check-out date, and check-out time.
- Details rows: one overlay row per room entry below the green table header. Columns are No., No. of Rooms, Guest List, Room Type, Package, No. of Guests, Room Rate (VND), and Extra Bed. Values are centered except guest list and room type, which are left-aligned and preserve line breaks.
- Summary: total value on the left summary cell and deposit/payment value on the right summary cell.
- Conditions: services value in the large right-hand area of “Included Services” and policy value in the large right-hand area of “Cancellation Policy”. Service lines render as separate bullet lines.

## Data behavior

- Guest name, dates, times, nights, room rows, total, deposit, services, and cancellation policy continue to update from the existing form.
- Date formatting remains the browser form value for now to minimize scope; a later localization pass can introduce a display formatter.
- Total is calculated from the room-rate values as in the current app.
- Room rows remain addable/removable from the sidebar. If more rows are added than the image has room for, the overlay constrains or clips within the blank table body rather than changing the template geometry.
- Export captures the composed page (background image plus overlay) at the same A4 ratio.

## Responsive and export behavior

- The page remains a fixed A4 aspect ratio and scales down in the existing preview container/mobile flow.
- Overlay typography uses `clamp()` or a scale-relative font strategy so values remain readable without drifting from their anchor lines.
- The export path continues to use `html2canvas` and `jsPDF`, with the new background image loaded from a local asset so CORS does not affect capture.

## Implementation boundaries

- Replace the old background/template asset reference with the supplied image copied into `assets/`.
- Refactor the preview markup into a background layer plus a semantic overlay layer, retaining existing element IDs where practical so the current form update logic remains understandable.
- Consolidate the currently appended/overriding CSS into one active layout block for the new template, removing rules that target the old HTML artwork.
- Keep the editor controls and export buttons unchanged unless a selector must be updated to support the new preview layer.

## Verification

- Load the page and verify the default English preview has no duplicated labels, headers, or footer artwork.
- Change every editor field and verify its value lands in the matching image region.
- Add and remove room rows; verify table alignment and total updates.
- Test the preview at desktop and mobile widths.
- Export PNG and PDF and verify the output is a complete A4 composition with the replacement image and all dynamic values.

