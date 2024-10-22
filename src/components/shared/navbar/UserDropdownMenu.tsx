'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { LogOut, User } from 'lucide-react';
import { profileLinks } from '../../../constants/navbar-links.constants';

export default function UserDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src="/"
            alt="User avatar"
            className="size-10 rounded-full border"
          />
          <AvatarFallback>
            <User data-testid={'profile-dropdown-trigger'} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profileLinks.map((link) => (
          <DropdownMenuItem
            asChild
            key={link.label}
            className="cursor-pointer"
          >
            <Link href={link.href}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer flex justify-between"
        >
          <>
            <LogOut width={18} height={18} />
            Logout
          </>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
