import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { adminMiddleware } from './middleware/admin';

const locales = ['en', 'ru'];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export default async function middleware(request: Request) {
  const pathname = new URL(request.url).pathname;
  
  // Admin routes protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return adminMiddleware(request);
  }

  // Internationalization for other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};