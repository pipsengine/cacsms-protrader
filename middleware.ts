// middleware.ts
// Example: Add custom middleware for Next.js (e.g., authentication, logging, etc.)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Log all requests
  // console.log('Request:', request.url);
  return NextResponse.next();
}

// See Next.js docs for advanced usage: https://nextjs.org/docs/app/building-your-application/routing/middleware
