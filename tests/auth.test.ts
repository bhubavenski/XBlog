import { db } from '@/prisma/db';
import { expect, test } from './playwrgiht-utils';

test('Sign up user successfully', async ({ page, createUserTemplate }) => {
  const { email, username, password } = createUserTemplate();
  try {
    await page.goto('http://localhost:3000/');

    await page.getByRole('button', { name: 'Sign up' }).click();

    await page.getByPlaceholder('email...').fill(email);

    await page.getByPlaceholder('username...').fill(username);

    await page.getByPlaceholder('password...').fill(password);

    await page
      .getByRole('main')
      .getByRole('button', { name: 'Sign up' })
      .click();
    await expect(page.getByTestId('profile-dropdown-trigger')).toBeVisible();
  } finally {
    await db.user.delete({
      where: {
        email,
      },
    });
  }
});

test('Sign in user successfully', async ({ page, createUserInDb }) => {
  const { email, password } = await createUserInDb({
    deleteUserAfter: true,
  });

  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByPlaceholder('email...').fill(email);

  await page.getByPlaceholder('password...').fill(password);

  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByTestId('profile-dropdown-trigger')).toBeVisible();
});

test('Sign out user successfully', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: './auth.json',
  });

  const page = await context.newPage();

  await page.goto('http://localhost:3000/');
  await page.getByTestId('profile-dropdown-trigger').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  await context.close();
});
