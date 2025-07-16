"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
// import { useAuth } from "@/context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // const { isAuthenticated, isLoading } = useAuth();

  const isPanelTV = pathname.startsWith("/panelTV");
  const isMyappointments = pathname.startsWith("/emissao-ficha/my-appointments");
  const isAdmin = pathname.startsWith("/admin");
  const isPublic = pathname.startsWith("/public");
  const isLogin = pathname.startsWith("/auth") || pathname === "/";
  const isUnauthorized = pathname === "/unauthorized";
  const isScheduling = pathname.startsWith("/emissao-ficha/scheduling");


  if (isPanelTV || isMyappointments || isLogin || isPublic || isUnauthorized) {
    return <>{children}</>; 
  }
  
  if (isPanelTV || isScheduling || isLogin || isPublic || isUnauthorized) {
    return <>{children}</>; 
  }
  

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated && !isLogin) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }


  if (isAdmin) {
    return (
      <div className="p-5 w-full bg-red-100">Admin layout placeholder: {children}</div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-5 flex-1">{children}</div>
    </div>
  );
}
