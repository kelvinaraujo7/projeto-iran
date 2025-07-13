"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import logoCofen from "../public/img/250x250.png";

export default function NotFound() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto">
            <Image
              src={logoCofen}
              alt="Logo Cofen"
              width={150}
              height={150}
              className="mx-auto mb-4"
              priority
            />
          </div>
          
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Página não encontrada
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">
              404
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair do Sistema
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Se você acredita que isso é um erro, entre em contato com o suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}