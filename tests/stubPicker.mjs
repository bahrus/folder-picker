// showDirectoryPicker opens a native OS dialog (plus a permission prompt) that
// automation can't drive, so replace it before any page script runs.  The stub
// records the options it was called with and hands back a genuine
// FileSystemDirectoryHandle from the Origin Private File System, which needs
// no user interaction.
export async function stubPicker(page){
    await page.addInitScript(() => {
        window.pickerCalls = [];
        window.showDirectoryPicker = async (options) => {
            window.pickerCalls.push(options);
            const root = await navigator.storage.getDirectory();
            return await root.getDirectoryHandle('picked-folder', {create: true});
        };
    });
}

/**
 * Clicks the (nudged) button and verifies the stub was called with the
 * expected options and the handle landed on the enhancement.
 */
export async function pickAndVerify(page, expect, enhKey, expectedOptions){
    const button = page.locator('#subject');
    // hydration nudges the button, removing the disabled attribute
    await expect(button).toBeEnabled();
    await button.click();
    await expect.poll(() => page.evaluate((enhKey) => {
        const handle = document.querySelector('#subject').enh[enhKey]?.directoryHandle;
        return handle instanceof FileSystemDirectoryHandle ? `${handle.kind}:${handle.name}` : null;
    }, enhKey)).toBe('directory:picked-folder');
    expect(await page.evaluate(() => window.pickerCalls)).toEqual([expectedOptions]);
}
