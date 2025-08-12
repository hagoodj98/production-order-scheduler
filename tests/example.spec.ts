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

// Reset state before each test to ensure isolation.
/*
test.describe('Order Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('http://localhost:3000');
  });

  test('Create Pending order', async ({ page }) => {
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.getByTestId('cell-1_24-47-24-49').click();
    await page.locator('select[name="start"]').selectOption('24:47');
    await page.locator('select[name="end"]').selectOption('24:49');
    await page.locator('select[name="resource"]').selectOption('Assembly Line B');
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.waitForURL('**///available-slots'); // ✅ wait for client-side navigation
   /* await page.waitForSelector('[data-testid="cell-1_24-47-24-49"]');
    await expect(page.getByTestId('cell-1_24-47-24-49')).toHaveText('Pending', { timeout: 10000 });
  });
  test('Show invalid for one field', async ({ page }) => {
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.getByTestId('cell-1_24-47-24-49').click();
    await page.locator('select[name="start"]').selectOption('');
    await page.locator('select[name="end"]').selectOption('24:49');
    await page.locator('select[name="resource"]').selectOption('Assembly Line B');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Please select start time')).toBeVisible();
  });
  test('Show invalid for all fields', async ({ page }) => {
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.getByTestId('cell-1_24-47-24-49').click();
    await page.locator('select[name="start"]').selectOption('');
    await page.locator('select[name="end"]').selectOption('');
    await page.locator('select[name="resource"]').selectOption('');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Please select start time')).toBeVisible();
    await expect(page.getByText('Please select end time')).toBeVisible();
    await expect(page.getByText('Please choose a job')).toBeVisible();
  });
});//All test passed
  */

 /*
test.describe('Order Editing & Scheduling:', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('http://localhost:3000');
    // Reset backend state
    //await page.request.post('http://localhost:3000/api/reset-state');
  });
 
  test('Edit Pending order ', async ({ page }) => {
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.getByTestId('cell-1_24-47-24-49').click();
    await page.locator('select[name="start"]').selectOption('24:47');
    await page.locator('select[name="end"]').selectOption('24:49');
    await page.locator('select[name="resource"]').selectOption('Assembly Line B');
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.waitForURL('**///available-slots');
    //await expect(page.getByTestId('cell-1_24-47-24-49')).toHaveText('Pending');
    // Now edit
    /*
    await page.getByTestId('cell-1_24-47-24-49').click();
    await page.locator('select[name="start"]').selectOption('24:47');
    await page.locator('select[name="end"]').selectOption('24:49');
    await page.locator('select[name="resource"]').selectOption('CNC Machine 1');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(9000); // Wait for setLastJob to clear
    await page.waitForURL('**///available-slots');
    //await expect(page.getByTestId('cell-0_24-47-24-49')).toHaveText('Scheduled');
  //});
//});  //test passed
/*
test.describe('Scheduling Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Prevent form submission on false times', async ({ page }) => {
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.getByTestId('cell-1_24-47-24-49').click();
    await page.locator('select[name="start"]').selectOption('24:47');
    await page.locator('select[name="end"]').selectOption('08:45');
    await page.locator('select[name="resource"]').selectOption('Assembly Line B');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Sorry! End time must be after start time.')).toBeVisible();
  })
});
*/
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
 // await page.request.post('http://localhost:3000/api/reset-state');
});
/*
test.describe('Table Interaction', () => {
  test('Click and filter by Scheduled', async ({ page }) => {
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.getByTestId('cell-1_24-47-24-49').click();
    await page.locator('select[name="start"]').selectOption('24:47');
    await page.locator('select[name="end"]').selectOption('24:49');
    await page.locator('select[name="resource"]').selectOption('Assembly Line B');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('cell', { name: '24:47-24:49' }).click();
    await page.getByRole('option', { name: 'Scheduled' }).click();
    await expect(page.getByTestId('cell-2_24-47-24-49')).toHaveText('Scheduled', { timeout: 10000 });
  })
});//*/

test.describe('Dashboard Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
   // await page.request.post('http://localhost:3000/api/reset-state');
  });
  test('chart renders status and reflects the current data state', async ({ page }) => {
    test.setTimeout(120_000); // allow 1.5 minutes for this test
    await page.getByRole('button', { name: 'View Orders' }).click();
    await page.getByTestId('cell-2_22-31-22-32').click();
    await page.locator('select[name="start"]').selectOption('22:31');
    await page.locator('select[name="end"]').selectOption('22:32');
    await page.locator('select[name="resource"]').selectOption('Assembly Line B');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Back to Dashboard' }).click();
    expect(page.locator('div').filter({ hasText: 'DashboardView Orders' }).getByRole('img').nth(3).hover()).toBeTruthy();
    await expect(page.getByText(/2 slots available/i)).toBeVisible({ timeout: 5000});//up to here it passes
   //The wait period is going to be based on the start and end time i select
    await page.locator('div').filter({ hasText: 'DashboardAssembly Line B3' }).locator('svg').hover();
    await page.locator('div').filter({ hasText: 'DashboardView Orders' }).getByRole('img').nth(3).hover();
    await expect(page.getByText(/3 slots available/i)).toBeVisible({ timeout: 5000});
  }); //Passed
});