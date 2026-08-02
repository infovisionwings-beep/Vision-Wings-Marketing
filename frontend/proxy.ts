import { auth } from '@/lib/auth/server';
import { NextResponse, type NextRequest } from 'next/server';

const neonProxy = auth.middleware({
  loginUrl: '/login'
});

export default function proxy(request: NextRequest) {
  // Neon's middleware re-issues its `get-session` call using the *incoming* method and
  // body, so a Server Action POST asks the auth server for a session via POST with the
  // action payload. That call fails, the session reads as null, and every action gets
  // 307'd to /login -- which the client sees as "An unexpected response was received
  // from the server." Actions authenticate themselves (admin_session cookie, plus the
  // backend verifies the bearer token), so let them past the proxy.
  if (request.headers.has('next-action')) return NextResponse.next();
  return neonProxy(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*"
  ],
};
