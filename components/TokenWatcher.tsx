"use client";

import { useEffect } from 'react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';


// Component that monitors token validity and automatically redirects to /auth when the token expires
export function TokenWatcher() {
  const { checkAndRedirect } = useAuthRedirect();

  useEffect(() => {
    // Visual and console log for validation
    // if (typeof window !== 'undefined') {
    //   const page = window.location.pathname + window.location.search;
    //   console.log('[TokenWatcher] Ativo na página:', page);
    //   const el = document.createElement('div');
    //   el.id = 'token-watcher-debug';
    //   el.style.position = 'fixed';
    //   el.style.bottom = '10px';
    //   el.style.right = '10px';
    //   el.style.zIndex = '9999';
    //   el.style.background = '#fcd32a';
    //   el.style.color = '#222';
    //   el.style.padding = '6px 12px';
    //   el.style.borderRadius = '6px';
    //   el.style.fontSize = '12px';
    //   el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    //   el.innerText = `[TokenWatcher] Ativo: ${page}`;
    //   document.body.appendChild(el);
    //   setTimeout(() => {
    //     if (el.parentNode) el.parentNode.removeChild(el);
    //   }, 3500);
    // }

   // Check token when mounting the component
    checkAndRedirect();
    
    // Check periodically (every 30 seconds)
    const interval = setInterval(() => {
      checkAndRedirect();
    }, 30000);
    
    // Check when the window gains focus (user returns to the tab)
    const handleFocus = () => {
      checkAndRedirect();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAndRedirect]);

  return null; // This component does not render anything
}

export default TokenWatcher;
