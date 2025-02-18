'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/userAuthStore';
import { NextPage } from 'next';

// Extended type for components with getInitialProps
type ComponentWithAuth = {
  getInitialProps?: () => Promise<any>;
};

const withAuth = <P extends {}>(
  WrappedComponent: NextPage<P> & ComponentWithAuth
) => {
  const AuthWrapper = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, refreshAccessToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
         console.log("isAutheticated",isAuthenticated)
        if (!isAuthenticated) {
          try {
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              router.push('/tutor/login');
            }
          } catch (error) {
            console.error('Auth check failed:', error);
            router.push('/tutor/login');
          }
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [isAuthenticated, refreshAccessToken, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  // Copy getInitialProps if it exists
  if (WrappedComponent.getInitialProps) {
    AuthWrapper.getInitialProps = WrappedComponent.getInitialProps;
  }

  return AuthWrapper as NextPage<P>;
};

export default withAuth;
