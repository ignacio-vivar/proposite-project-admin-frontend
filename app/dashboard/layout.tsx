"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, isAuthenticated, isLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    // Solo redirigir cuando ya no esté cargando Y no esté autenticado
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated]);

  // Mientras está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el redirect está en proceso)
  if (!isAuthenticated) {
    return null;
  }

  // Solo llega aquí si isLoading=false e isAuthenticated=true
  return (
    <div>
      <div className="py-2 px-2 absolute right-0">
        <Button onClick={() => logout()} className="m-2 p-5">
          Salir
        </Button>
      </div>
      <div className="py-2 px-2 absolute left-0">
        <Link href={"/dashboard"}>
          <Button className="m-2 p-5">Dashboard</Button>
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
}
