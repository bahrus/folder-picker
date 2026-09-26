import { test, expect } from '@playwright/test';
import { stubPicker, pickAndVerify } from '../stubPicker.mjs';

test.beforeEach(async ({ page }) => {
    await stubPicker(page);
});

test('PickFolder', async ({ page }) => {
    await page.goto('./tests/PickFolder/PickFolder.html');
    await pickAndVerify(page, expect, '📁⛏️', {});
});

test('PickFolder>WithOptions', async ({ page }) => {
    // Known issue: the attribute's JSON is spread onto the enhancement
    // (_base.mapsTo: '.'), so id/mode end up as top-level props and
    // showDirectoryPicker receives the default {} options.
    // Remove this line once the options are passed through.
    test.fail();
    await page.goto('./tests/PickFolder/WithOptions.html');
    await pickAndVerify(page, expect, '📁⛏️', {id: 'project-root', mode: 'readwrite'});
});
