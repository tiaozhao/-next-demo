import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 只对主页设置缓存头
  if (request.nextUrl.pathname === '/') {
    // 设置缓存控制头
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, stale-while-revalidate=30, s-maxage=2592000'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 