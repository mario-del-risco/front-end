// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Jiujitsu Database Explorer
        </Link>
        
        <div className="flex items-center gap-4">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {isAdmin ? 'Admin: ' : 'Signed in as: '}
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}