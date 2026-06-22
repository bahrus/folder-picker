# folder-picker (📁⛏️)

Enhance an HTML button so that clicking it prompts the user to pick a local directory using the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker). The chosen folder is exposed as a `FileSystemDirectoryHandle` on the enhanced element.

The canonical enhancement name is **`folder-picker`**. The emoji shorthand **`📁⛏️`** can be used as an alias.

## Basic Usage

```html
<button 📁⛏️>Pick directory</button>
```

or using the canonical name:

```html
<button folder-picker>Pick directory</button>
```

When the user clicks the button, the browser's native directory picker dialog opens. After a folder is selected, a `resolved` event is dispatched from the button element.

## How It Works

1. The enhancement attaches a `click` listener to the button.
2. On click, it calls `window.showDirectoryPicker()` with any configured options.
3. The resulting `FileSystemDirectoryHandle` is stored on the enhancement instance.
4. A `resolved` event is dispatched, signaling that a directory has been selected.
5. By default, the button's `disabled` attribute is removed (nudged) once the enhancement is hydrated.

## Listening for the Result

```html
<button id="picker" 📁⛏️>Pick directory</button>

<script type=module>
    import 'be-hive/be-hive.js';

    const btn = document.getElementById('picker');
    btn.addEventListener('resolved', e => {
        const handle = btn.enh.📁⛏️.directoryHandle;
        console.log('Selected directory:', handle.name);
    });
</script>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `folder-picker` (or `📁⛏️`) | `Object` (JSON) | `{}` | Options passed to `showDirectoryPicker()`. See below. |
| `folder-picker-no-nudge` | `Boolean` | `false` | When present, disables automatic removal of the `disabled` attribute after hydration. |

## Customizing `showDirectoryPicker` Options

Pass a JSON object as the attribute value to configure the underlying [`showDirectoryPicker()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker#parameters) call:

```html
<button 📁⛏️='{"id": "project-root", "mode": "readwrite", "startIn": "documents"}'>
    Pick project folder
</button>
```

### Available Options

These map directly to the [`DirectoryPickerOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker#parameters) interface:

| Option | Type | Description |
|--------|------|-------------|
| `id` | `string` | An identifier to remember the last-used directory for this picker instance. |
| `mode` | `"read"` \| `"readwrite"` | Permission mode. `"read"` for read-only access, `"readwrite"` for full access. |
| `startIn` | `string` \| `FileSystemHandle` | Suggest a starting directory. Accepts well-known directories like `"desktop"`, `"documents"`, `"downloads"`, etc., or a `FileSystemHandle`. |

### Disabling the Nudge

By default, the enhancement "nudges" the button (removes `disabled`) to signal that it's ready for interaction. To disable this behavior:

```html
<button disabled folder-picker folder-picker-no-nudge>Pick directory</button>
```

## Registration (HTML)

Use the modern `<be-hive>` declarative pattern to register the enhancement:

```html
<be-hive>
    <script type=emc src="folder-picker/emc.json"></script>
</be-hive>
<script type=module>
    import 'be-hive/be-hive.js';
</script>
```

Or with the emoji shorthand:

```html
<be-hive>
    <script type=emc src="folder-picker/📁⛏️.json"></script>
</be-hive>
<script type=module>
    import 'be-hive/be-hive.js';
</script>
```

## Importing in ES Modules

```javascript
import 'folder-picker/folder-picker.js';
```

## Using from CDN

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/folder-picker';
</script>
```

## Browser Support

This enhancement requires a browser that supports the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker#browser_compatibility). As of 2026, this is supported in Chromium-based browsers (Chrome, Edge, Opera). Firefox and Safari do not yet support `showDirectoryPicker()`.

## Viewing Demos Locally

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to the folder where you cloned this repo
5. `git submodule add https://github.com/bahrus/types.git types`
6. `git submodule update --init --recursive`
7. `npm install`
8. `npm run build`
9. `npm run serve`
10. Open http://localhost:8000/demo/ in a Chromium-based browser
