import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/login'
});

export const config = {
  matcher: [
    // Match all paths except static files, api routes, Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
