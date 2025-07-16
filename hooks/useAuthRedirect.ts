import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TokenUtils } from '@/lib/token-utils';

export function useAuthRedirect() {
  const router = useRouter();

  const redirectToAuth = (returnUrl?: string) => {
    const currentPath = returnUrl || window.location.pathname + window.location.search;
    const encodedReturnUrl = encodeURIComponent(currentPath);
    window.location.href = `/auth?returnUrl=${encodedReturnUrl}`;
  };

  const checkAndRedirect = () => {
    const token = TokenUtils.getToken();
    
    if (token && TokenUtils.isExpired(token)) {
      console.warn('Token expirado detectado, redirecionando para /auth');
      TokenUtils.removeToken();
      redirectToAuth();
      return true; // Expired token
    }
    
    return false; // Valid token or does not exist
  };

  useEffect(() => {
    // Check immediately upon mounting
    checkAndRedirect();
    
    // Check every 30 seconds
    const interval = setInterval(() => {
      checkAndRedirect();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    redirectToAuth,
    checkAndRedirect
  };
}
