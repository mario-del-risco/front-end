// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Define paths that require authentication
  const protectedPaths = [
    '/edit',
    '/admin',
    '/api/edit'
  ];
  
  // Check if the current path is in the protected paths list
  const isProtectedPath = protectedPaths.some(
    (prefix) => path.startsWith(prefix)
  );
  
  // If the path is not protected, allow the request
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // If not authenticated, redirect to login page
  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', encodeURI(req.url));
    return NextResponse.redirect(url);
  }
  
  // For paths that should only be accessible by admins
  const adminOnlyPaths = ['/admin'];
  const isAdminPath = adminOnlyPaths.some((prefix) => path.startsWith(prefix));
  
  if (isAdminPath && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth/ (authentication routes)
     * 2. /static (static files)
     * 3. /_next (Next.js internals)
     * 4. /favicon.ico, /robots.txt (SEO files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};