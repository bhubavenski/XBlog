'use client';

import { HelpCircle, Trash2, LogOut } from 'lucide-react';
import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { deleteUser } from '@/lib/actions/user.actions';
import { Toast, useToastContext } from '@/contexts/toast.context';
import { signOut } from 'next-auth/react';

type ProfileAdditionalOptionsProps = {
  onDelete?: (toast: Toast) => Promise<Toast>;
};

export default function ProfileAdditionalOptions({
  onDelete,
}: ProfileAdditionalOptionsProps) {
  const toast = useToastContext();

  const defaultHandleDelete = async () => {
    const result = await deleteUser();
    if (result?.error) {
      return toast({
        variant: 'destructive',
        title: 'Cannot delete profile',
        description: result.error,
      });
    }
    await signOut();
  };

  const handleDelete = onDelete || defaultHandleDelete;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          <div className=" flex gap-2">
            <span>Help Center</span>
            <span className="text-muted-foreground font-light">
              Not implemented feature
            </span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-destructive/15 hover:text-destructive"
          onClick={() => handleDelete(toast)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </CardContent>
    </Card>
  );
}
