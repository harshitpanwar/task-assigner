import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token && req.nextUrl.pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/profile'],
};
