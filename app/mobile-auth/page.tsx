"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Smartphone, Monitor } from 'lucide-react';

function MobileAuthContent() {
  const { user, isAuthenticated, login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const sessionId = searchParams.get('sessionId');
  const redirectTo = searchParams.get('redirect');

  const handleAuthenticate = async () => {
    if (!sessionId || !isAuthenticated || !user) return;

    setIsAuthenticating(true);

    try {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      const response = await fetch('/api/auth/authenticate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          token,
          refreshToken,
          unitId: user.unitId || 'N/A'
        }),
      });

      if (response.ok) {
        setAuthSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error('Failed to authenticate session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao autenticar sessão');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">
              Erro: Sessão Inválida
            </h1>
            <p className="text-gray-600">
              Link de autenticação inválido ou expirado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-green-600 mb-2">
              Autenticação Realizada!
            </h1>
            <p className="text-gray-600 mb-4">
              O painel TV foi liberado com sucesso.
            </p>
            <div className="text-sm text-gray-500">
              Redirecionando...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <Smartphone className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <CardTitle>Autenticação Necessária</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-6">
              Você precisa fazer login para liberar o acesso ao Painel TV.
            </p>
            <Button 
              onClick={() => router.push('/auth')}
              className="w-full"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <Monitor className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <CardTitle>Liberar Painel TV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Usuário: <strong>{user?.preferred_username}</strong>
            </p>
            <p className="text-gray-600 mb-4">
              Unidade: <strong>{user?.unitId || 'N/A'}</strong>
            </p>
          </div>

          <Button 
            onClick={handleAuthenticate}
            disabled={isAuthenticating}
            className="w-full"
          >
            {isAuthenticating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Liberando Acesso...
              </>
            ) : (
              'Liberar Acesso ao Painel'
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            Sessão: {sessionId.split('-')[1]}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MobileAuth() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <MobileAuthContent />
    </Suspense>
  );
}