# Post-review fix report

## Files

- `app.js`: added an `afterprint` listener that calls `resetGesture()`.

## Commit

- `fix: restore mobile preview after print`

## Commands and outputs

- `node --check app.js` — passed (exit 0).
- Focused source assertion — passed; both `beforeprint` and `afterprint` handlers exist, and `afterprint` calls `resetGesture`.
- `git diff --check` — passed (exit 0).

## Concerns

- None identified. Export capture behavior was not changed.
