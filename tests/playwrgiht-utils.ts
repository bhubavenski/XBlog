import { db } from '@/prisma/db';
import { SignUpValues } from '@/resolvers/forms/sign-up-form.resolver';
import { test as base, expect } from '@playwright/test';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
/*
за сигн-ъп -> трябва да изтрием потребителя след това
за сигн-ин -> стрябва да създадем потребителя преди това и да го изтрием след
за заключени страници -> трябва да създадем нов потребител и сесия за него
*/
type CreateUserInDbArgs = {
  email?: string;
  password?: string;
  username?: string;
  deleteUserAfter?: boolean;
};

const createUserInDbSelect = {
  id: true,
  email: true,
  username: true,
};

const test = base.extend<{
  createUserTemplate: () => SignUpValues;
  createUserInDb: (args?: CreateUserInDbArgs) => Promise<
    Prisma.UserGetPayload<{ select: typeof createUserInDbSelect }> & {
      password: string;
    }
  >;
  login: () => void;
}>({
  createUserTemplate: async ({}, use) => {
    const email = faker.internet.email();
    const username = faker.internet.username();
    const password = faker.internet.password();
    await use(() => ({
      email,
      username,
      password,
    }));
  },
  createUserInDb: async ({ createUserTemplate }, use) => {
    const user = createUserTemplate();
    let userId: string | undefined;
    let deleteUserAfter;

    await use(async (args) => {
      //if args.password is provided then use it, but if not, then use fake one from createUserTemplate()
      const password = args?.password ?? user.password;

      deleteUserAfter = args?.deleteUserAfter ?? false;

      const myUser = await db.user.create({
        data: {
          email: args?.email ?? user.email,
          password: await bcrypt.hash(password, 10),
          username: args?.username ?? user.username,
        },
        select: createUserInDbSelect,
      });

      userId = myUser.id;

      return { ...myUser, password };
    });

    if (deleteUserAfter) {
      await db.user.delete({
        where: {
          id: userId,
        },
      });
    }
  },
  // login: async ({ createUserInDb, page, context }, use) => {
  //   await context.clearCookies();

  //   const { email, password } = await createUserInDb();

  //   await page.goto('http://localhost:3000/');

  //   await page.getByRole('button', { name: 'Sign in' }).click();
  //   await page.getByPlaceholder('email...').fill(email);
  //   await page.getByPlaceholder('password...').fill(password);
  //   await page
  //     .getByRole('main')
  //     .getByRole('button', { name: 'Sign in' })
  //     .click();

  //   await expect(page.getByTestId('profile-dropdown-trigger')).toBeVisible();

  //   await context.storageState({
  //     path: './new-session',
  //   });
  //   await use(() => {});
  // },
});

export * from '@playwright/test';
export { test };
