"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPanelTV = pathname.startsWith("/emissao-ficha/scheduling");
  const isMyappointments = pathname.startsWith("/emissao-ficha/my-appointments");
  const isAdmin = pathname.startsWith("/admin");
  const isPublic = pathname.startsWith("/public");

  if (isPanelTV || isPublic) {
    return <>{children}</>; 
  }

  if (isMyappointments || isPublic) {
    return <>{children}</>; 
  }


  if (isAdmin) {
    
    return (
      <div className="p-5 w-full bg-red-100">Admin layout placeholder: {children}</div>
    );
  }


  return (
    <div className="flex">
      <Sidebar />
      <div className="p-5 w-full md:max-w-[1140px]">{children}</div>
    </div>
  );
}
