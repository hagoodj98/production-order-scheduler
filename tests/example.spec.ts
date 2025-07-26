import { test, expect } from '@playwright/test';
  // @ts-check

/*
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
test('homepafe loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Create Next App/)
})
*/


test.describe('Order Creation', () => {
  
  test('Create Pending order', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Create Next App/)
    await page.getByTestId('cell-1_24-45-24-47').click();
    await expect(page).toHaveURL('http://localhost:3000/assign-resource');
    await page.getByRole('link', {name: 'Back' }).click();
    await expect(page).toHaveURL('http://localhost:3000');
    await expect(page.getByText('Hello world')).toBeVisible();
    const cell = page.getByTestId('cell-1_24-45-24-47');
    await expect(cell).toHaveText('Pending');
  });

})
