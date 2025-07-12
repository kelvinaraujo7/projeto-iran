"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  console.log("🔍 ClientLayout - pathname:", pathname);
  console.log("🔍 ClientLayout - isAuthenticated:", isAuthenticated);
  console.log("🔍 ClientLayout - isLoading:", isLoading);

  const isPanelTV = pathname.startsWith("/panelTV");
  const isMyappointments = pathname.startsWith("/emissao-ficha/my-appointments");
  const isAdmin = pathname.startsWith("/admin");
  const isPublic = pathname.startsWith("/public");
  const isLogin = pathname.startsWith("/auth") || pathname === "/";
  const isUnauthorized = pathname === "/unauthorized";


  // ✅ ADICIONAR LOGS PARA DEBUG
  console.log("🔍 ClientLayout - isLogin:", isLogin);
  console.log("🔍 ClientLayout - isPanelTV:", isPanelTV);
  console.log("🔍 ClientLayout - isMyappointments:", isMyappointments);
  console.log("🔍 ClientLayout - isPublic:", isPublic);

  if (isPanelTV || isMyappointments || isLogin || isPublic || isUnauthorized) {
    console.log("✅ ClientLayout - Retornando apenas children (sem sidebar)");
    return <>{children}</>; 
  }


  // ✅ AGUARDAR CARREGAMENTO DO AUTH ANTES DE DECIDIR O LAYOUT
  if (isLoading) {
    console.log("⏳ ClientLayout - Aguardando carregamento do auth...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ✅ SE NÃO ESTÁ AUTENTICADO, MAS NÃO É PÁGINA DE LOGIN, MOSTRAR LOADING
  // (O middleware vai redirecionar, então só precisamos aguardar)
  if (!isAuthenticated && !isLogin) {
    console.log("⏳ ClientLayout - Não autenticado, aguardando redirecionamento...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  if (isAdmin) {
     console.log("✅ ClientLayout - Retornando layout admin");
    return (
      <div className="p-5 w-full bg-red-100">Admin layout placeholder: {children}</div>
    );
  }

  console.log("✅ ClientLayout - Retornando layout com sidebar");
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-5 w-full md:max-w-[1140px]">{children}</div>
    </div>
  );
}
