import { db } from '@/prisma/db';
import { expect, test } from './playwrgiht-utils';
import { encode } from 'next-auth/jwt';
import { signIn } from 'next-auth/react';

test.use({
  storageState: './auth.json',
});
declare global {
  interface Window {
    nextauth: {
      signIn: (provider: string, options: any) => Promise<{ ok: boolean; url?: string }>;
    }
  }
}
test('Delete user and redirect to signin', async ({ page, createUserInDb, context, login }) => {
  await page.goto('http://localhost:3000/');

  context.clearCookies();

  login()
  

  await page.getByTestId('profile-dropdown-trigger').click();
  await page.getByRole('menuitem', { name: 'settings' }).click();
  await expect(
    page.getByRole('heading', { name: 'Personal Information' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Delete Account' }).click();
  await expect(page).toHaveURL('http://localhost:3000/signin');
});