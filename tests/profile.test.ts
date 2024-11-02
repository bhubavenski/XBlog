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

test('User can update profile info', async ({ page }) => {
  const firstName = 'fakeFirstName';
  const lastName = 'fakeLastName';
  const username = 'fakeUsername';
  const bio = 'fakeBio';

  await page.goto('http://localhost:3000/');
  await page.getByTestId('profile-dropdown-trigger').click();
  await page.getByRole('menuitem', { name: 'settings' }).click();

  await page.getByLabel('First name').fill(firstName);
  await page.getByLabel('Last name').fill(lastName);
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Bio').fill(bio);

  await page.getByRole('button', { name: 'Update' }).click();

  await page.reload();

  await expect(page.getByLabel('First name')).toHaveValue(firstName);
  await expect(page.getByLabel('Last name')).toHaveValue(lastName);
  await expect(page.getByLabel('Username')).toHaveValue(username);
  await expect(page.getByLabel('Bio')).toHaveValue(bio);
});

// FREAKY TEST
// test.only('User can update their password', async ({ page, login }) => {
//   const { email, password } = login();
//   const currentPassword = password;
//   const newPassword = 'newFakePass';

//   await page.goto('http://localhost:3000/');

//   await page.getByTestId('profile-dropdown-trigger').click();
//   await page.getByRole('menuitem', { name: 'settings' }).click();
//   await page.getByRole('tab', { name: 'Security' }).click();

//   await page.getByPlaceholder('currentPassword').fill(currentPassword);
//   await page.getByPlaceholder('newPassword').fill(newPassword);
//   await page.getByPlaceholder('confirmPassword').fill(newPassword);

//   await page
//     .getByRole('button', { name: 'Update Security Credentials' })
//     .click();

//   await expect(page.getByText('Successfully updated profile')).toBeVisible();

//   await page.getByTestId('profile-dropdown-trigger').click();
//   await page.getByRole('menuitem', { name: 'Logout' }).click();
//   await expect(page).toHaveURL('http://localhost:3000/signin');

//   await page.getByPlaceholder('email...').fill(email);
//   await page.getByPlaceholder('password...').fill(newPassword);

//   await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
//   // await expect(page.getByText('Successfully signed in')).toBeVisible();
  

//   await expect(page).toHaveURL('http://localhost:3000/');

//   await expect(page.getByTestId('profile-dropdown-trigger')).toBeVisible();
// });
