# Add Support For Programmatic Attachment

## Bruce's Ask

Can you please follow the example of [be-persistent](https://github.com/bahrus/be-persistent) and [the addendum](../types/ImportantEnhancementAddendum.md) to add demos and adjust folder-picker.js as needed and add def.js to support programmatic attachment of this enhancement?

Please add your implementation notes below.
## Implementation Notes

I followed the checklist in [ImportantEnhancementAddendum.md](../types/ImportantEnhancementAddendum.md) step by step, with `be-persistent` as the template. All three attachment patterns (attribute, `enh.set`, `enh.get()`) are covered by tests and pass locally (`CI=1 npx playwright test`: 6 passed).

### Changes, by addendum step

1. **`init()` awaits `roundabout(...)` and then sets `self.initialized = true`** ([folder-picker.js](../folder-picker.js)). The `hydrate` action now requires `['enhancedElement', 'initialized']` ([emc.mjs](../emc.mjs)).
2. **`ctx.emc || ctx.config`** in `init()`. The imperative paths only pass `ctx.config`.
3. **[def.js](../def.js)** exports `defFolderPicker(ref)`. It follows be-persistent's `def.js` pattern: load `emc.json`, set `spawn` to the `FolderPicker` class, copy `customData` onto `enhConfig`, then push it to `(ref?.customElementRegistry ?? customElements).enhancementRegistry`.
   - [package.json](../package.json) now has an `exports` map covering `.`, `./folder-picker.js`, `./def.js`, `./emc.json` and `./📁⛏️.json`. It had none before. Adding one blocks every path it doesn't list, so if consumers import any other file, add it.
   - `assign-gingerly` is now a direct dependency, pinned to `0.0.97` (same as be-persistent). It had only come in transitively at `0.0.87`, and `def.js` imports it directly. `mount-observer` and `roundabout-lib` still carry their own nested `0.0.87`.
4. **Reserved-name collisions.** None: the domain props are `noNudge` and `options`, not `nudge`. But nothing monitors either prop, so a value set programmatically before spawn finished was overwritten by `defaultPropVals`. I added `customData.propagate: ['noNudge', 'options']`. I checked it's needed: without it, three of the programmatic tests fail (`options` arrives as `{}`, and `noNudge` is ignored).
5. **Tests**, mirroring be-persistent's names:
   - `tests/ProgrammaticDeclarativeInSequence`, `…OutOfSequence` and `ProgrammaticImperative` (`.html` + `.spec.mjs`). Each attaches with no attribute, sets `options = {id, mode}`, clicks, then checks that the button was nudged, that `showDirectoryPicker` received those exact options, and that `directoryHandle` is a real `FileSystemDirectoryHandle`.
   - `tests/ProgrammaticNoNudge`: `noNudge = true` set via `enh.get()` keeps the button disabled after hydration.
   - The picker stub from [Testable.md](Testable.md) moved to [tests/stubPicker.mjs](../tests/stubPicker.mjs) (`stubPicker` + `pickAndVerify`). The attribute-based `tests/PickFolder` spec uses it too; its button id changed from `target` to `subject` to match.

**Demos:** [demo/Programmatic/](../demo/Programmatic/) has `DeclarativeInSequence.html`, `DeclarativeOutOfSequence.html` and `Imperative.html`. **README:** new "Programmatic Attachment (No Attributes)" section.

### Things to be aware of

- **`enhKey` renamed from `FolderPicker` to `folderPicker`** in `emc.mjs`/`emc.json`. It's now camelCase like `bePersistent`, so the API reads `button.enh.set.folderPicker…`. This breaks anyone reading `el.enh.FolderPicker` with the canonical `folder-picker` attribute. The emoji key `📁⛏️` is unchanged.
- **The `types` submodule was modified.** `initialized?: boolean` was added to `AllProps` in `types/folder-picker/types.d.ts`, so `@ts-check` passes. That needs committing and pushing in the `types` repo, and the submodule pointer needs updating here.
- **Programmatic options work, but attribute options still don't** (see [Testable.md](Testable.md)). `enh.set`/`enh.get()` assign `options` directly, so they pass through to `showDirectoryPicker`. The attribute path still spreads the JSON via `_base.mapsTo: '.'`, so `PickFolder>WithOptions` stays marked `test.fail()`.
- **There's still no event after a folder is picked.** Programmatic callers are the most likely to want one. Consider a compact such as `when_directoryHandle_changes_dispatch`, or document how to watch `directoryHandle`. For now the demos just tell you to inspect it in devtools.
