'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'My Classrooms', href: '/classrooms', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={clsx(
      'relative flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      <div className="flex h-16 items-center justify-center px-6">
        {isCollapsed ? (
          <Image
            src="/logo.png"
            alt="Epoch Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        ) : (
          <h1 className="text-xl font-bold text-gray-900">
            Epoch ChessLabs
          </h1>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={clsx(
                  'h-5 w-5 flex-shrink-0',
                  isCollapsed ? '' : 'mr-3',
                  isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                )}
                aria-hidden="true"
              />
              <span className={clsx(
                'transition-opacity',
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <SignedIn>
          <div className={clsx(
            'flex items-center',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}>
            <UserButton showName={!isCollapsed} />
          </div>
        </SignedIn>
        <SignedOut>
          {!isCollapsed && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Sign in to save progress</p>
              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Sign In
                </button>
              </SignInButton>
            </div>
          )}
        </SignedOut>
      </div>
    </div>
  );
}
