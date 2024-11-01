'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '../../ui/form';
import Spinner from '../../shared/Spinner';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  SecuritySchema,
  SecurityValues,
} from '@/resolvers/forms/security-form.resolver';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '../../auth/ErrorMessage';
import SuccessMessage from '../../auth/SuccessMessage';
import { getErrorMessage } from '@/lib/utils';
import { useUpdateUserPassMutation } from '@/lib/features/users/users.slice';
import { Eye, EyeOff } from 'lucide-react';

export default function SecurityForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data, status } = useSession();
  const form = useForm<SecurityValues>({
    defaultValues: {
      confirmPassword: '',
      currentPassword: '',
      newPassword: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(SecuritySchema),
  });
  const [fieldsVisibility, setFieldsVisibility] = useState({
    confirmPassword: false,
    currentPassword: false,
    newPassword: false,
  });
  const [updateUserPass, { isLoading: isUpdateUserDataLoading }] =
    useUpdateUserPassMutation();
  const user = data?.user;

  if (status === 'loading') {
    return <Spinner />;
  }

  if (!data || !user) {
    return <div>Can not find your session</div>;
  }

  const onSubmit: SubmitHandler<SecurityValues> = async (formValue) => {
    setSuccess(null);
    setError(null);

    try {
      await updateUserPass({
        userId: data!.user.sub!,
        data: {
          currentPassword: formValue.currentPassword,
          newPassword: formValue.newPassword,
          confirmPassword: formValue.confirmPassword,
        },
      }).unwrap();
      setSuccess('Successfully updated profile information');
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="currentPassword"
                        {...field}
                        type={
                          fieldsVisibility[field.name] ? 'text' : 'password'
                        }
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldsVisibility((prev) => ({
                            ...prev,
                            [field.name]: !prev[field.name],
                          }))
                        }
                        className="absolute right-5 top-1/2 transform -translate-y-1/2"
                      >
                        {fieldsVisibility[field.name] ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="newPassword"
                        {...field}
                        type={
                          fieldsVisibility[field.name] ? 'text' : 'password'
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldsVisibility((prev) => ({
                            ...prev,
                            [field.name]: !prev[field.name],
                          }))
                        }
                        className="absolute right-5 top-1/2 transform -translate-y-1/2"
                      >
                        {fieldsVisibility[field.name] ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="confirmPassword"
                        {...field}
                        type={
                          fieldsVisibility[field.name] ? 'text' : 'password'
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldsVisibility((prev) => ({
                            ...prev,
                            [field.name]: !prev[field.name],
                          }))
                        }
                        className="absolute right-5 top-1/2 transform -translate-y-1/2"
                      >
                        {fieldsVisibility[field.name] ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isUpdateUserDataLoading}
              className="gap-3 w-full"
            >
              {isUpdateUserDataLoading
                ? 'Updating...'
                : 'Update Security Credentials'}
            </Button>
            {success && <SuccessMessage message={success} className="mt-3" />}
            {error && <ErrorMessage message={error} className="mt-3" />}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
