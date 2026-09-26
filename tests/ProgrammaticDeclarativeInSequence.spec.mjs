import { test, expect } from '@playwright/test';
import { stubPicker, pickAndVerify } from './stubPicker.mjs';
test('ProgrammaticDeclarativeInSequence', async ({ page }) => {
    await stubPicker(page);
    await page.goto('./tests/ProgrammaticDeclarativeInSequence.html');
    await pickAndVerify(page, expect, 'folderPicker', {id: 'programmatic', mode: 'read'});
});
