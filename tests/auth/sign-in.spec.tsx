import { expect, test, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;
let userEmail = 'newUser@gmail.com';
let userPassword = 'newUserPass';

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

// test('Sign up user successfully', async () => {
//   await page.goto('http://localhost:3000/');
//   await page.getByRole('button', { name: 'Sign up' }).click();
//   await page.getByPlaceholder('email...').click();
//   await page.getByPlaceholder('email...').fill(userEmail);
//   await page.getByPlaceholder('username...').click();
//   await page.getByPlaceholder('username...').fill('newUser');
//   await page.getByPlaceholder('password...').click();
//   await page.getByPlaceholder('password...').fill(userPassword);
//   await page.getByRole('main').getByRole('button', { name: 'Sign up' }).click();
//   await expect(
//     page.getByTestId('profile-dropdown')
//   ).toBeVisible();
// });

test('Sign in user successfully', async () => {
  await page.goto('http://localhost:3000/');
  await page.reload();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('email...').click();
  await page.getByPlaceholder('email...').fill(userEmail);
  await page.getByPlaceholder('password...').click();
  await page.getByPlaceholder('password...').fill(userPassword);
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
  await expect(
    page.getByTestId('profile-dropdown-trigger')
  ).toBeVisible();
});


test('Sign out user successfully', async () => {
  await page.getByTestId('profile-dropdown-trigger').click()
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

// test('Delete user and redirect to signin', async () => {
//   await page.getByRole('navigation').getByRole('img').nth(1).click();
//   await page.getByRole('menuitem', { name: 'settings' }).click();
//   page.pause()
//   await expect(
//     page.getByRole('heading', { name: 'Personal Information' })
//   ).toBeVisible();
//   await page.getByRole('button', { name: 'Delete Account' }).click();
//   await expect(page).toHaveURL('http://localhost:3000/signin');
// });
