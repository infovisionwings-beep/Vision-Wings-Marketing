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

  // The dashboard needs the secondary admin session on top of the primary one.
  // /admin-login and /admin-invite are excluded: they are how you get that cookie,
  // so gating them on it would lock every admin out permanently.
  const isAdminDashboard = path === "/admin" || path.startsWith("/admin/");
  if (isAdminDashboard) {
    if (!request.cookies.get("admin_session")?.value) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    // admin_activity lapses 15 minutes after the last heartbeat, so its absence
    // here is an idle timeout. requireAdmin repeats this check — the edge is the
    // cheap gate, not the only one.
    if (!request.cookies.get("admin_activity")?.value) {
      return NextResponse.redirect(new URL("/admin-login?reason=idle", request.url));
    }
  }

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
