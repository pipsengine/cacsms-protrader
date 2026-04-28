// middleware.ts
// Example: Add custom middleware for Next.js (e.g., authentication, logging, etc.)

import { NextRequest, NextResponse } from 'next/server';

// Define protected routes (trading, execution, risk, etc.)
const protectedPaths = [
  '/dashboard',
  '/trade',
  '/execution',
  '/risk',
  '/admin',
  '/api/trade',
  '/api/execution',
  '/api/risk',
  '/api/strategy',
  '/api/liquidity',
  '/api/channel-strategy',
  '/api/sessions',
  '/api/market-data',
  '/api/symbols',
  '/api/structure',
  '/api/synthetic-candles',
  '/api/zones',
  // Add more as needed
];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Allow compliance, auth, static, and public routes
  if (
    path.startsWith('/compliance') ||
    path.startsWith('/api/compliance') ||
    path.startsWith('/login') ||
    path.startsWith('/auth') ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon') ||
    path.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Only enforce on protected paths
  if (protectedPaths.some(p => path.startsWith(p))) {
    // Simulate user session (replace with real session/user logic)
    const userId = 'current-user-uuid-mock';
    // Call compliance status API
    try {
      const res = await fetch(`${request.nextUrl.origin}/api/compliance/status/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.status !== 'COMPLIANT') {
          // Redirect to compliance gate if not compliant
          const complianceUrl = new URL('/compliance/accept', request.url);
          complianceUrl.searchParams.set('redirect', path);
          return NextResponse.redirect(complianceUrl);
        }
      }
    } catch (e) {
      // If compliance check fails, block access for safety
      const complianceUrl = new URL('/compliance/accept', request.url);
      complianceUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(complianceUrl);
    }
  }

  return NextResponse.next();
}

// See Next.js docs for advanced usage: https://nextjs.org/docs/app/building-your-application/routing/middleware
