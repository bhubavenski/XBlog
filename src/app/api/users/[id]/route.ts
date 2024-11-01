import { getErrorMessage, validateSchema } from '@/lib/utils';
import { UserRepo } from '@/repository/user.repo';
import { PersonalInfoSchema } from '@/resolvers/forms/personal-info-form.resolver';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  if (!userId) {
    return NextResponse.json(
      { error: 'Missing parameter: User ID is required' },
      { status: 400 }
    );
  }

  try {
    const user = await UserRepo.findUnique({
      where: {
        id: userId,
      },
      select: {
        bio: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 } // 404 Not Found
      );
    }
    return NextResponse.json(user, { status: 200 }); // 200 OK
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Error fetching the user:', message);
    return NextResponse.json(
      { error: 'Internal server error: ' + message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing parameter: User ID is required for update' },
      { status: 400 }
    );
  }

  const body = await req.json();
  const PersonalInfoSchemaWithoutLanguage = PersonalInfoSchema.omit({
    language: true,
  });
  const validatedFields = validateSchema(
    PersonalInfoSchemaWithoutLanguage,
    body
  );

  if ('error' in validatedFields) {
    return NextResponse.json(
      { error: validatedFields.error },
      { status: 400 } // 400 Bad Request
    );
  }

  try {
    const user = await UserRepo.findUnique({
      where: {
        id: userId,
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 } // 404 Not Found
      );
    }

    await UserRepo.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });

    return NextResponse.json(user, { status: 200 }); // 200 OK
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Error updating the user:', message);
    return NextResponse.json(
      { error: 'Internal server error: ' + message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
