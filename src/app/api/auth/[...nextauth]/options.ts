import { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { UserRepo } from '@/repository/user.repo';
import { User as PrismaUser } from '@prisma/client';
import { SignInFormSchema } from '@/resolvers/forms/sign-in-form.resolver';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== "production",
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials were found');
        }
        // console.log({credentials})
        const validatedFields = SignInFormSchema.safeParse(credentials);
        // console.log(validatedFields.error)
        if (!validatedFields.success) {
          throw new Error('Credentials are not in valid format');
        }
        const { email, password, rememberMe } = validatedFields.data;

        let user = null;

        try {
          user = (await UserRepo.findUnique({
            where: { email },
          })) as PrismaUser & { rememberMe: boolean };
        } catch (error) {
          throw new Error('Error occured while searching for a user');
        }

        if (!user) {
          throw new Error("This user doesn't exists");
        }

        const isTheSamePass = await bcrypt.compare(password, user.password);

        if (!isTheSamePass) throw new Error('Wrong credentials');

        user.rememberMe = rememberMe;
        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      token.rememberMe = user?.rememberMe || false;

      if (token.rememberMe) {
        token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      } else {
        token.exp = Math.floor(Date.now() / 1000) + 24 * 60;
      }
      // console.log({ token });

      return token;
    },
    async session({ session, token }) {
      session.user.sub = token.sub;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};
declare module 'next-auth' {
  interface User extends PrismaUser {
    rememberMe: boolean;
  }

  interface Session extends DefaultSession {
    user: User & { sub?: string };
  }
}
