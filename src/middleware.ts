// import { NextRequest, NextResponse } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get('accessToken')?.value; // Retrieve access token from cookies

//   if (!token) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/is-Blocked`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       console.error('Error checking user block status:', response.statusText);
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     const data = await response.json();

//     if (data.isBlocked) {
//       console.warn('User is blocked! Logging out...');
//       // Clear cookies and redirect to login
//       const res = NextResponse.redirect(new URL('/login', req.url));
//       res.cookies.set('accessToken', '', { maxAge: -1 }); // Remove access token
//       res.cookies.set('refreshToken', '', { maxAge: -1 }); // Remove refresh token
//       return res;
//     }
//   } catch (error) {
//     console.error('Middleware error:', error);
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   return NextResponse.next(); // Allow access
// }

// // Apply middleware to protected routes
// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*', '/courses/:path*'], // Add paths that require authentication
// };


// import { NextRequest, NextResponse } from "next/server";

// // Define protected routes
// const protectedRoutes: { [key: string]: string[] } = {
//   student: ["/home", "/courses", "/profile"],
//   tutor: ["/tutor/dashboard",],
//   admin: ["/admin/dashboard", "/admin/studentsmanagement", "/admin/tutormangement"],
// };

// // Middleware function
// export function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   const { pathname } = url;

//   // Get authentication cookies
//   const accessToken = req.cookies.get("accessToken")?.value;
//   const adminToken = req.cookies.get("admin-accessToken")?.value;

//   // Decode token to check role (simplified)
//   const role = req.cookies.get("role")?.value; 

//   // If accessing a protected route
//   if (pathname.startsWith("/tutor") && role !== "tutor") {
//     return NextResponse.redirect(new URL("/tutor/login", req.url));
//   }

//   if (pathname.startsWith("/admin") && !adminToken) {
//     return NextResponse.redirect(new URL("/admin/login", req.url));
//   }

//   if (pathname.startsWith("/dashboard") && role !== "student") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// // Define routes to run middleware on
// export const config = {
//   matcher: [
//     "/tutor/dashboard",
//     "/tutor/home",
//     "/admin/dashboard",
//     "/admin/studentsmanagement",
//     "/admin/tutormanagement",
//     "/home",
//   ],
// };


import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Get authentication cookies
  const token = req.cookies.get('accessToken')?.value;
  const adminToken = req.cookies.get('admin-accessToken')?.value;

  let role = null;

  // Decode JWT token to get the user role
  if (token) {
    try {
      const decoded: any = jwt.decode(token); // Decode token
      role = decoded?.role; // Extract role
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  console.log("middleware role =>", role)

  // Redirect if no token is found
  if (!token && !adminToken) {
    if (pathname.startsWith('/tutor')) {
      return NextResponse.redirect(new URL('/tutor/login', req.url));
    }
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.redirect(new URL('/login', req.url)); // Default: student login
  }

  // Check if student is blocked
  // if (role === 'student') {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/is-Blocked`, {
  //       method: 'GET',
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (!response.ok) {
  //       console.error('Error checking user block status:', response.statusText);
  //       return NextResponse.redirect(new URL('/login', req.url));
  //     }

  //     const data = await response.json();
  //     if (data.isBlocked) {
  //       console.warn('User is blocked! Logging out...');
  //       const res = NextResponse.redirect(new URL('/login', req.url));
  //       res.cookies.set('accessToken', '', { maxAge: -1 });
  //       res.cookies.set('refreshToken', '', { maxAge: -1 });
  //       return res;
  //     }
  //   } catch (error) {
  //     console.error('Middleware error:', error);
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }
  // }

  // Role-based access control
  if (pathname.startsWith('/tutor') && role !== 'Tutor') {
    return NextResponse.redirect(new URL('/tutor/login', req.url));
  }

  if (pathname.startsWith('/admin') && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (pathname.startsWith('/home') && role !== 'Student') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    '/home',
    '/courses/:path*',
    '/profile/:path*',
    '/tutor/dashboard',
    '/tutor/home',
    '/admin/dashboard',
    '/admin/studentsmanagement',
    '/admin/tutormanagement',
  ],
};
