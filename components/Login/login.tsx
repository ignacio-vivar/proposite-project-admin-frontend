"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userForm, userSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useLogin from "@/hooks/useLogin";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userForm>({ resolver: zodResolver(userSchema) });

  const { handlePostRequest, error } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: userForm) => {
    handlePostRequest(data);
  };
  return (
    <div className="flex flex-col gap-6 main-app-style">
      <Card className="overflow-hidden">
        <CardContent className="grid md:grid-cols-1">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido Profesor</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="email"
                  placeholder="m@example.com"
                />

                {errors?.username?.message && (
                  <p className="text-red-400">{errors?.username?.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full pr-10"
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                {errors?.password?.message && (
                  <p className="text-red-400">{errors?.password?.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
              {error ? (
                <div className="text-center text-bold text-red-500">
                  Usuario o Contraseña Inválidos
                </div>
              ) : (
                ""
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
