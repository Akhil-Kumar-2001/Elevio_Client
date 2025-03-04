
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './types/types';
import { decode } from 'punycode';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (pathname.startsWith('/login') || pathname.startsWith('/admin/login') || pathname.startsWith('/tutor/login') || pathname.startsWith('/api/auth/login')) {
    console.log("Skipping middleware for login request...");
    return NextResponse.next();
  }

  const token = req.cookies.get('accessToken')?.value || req.cookies.get('admin-accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const adminRefreshToken = req.cookies.get('admin-refreshToken')?.value;

  let role = null;
  if (token) {
    try {
      const decoded = jwt.decode(token) as TokenPayload | null; // ✅ Type-safe decoding
      role = decoded?.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  console.log("middleware role =>", role);

  if (!token) {
    if (pathname.startsWith('/tutor')) {
      return NextResponse.redirect(new URL('/tutor/login', req.url));
    }
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if ((!token && refreshToken) || (!token && adminRefreshToken)) {
    console.log("Access token expired, but refresh token exists. Allowing frontend to refresh.");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home',
    '/courses/:path*',
    '/profile/:path*',
    '/tutor/dashboard',
    '/tutor/verification',
    '/tutor/home',
    '/admin/dashboard',
    '/admin/studentsmanagement',
    '/admin/tutormanagement',
  ],
};
