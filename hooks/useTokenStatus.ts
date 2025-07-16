import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TokenUtils } from '@/lib/token-utils';

export interface TokenStatus {
  hasToken: boolean;
  isValid: boolean;
  isExpired: boolean;
  timeToExpiry?: number;
  payload?: any;
}

export function useTokenStatus(autoRedirect: boolean = false) {
  const router = useRouter();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>({
    hasToken: false,
    isValid: false,
    isExpired: true
  });

  const checkTokenStatus = () => {
    const token = TokenUtils.getToken();
    const tokenInfo = TokenUtils.getCurrentTokenInfo();
    
    const newStatus = {
      hasToken: !!token,
      isValid: tokenInfo.isValid,
      isExpired: token ? TokenUtils.isExpired(token) : true,
      timeToExpiry: tokenInfo.timeToExpiry,
      payload: tokenInfo.payload
    };
    
    setTokenStatus(newStatus);
    
    // Automatic redirection if enabled
    if (autoRedirect && token && !tokenInfo.isValid) {
      console.warn('Token expirado detectado, redirecionando para /auth');
      TokenUtils.removeToken();
      const currentPath = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentPath);
      router.push(`/auth?returnUrl=${returnUrl}`);
    }
    
    return newStatus;
  };

  useEffect(() => {
    checkTokenStatus();
    
    // Check every minute
    const interval = setInterval(checkTokenStatus, 60000);
    
    return () => clearInterval(interval);
  }, [autoRedirect]);

  return {
    tokenStatus,
    refreshTokenStatus: checkTokenStatus,
    clearToken: () => {
      TokenUtils.removeToken();
      checkTokenStatus();
    }
  };
}
