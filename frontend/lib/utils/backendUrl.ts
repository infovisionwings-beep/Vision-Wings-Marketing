export function getBackendUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const defaultProdUrl = 'https://vision-wings-marketing.onrender.com';

  // Client-side browser check
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      // Always target live production API when browser is on production domain
      return defaultProdUrl;
    }
  }

  // Server-side Vercel check
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    if (!envUrl || envUrl.includes('localhost')) {
      return defaultProdUrl;
    }
  }

  return envUrl || defaultProdUrl;
}
