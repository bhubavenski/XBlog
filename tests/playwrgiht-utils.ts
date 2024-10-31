import { db } from '@/prisma/db';
import { SignInFormSchemaValues } from '@/resolvers/forms/sign-in-form.resolver';
import { SignUpValues } from '@/resolvers/forms/sign-up-form.resolver';
import { test as base, expect } from '@playwright/test';
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { use } from 'react';
import { faker } from '@faker-js/faker';
/*
за сигн-ъп -> трябва да изтрием потребителя след това
за сигн-ин -> стрябва да създадем потребителя преди това и да го изтрием след
за заключени страници -> трябва да създадем нов потребител и сесия за него
*/

const test = base.extend<{
  createUserTemplate: SignUpValues;
  createUserInDb: User;
  login: ()=>void
}>({
  createUserTemplate: async ({}, use) => {
    const email = faker.internet.email();
    const username = faker.internet.username();
    const password = faker.internet.password();
    await use({
      email,
      username,
      password,
    });
  },
  createUserInDb: async ({ createUserTemplate }, use) => {
    const password = await bcrypt.hash(createUserTemplate.password, 10);
    const user = await db.user.create({
      data: { ...createUserTemplate, password },
    });

    await use({ ...user, password: createUserTemplate.password });

    await db.user.delete({
      where: {
        id: user.id,
      },
    });
  },
  login: async ({ createUserInDb, page, context }, use) => {
    const user = createUserInDb;

    const { email, password } = createUserInDb;

    await page.goto('http://localhost:3000/');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.getByPlaceholder('email...').fill(email);

    await page.getByPlaceholder('password...').fill(password);

    await page
      .getByRole('main')
      .getByRole('button', { name: 'Sign in' })
      .click();

    await expect(page.getByTestId('profile-dropdown-trigger')).toBeVisible();

    await context.storageState({
      path: './new-session'
    })
    await use(()=>{});
  },
});
export * from '@playwright/test';
export { test };
