import { test, expect } from '@playwright/test';
import { stubPicker, pickAndVerify } from './stubPicker.mjs';
test('ProgrammaticImperative', async ({ page }) => {
    await stubPicker(page);
    await page.goto('./tests/ProgrammaticImperative.html');
    await pickAndVerify(page, expect, 'folderPicker', {id: 'programmatic', mode: 'read'});
});
