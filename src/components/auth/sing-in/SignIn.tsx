'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Github } from 'lucide-react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import ErrorMessage from '../ErrorMessage';
import SuccessMessage from '../SuccessMessage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SignInFormSchemaValues,
  SignInFormSchema,
} from '@/resolvers/forms/sign-in-form.resolver';

type CustomSubmitHandler<T extends FieldValues> = (
  formData: T,
  setError: Dispatch<SetStateAction<string | null>>,
  setSuccess: Dispatch<SetStateAction<string | null>>
) => Promise<void> | void;

type SignInFormProps = {
  onSubmit?: CustomSubmitHandler<SignInFormSchemaValues>;
};

export default function SignInForm({ onSubmit }: SignInFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignInFormSchemaValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onTouched',
    resolver: zodResolver(SignInFormSchema),
  });

  const { isSubmitting } = form.formState;

  const defaultHandleSubmit: CustomSubmitHandler<
    SignInFormSchemaValues
  > = async (formData, setError, setSuccess) => {
    setError(null);
    setSuccess(null);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        redirect: false,
      });

      if (!result) {
        setError('Unexpected error occurred. Please try again later.');
        return;
      }

      if (result.error) {
        console.log(result.error);
        setError(result.error);
        return;
      }

      if (!result.ok) {
        setError('Error while signing in');
        return;
      }
      setSuccess('Successfully signed in');
    } catch (error) {
      console.error(error);
      setError('Error occurred while signing in');
    }
  };

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 500);

      return () => clearTimeout(timeout); 
    }
  }, [success, router]);

  const handleSubmit: SubmitHandler<SignInFormSchemaValues> = async (data) => {
    await (onSubmit
      ? onSubmit(data, setError, setSuccess)
      : defaultHandleSubmit(data, setError, setSuccess));
  };

  return (
    <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign in
        </CardTitle>
        <CardDescription className="text-center">
          Choose your preferred sign in method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit, (err) => {
              console.log('err=', err);
            })}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel htmlFor="email" className="text-sm font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      placeholder="email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel htmlFor="password" className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      id="password"
                      placeholder="password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                </FormItem>
              )}
            />
            <SuccessMessage message={success} />
            <ErrorMessage message={error} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Sign in
            </Button>
          </form>
        </Form>
        <div className="flex">
          <Button
            variant="outline"
            onClick={() => signIn('github')}
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Dont have an account?
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
