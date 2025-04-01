// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The resource you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </main>
  );
}