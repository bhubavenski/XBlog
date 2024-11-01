import { getErrorMessage, validateSchema } from '@/lib/utils';
import { UserRepo } from '@/repository/user.repo';
import { SecuritySchema } from '@/resolvers/forms/security-form.resolver';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'User Id is required' },
      { status: 400 } // 400 Bad Request
    );
  }

  const body = await req.json();
  // console.log(body);

  const validatedFields = validateSchema(SecuritySchema, body);

  if ('error' in validatedFields) {
    return NextResponse.json(
      { error: validatedFields.error },
      { status: 400 } // 400 Bad Request
    );
  }
  const { currentPassword } = validatedFields.data;
  // console.log({ currentPassword });
  try {
    const userPass = await UserRepo.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!userPass) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isTheSamePass = await bcrypt.compare(
      currentPassword,
      userPass?.password
    );

    if (!isTheSamePass) {
      return NextResponse.json({ error: 'Wrong credentials' }, { status: 404 });
    }
    const newPass = await bcrypt.hash(currentPassword, 10);

    await UserRepo.update({
      where: {
        id: userId,
      },
      data: {
        password: newPass,
      },
    });
    return NextResponse.json(
      { message: 'Success updating credentials' },
      { status: 200 }
    ); // 200 OK
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Error while updating the user pass:', message);
    return NextResponse.json(
      { error: 'Internal server error: ' + message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
