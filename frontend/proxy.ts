import { auth } from '@/lib/auth/server';
import { NextResponse, type NextRequest } from 'next/server';

const neonProxy = auth.middleware({
  loginUrl: '/login'
});

export default function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (request.headers.has("next-action")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") || path.startsWith("/dashboard")) {
    return neonProxy(request);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
