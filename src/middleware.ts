
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/clerk-webhook',
  '/api/drive-activity/notification',
  '/api/payment/success',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

const isIgnoredRoute = createRouteMatcher([
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
]);

export default clerkMiddleware((auth, req) => {
  if (!(isPublicRoute(req) || isIgnoredRoute(req))) {
    auth().protect();
  }

});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
