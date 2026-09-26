import { test, expect } from '@playwright/test';

// showDirectoryPicker opens a native OS dialog (plus a permission prompt) that
// automation can't drive, so replace it before any page script runs.  The stub
// records the options it was called with and hands back a genuine
// FileSystemDirectoryHandle from the Origin Private File System, which needs
// no user interaction.
test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        window.pickerCalls = [];
        window.showDirectoryPicker = async (options) => {
            window.pickerCalls.push(options);
            const root = await navigator.storage.getDirectory();
            return await root.getDirectoryHandle('picked-folder', {create: true});
        };
    });
});

test('PickFolder', async ({ page }) => {
    await page.goto('./tests/PickFolder/PickFolder.html');
    const button = page.locator('#target');
    // hydration nudges the button, removing the disabled attribute
    await expect(button).toBeEnabled();
    await button.click();
    await expect.poll(() => page.evaluate(() => {
        const handle = document.querySelector('#target').enh['📁⛏️'].directoryHandle;
        return handle instanceof FileSystemDirectoryHandle ? `${handle.kind}:${handle.name}` : null;
    })).toBe('directory:picked-folder');
    expect(await page.evaluate(() => window.pickerCalls)).toEqual([{}]);
});

test('PickFolder>WithOptions', async ({ page }) => {
    // Known issue: the attribute's JSON is spread onto the enhancement
    // (_base.mapsTo: '.'), so id/mode end up as top-level props and
    // showDirectoryPicker receives the default {} options.
    // Remove this line once the options are passed through.
    test.fail();
    await page.goto('./tests/PickFolder/WithOptions.html');
    const button = page.locator('#target');
    await expect(button).toBeEnabled();
    await button.click();
    await expect.poll(() => page.evaluate(() => window.pickerCalls.length)).toBe(1);
    expect(await page.evaluate(() => window.pickerCalls[0])).toEqual({id: 'project-root', mode: 'readwrite'});
});
