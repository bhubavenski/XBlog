import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import StoreProvider from './StoreProvider';
import { Toaster } from '@/components/ui/toaster';
import { ToastContextProvider } from '../../contexts/toast.context';
import { ThemeProvider } from 'next-themes';
import { SessionWrapper } from '../../contexts/auth.context';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`flex h-screen flex-col ${inter.className} dark:bg-[#0D1117]`}
      >
        <StoreProvider>
          <SessionWrapper session={session}>
            <ToastContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Navbar />
                <div className="mt-10">{children}</div>
                <Toaster />
              </ThemeProvider>
            </ToastContextProvider>
          </SessionWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
