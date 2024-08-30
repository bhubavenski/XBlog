import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';
import { Toaster } from '@/components/ui/toaster';
import { ToastContextProvider } from '../../contexts/toast.context';
import { ThemeProvider } from 'next-themes';
import { SessionWrapper } from '../../contexts/auth.context';
import Navbar from '@/components/shared/navbar/Navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/options';

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
  //не съм сигурен дали е нужно, предвид, че използваме middleware и там също проверяваме. Но е полезно
  //за да не се получават по два /session рекуеста
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`flex h-screen justify-center ${inter.className} dark:bg-[#0D1117]`}>
        <StoreProvider>
          <SessionWrapper session={session}>
            <ToastContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem={true}
              >
                <div className='w-[1100px] h-full flex flex-col items-center'>
                  <Navbar />
                  <div className="mt-10 w-full">{children}</div>
                  <Toaster />
                </div>
              </ThemeProvider>
            </ToastContextProvider>
          </SessionWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
