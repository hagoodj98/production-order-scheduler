import { test, expect } from '@playwright/test';
import { mockAvailability } from './mockData';
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

//test.describe('Order Creation', () => {
 
  //test('Create Pending order', async ({ page }) => {
  //  let isFirstRequest = true;
   // await page.route('**/api/poll-resource', async route => {
   /*   console.log('Intercepted!', isFirstRequest);
      // First fetch simulates initial table state (all Available)
      if (isFirstRequest) {
        isFirstRequest = false;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockAvailability),
        });
      } else {
        // Second fetch reflects the user's action (cell becomes Pending)
          const updatedAvailability = [
            {
              name: 'Assembly Line A',
              '24:45-24:47': 'Pending',
            }
          ];
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(updatedAvailability),
          });
      }
    });
    await page.goto('http://localhost:3000');
    await page.getByTestId('cell-1_24-45-24-47').click();
    await expect(page).toHaveURL('http://localhost:3000/assign-resource');
    // Wait until the timeslot select has at least one real option (besides the placeholder)
 
    await page.selectOption('select[name="timeslot"]', '24:45-24:47');
    await page.selectOption('select[name="resource"]', 'Assembly Line A');
    
    await page.getByRole('link', {name: 'Back' }).click();
    await expect(page).toHaveURL('http://localhost:3000');
    const cellPending = page.getByTestId('cell-1_24-45-24-47');
    await expect(async () => {
      const text = await cellPending.textContent();
      expect(text).toBe('Pending');
    }).toPass();
    await expect(page.getByText('Hello world')).toBeVisible();
    const cell = page.getByTestId('cell-1_24-45-24-47');
    await expect(page.getByTestId('cell-1_24-45-24-47')).toHaveText('Pending', { timeout: 6000 });
  });

  //test('Show validation errors for invalid data', async ({page}) => {
    //await page.route('api/poll-resource', async route => {
    /*  await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAvailability),
      });
    });
    await page.goto('http://localhost:3000');
    await page.getByTestId('cell-1_24-45-24-47').click();
    await expect(page).toHaveURL('http://localhost:3000/assign-resource');
     // Leave selects untouched — submit directly
    await page.getByRole('button', { name: 'Submit' }).click();
    // Expect validation messages to appear
    await expect(page.getByText('Please select timeSlot')).toBeVisible();
    await expect(page.getByText('Please choose a job')).toBeVisible();
  
  });

  //test('Show validation errors for only one invalid field', async ({page}) => {
    // await page.route('**api/poll-resource', async route => {
    /*  await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAvailability),
      });
    });
    await page.goto('http://localhost:3000');
    await page.getByTestId('cell-1_24-45-24-47').click();
    await expect(page).toHaveURL('http://localhost:3000/assign-resource');
    await page.selectOption('select[name="timeslot"]', '24:45-24:47');
    
    await page.getByRole('button', { name: 'Submit' }).click();
    // Expect validation messages to appear
    await expect(page.getByText('Please choose a job')).toBeVisible();
    
  });

}); //All test passed!
/*

test.describe('Order Editing & Scheduling:', () => {
 
  test('Edit Pending order ', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByTestId('cell-1_24-45-24-47').click();
    await expect(page).toHaveURL('http://localhost:3000/assign-resource');
    // Wait until the timeslot select has at least one real option (besides the placeholder)
    await page.selectOption('select[name="timeslot"]', '24:45-24:47');
    await page.selectOption('select[name="resource"]', 'Assembly Line A');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL('http://localhost:3000/');
    const cell = page.getByTestId('cell-1_24-45-24-47');
    await expect(cell).not.toHaveText('Available', { timeout: 5000 });
    await expect(cell).toHaveText('Scheduled', { timeout: 10000 });
  });

});  */