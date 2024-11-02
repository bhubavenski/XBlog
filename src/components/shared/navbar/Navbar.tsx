import Link from 'next/link';
import AuthWrapper from './AuthWrapper';
import { ModeToggle } from './ModeToggle';
import NavMenu from './NavMenu';

export default function Navbar() {
  return (
    <nav className="bg-background border-b w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Navigation menu */}
          <div className="flex items-center flex-1">
            <NavMenu />
          </div>

          {/* Middle: Brand name */}
          <div className="flex-1 flex justify-center">
            <Link className="font-bold text-xl text-primary" href='/'>XBlog</Link>
          </div>

          {/* Right side: User actions */}
          <div className="flex items-center justify-end flex-1 gap-2">
            {/* Profile avatar or Login/Logout button */}
            <AuthWrapper />

            {/* Theme switcher */}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
