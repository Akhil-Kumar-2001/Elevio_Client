import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value; // Retrieve access token from cookies

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/is-Blocked`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Error checking user block status:', response.statusText);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const data = await response.json();
    
    if (data.isBlocked) {
      console.warn('User is blocked! Logging out...');
      // Clear cookies and redirect to login
      const res = NextResponse.redirect(new URL('/login', req.url));
      res.cookies.set('accessToken', '', { maxAge: -1 }); // Remove access token
      res.cookies.set('refreshToken', '', { maxAge: -1 }); // Remove refresh token
      return res;
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); // Allow access
}

// Apply middleware to protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/courses/:path*'], // Add paths that require authentication
};
