"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LOGIN_URL } from "@/config";
import { useAuth } from "@/contexts/useAuth";

type Usuario = {
  username: string;
  password: string;
};

type CustomError = AxiosError | Error | null;

type UseLoginResponse = {
  error: CustomError;
  isLoading: boolean;
  handlePostRequest: (user: Usuario) => void;
};

export default function useLogin(): UseLoginResponse {
  const router = useRouter();
  const { login: login_service } = useAuth();

  const [error, setError] = useState<CustomError>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePostRequest = async (user: Usuario) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", user.username);
      params.append("password", user.password);

      const response = await axios.post(LOGIN_URL, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const receivedToken = response.data;

      localStorage.setItem("token", JSON.stringify(receivedToken));

      login_service(response.data);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error de Axios:", error.response?.data || error.message);
        setError(error);
      } else if (error instanceof Error) {
        console.error("Error general:", error.message);
        setError(error);
      } else {
        console.error("Error desconocido", error);
        setError(new Error("Error desconocido"));
      }
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, handlePostRequest };
}
