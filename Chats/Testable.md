# Testable?

## Bruce's Ask

The [demo page](../demo/📁⛏️.html) seemingly requires quite a bit of human interaction -- selecting a folder from the local file system, agreeing with a dialog in Chrome to allow the folder to be opened.

Is that something that lends itself to an automated unit test that can even run in  github?

If so, please go about adding such a unit test and add your implementation notes below.  If not, no worries, just explain why below.
## Implementation Notes

**Short answer: yes.** You can't automate the native folder dialog or Chrome's permission prompt, but you don't need to. Those belong to the browser. What this package owns is everything around them. The test replaces `window.showDirectoryPicker` before the page loads and checks that the enhancement:

1. hydrates and nudges the button (removes `disabled`),
2. calls `showDirectoryPicker` when the button is clicked, and
3. stores the returned handle as `button.enh['📁⛏️'].directoryHandle`.

The stub (`page.addInitScript` in the spec) returns a **real** `FileSystemDirectoryHandle`, not a plain object. It comes from the Origin Private File System (`navigator.storage.getDirectory()`). OPFS works in headless Chromium with no user interaction, so the handle passes `instanceof FileSystemDirectoryHandle`. Code that later reads from or writes to the chosen folder can therefore be tested the same way.

### Files added

| File | Purpose |
|------|---------|
| [playwright.config.ts](../playwright.config.ts) | Starts `npm run serve` on port 8000; Chromium only, since Firefox and Safari lack `showDirectoryPicker`. Same pattern as be-bound etc. |
| [tests/PickFolder/PickFolder.html](../tests/PickFolder/PickFolder.html) | Copy of the demo page, with `id=target` on the button. |
| [tests/PickFolder/WithOptions.html](../tests/PickFolder/WithOptions.html) | Same page, with `📁⛏️='{"id": "project-root", "mode": "readwrite"}'`. |
| [tests/PickFolder/PickFolder.spec.mjs](../tests/PickFolder/PickFolder.spec.mjs) | The stub and the two tests. It uses `expect`/`expect.poll` instead of fixed `waitForTimeout` sleeps. |
| [.github/workflows/CI.yml](../.github/workflows/CI.yml) | Runs `npm ci`, installs Chromium and runs `npm run test` on every push (Ubuntu). No submodule checkout needed: `types` is only used for JSDoc. |
| `.gitignore` | Added `test-results/` and `playwright-report/`. |

Run locally with `npm test`. Both tests pass, including with `CI=1`, which makes Playwright start its own server as it will on GitHub.

### Things the tests turned up (not fixed; your call)

1. **Attribute options never reach `showDirectoryPicker`.** Take `📁⛏️='{"id": "project-root", "mode": "readwrite"}'`. `_base.mapsTo: '.'` spreads the JSON onto the enhancement, so `id` and `mode` become top-level props. `options` stays at its default `{}`, and `handleEvent` passes `self.options`, so the picker gets `{}`. The README says these options are passed through.
   - Possible fixes: map `_base` to `options`, or have `handleEvent` build the options from `id`/`mode`/`startIn`.
   - The `PickFolder>WithOptions` test is marked `test.fail()` so CI stays green. Once the bug is fixed, Playwright will report it as "unexpectedly passed". Remove the `test.fail()` line at that point.
2. **The `resolved` event doesn't mean "a folder was picked."** `resolved: true` is returned from `hydrate`, so the event fires at hydration time. Nothing is dispatched after the user chooses a folder. The README's "Listening for the Result" example waits for `resolved` and then reads `directoryHandle`, which would still be `undefined`. Possible fix: dispatch a separate event (e.g. `directoryHandle` changed) after the picker resolves, or update the README. Once that's decided, it's easy to assert in the spec.
