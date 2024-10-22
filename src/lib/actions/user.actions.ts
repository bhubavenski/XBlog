'use server';

import { UserRepo } from '@/repository/user.repo';
import { getErrorMessage } from '../utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export const deleteUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return { error: 'User is not authenticated or session is invalid' };
  }

  try {
    await UserRepo.delete({
      where: {
        email: session.user.email,
      },
    });
  } catch (error) {
    const message = getErrorMessage(error);
    return { error: message };
  }
};
