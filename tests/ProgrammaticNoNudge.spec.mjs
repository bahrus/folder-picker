import { test, expect } from '@playwright/test';
test('ProgrammaticNoNudge', async ({ page }) => {
    await page.goto('./tests/ProgrammaticNoNudge.html');
    await expect.poll(() => page.evaluate(() => document.querySelector('#subject').enh.folderPicker?.resolved)).toBe(true);
    await expect(page.locator('#subject')).toBeDisabled();
});
