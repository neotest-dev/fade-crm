import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes — no auth required
const isPublicRoute = createRouteMatcher([
  '/reservar',
  '/reservar/servicios',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

// Routes that require admin role
const isAdminRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/citas(.*)',
  '/clientes(.*)',
  '/ventas(.*)',
  '/servicios(.*)',
  '/productos(.*)',
  '/mensajes(.*)',
  '/reportes(.*)',
  '/configuracion(.*)',
]);

// Routes that require any authenticated user (client or admin)
const isProtectedRoute = createRouteMatcher([
  '/reservar/cita(.*)',
  '/reservar/productos(.*)',
  '/reservar/confirmacion(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  // Admin routes: must be authenticated AND have role 'admin'
  if (isAdminRoute(req)) {
    if (!userId) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn();
    }
    if (role !== 'admin') {
      // Non-admin authenticated users go to the client portal
      return NextResponse.redirect(new URL('/reservar', req.url));
    }
  }

  // Protected portal routes: must be authenticated (any role)
  if (isProtectedRoute(req)) {
    if (!userId) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn();
    }
  }

  // Root redirect: authenticated users go to their area
  if (req.nextUrl.pathname === '/' && userId) {
    const destination = role === 'admin' ? '/dashboard' : '/reservar';
    return NextResponse.redirect(new URL(destination, req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};
