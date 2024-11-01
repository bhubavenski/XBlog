import { expect, test } from './playwrgiht-utils';

test.use({
  storageState: './auth.json',
});

test('Delete user and redirect to signin', async ({
  page,
  context,
  createUserInDb,
}) => {
  await context.clearCookies();

  const { email, password } = await createUserInDb({
    deleteUserAfter: false
  });

  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('email...').fill(email);
  await page.getByPlaceholder('password...').fill(password);
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByTestId('profile-dropdown-trigger')).toBeVisible();

  await page.getByTestId('profile-dropdown-trigger').click();
  await page.getByRole('menuitem', { name: 'settings' }).click();
  await expect(
    page.getByRole('heading', { name: 'Personal Information' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Delete Account' }).click();
  await expect(page).toHaveURL('http://localhost:3000/signin');
});
