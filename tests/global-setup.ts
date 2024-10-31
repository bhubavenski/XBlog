import { chromium, expect } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('email...').fill('fakeUser@gmail.com');
  await page.getByPlaceholder('password...').fill('fakePass');
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
  
  await expect(page.getByTestId('profile-dropdown-trigger')).toBeVisible();
  
  // Save session state
  await context.storageState({ path: './auth.json' });

  await browser.close();
}
