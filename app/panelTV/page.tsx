"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import QRCode from 'qrcode';
import Image from "next/image";
import logoCofen from "../../public/img/250x250.png";

const PanelPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isWaitingAuth, setIsWaitingAuth] = useState(true);

  useEffect(() => {
    const newSessionId = `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);


  useEffect(() => {
    if (sessionId) {
      const mobileAuthUrl = `${window.location.origin}/mobile-auth?sessionId=${sessionId}&redirect=panelTV`;
      
      QRCode.toDataURL(mobileAuthUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl);
    }
  }, [sessionId]);


  useEffect(() => {
    if (!sessionId || isAuthenticated) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/auth/check-session/${sessionId}`);
        const data = await response.json();
        
        if (data.authenticated && data.token) {
    
          localStorage.setItem('access_token', data.token);
          localStorage.setItem('refresh_token', data.refreshToken || '');
          
        
          document.cookie = `access_token=${data.token}; path=/;`;
          
      
          setIsWaitingAuth(false);
          clearInterval(pollInterval);
          
          window.location.reload();
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    }, 2000); // Verificar a cada 2 segundos

    return () => clearInterval(pollInterval);
  }, [sessionId, isAuthenticated]);

  if (isAuthenticated && !isWaitingAuth) {
    return (
      <div className="w-full h-screen flex flex-col">
        {/* Cabeçalho com info da unidade */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Painel TV - Unidade: {user?.unitId || 'N/A'}
            </h1>
            <p className="text-sm opacity-80">
              Usuário: {user?.preferred_username}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
              window.location.reload();
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
          >
            Desconectar
          </button>
        </div>

        {/* SEU CONTEÚDO ATUAL DO PAINEL */}
        <div className="flex-1">
          {/* ... todo o conteúdo atual do painel ... */}
        </div>
      </div>
    );
  }

  // ✅ TELA DE QR CODE
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src={logoCofen}
            alt="Logo Cofen"
            width={120}
            height={120}
            className="mx-auto"
            priority
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Painel TV
        </h1>
        <p className="text-gray-600 mb-6">
          Escaneie o QR Code com seu dispositivo móvel para acessar
        </p>

        {/* QR Code */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="mx-auto"
            />
          ) : (
            <div className="w-[300px] h-[300px] mx-auto bg-gray-200 rounded flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="text-sm text-gray-600 space-y-2">
          <p>📱 Abra o aplicativo no seu celular</p>
          <p>🔐 Faça login na sua conta</p>
          <p>📷 Escaneie o código QR</p>
        </div>

        {/* Indicador de sessão */}
        <div className="mt-4 text-xs text-gray-400">
          Sessão: {sessionId.split('-')[1]}
        </div>
      </div>
    </div>
  );
};

export default PanelPage;