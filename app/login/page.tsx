"use client";
import LoginForm from "@/components/Login/login";
import { useAuth } from "@/contexts/useAuth";
import { useEffect } from "react";

export default function Page() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
