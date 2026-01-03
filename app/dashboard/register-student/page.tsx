"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiParams } from "@/hooks/useApiParams";
import { createStudentData, registerUser } from "@/services/studentServices";
import {
  InfoStudent,
  StudentAssignatures,
  StudentData,
  UserData,
} from "@/models";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { initAssignaturesData } from "@/services/assignatureServices";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
    confirmPassword: z.string().min(2).max(50),
    student: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "La contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function RegisterStudent() {
  type FormData = z.infer<typeof formSchema>;
  const [isStudent, setIsStudent] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      student: false,
    },
  });

  type UserRegisterForm = Omit<FormData, "student" | "confirmPassword">;

  const {
    error: registerError,
    fetch: fetchUserRegister,
    data: userData,
  } = useApiParams<UserData, UserRegisterForm>(registerUser);

  const { fetch: fetchStudent, data: addStudentData } = useApiParams<
    StudentData,
    { id: number; studentData: InfoStudent }
  >(createStudentData);

  const { fetch: fetchInitAssignatures } = useApiParams<
    StudentAssignatures,
    { std_id: number }
  >(initAssignaturesData);

  function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const { student, confirmPassword, ...registerData } = values;
      fetchUserRegister(registerData);
      setIsStudent(student);
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    if (userData && isStudent) {
      fetchStudent({
        id: userData.id,
        studentData: { group: 0, year: 0, active: false },
      });
    }
  }, [userData]);

  useEffect(() => {
    if (addStudentData && addStudentData.id) {
      // console.log(addStudentData);
      fetchInitAssignatures({ std_id: addStudentData.id });
      toast.success("Registro completado con exito");
      form.reset();
      setIsLoading(false);
    }
  }, [addStudentData]);

  useEffect(() => {
    if (registerError) {
      toast.error("Usuario ya registrado");
      setIsLoading(false);
    }
  }, [registerError]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-[50vw] max-w-[80vw]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col  w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Perez" {...field} />
                  </FormControl>
                  <FormDescription>Nombre del alumno</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="juan@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>Dirección de correo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="repetir contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="student"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>¿ Corresponde a un estudiante ?</FormLabel>
                    <FormDescription>Conmutar estado</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button className="w-[50%]" type="submit">
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
