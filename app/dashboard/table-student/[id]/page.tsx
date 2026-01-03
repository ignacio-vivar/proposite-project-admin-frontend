"use client";

import { useApi } from "@/hooks/useApi";
import {
  getStudentAssignatures,
  getStudentData,
  updateAssignatures,
  updateStudentData,
} from "@/services/studentServices";
import { useCallback } from "react";
import { useEffect } from "react";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useApiParams } from "@/hooks/useApiParams";
import {
  InfoStudent,
  StudentAssignatures,
  StudentData,
  UserUpdate,
} from "@/models";
import { updateUserData } from "@/services/userServices";

type Props = {
  params: Promise<{
    id: number;
  }>;
};

const formSchema = z.object({
  name: z.string().min(1),
  email: z.email({ message: "ingrese un mail valido" }),
  group: z.number(),
  year: z.number(),
  active: z.boolean(),

  subjects: z.object({
    ep: z.boolean(),
    tc: z.boolean(),
    te: z.boolean(),
    cnc: z.boolean(),
  }),
});

const mapAssignaturesToSubjects = (assignatures: Array<{ tag: string }>) => {
  const allSubjects = {
    ep: false,
    tc: false,
    te: false,
    cnc: false,
  };

  const tagMapping: Record<string, keyof typeof allSubjects> = {
    "E.P.": "ep",
    "T.C.": "tc", // Asumiendo que existe
    "T.E": "te", // Asumiendo que existe
    CNC: "cnc",
  };

  assignatures.forEach((assignature) => {
    const subjectKey = tagMapping[assignature.tag];
    if (subjectKey) {
      allSubjects[subjectKey] = true;
    }
  });

  return allSubjects;
};

const assignaturesToArrayId = (subjects: Record<string, boolean>): number[] => {
  return Object.values(subjects)
    .map((value, index) => (value ? index + 1 : null))
    .filter((v) => v != null);
};

type FormData = z.infer<typeof formSchema>;

export default function DataStudent({ params }: Props) {
  const takeParams = React.use(params);
  const { id } = takeParams;

  const requestFn = useCallback(() => getStudentData(id), [id]);
  const requestFn2 = useCallback(() => getStudentAssignatures(id), [id]);
  const { data: userData } = useApi(requestFn, {
    autoFetch: true,
  });
  const { data: userAssignatures } = useApi(requestFn2, { autoFetch: true });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      group: 0,
      year: 0,
      active: false,
      subjects: {
        ep: false,
        tc: false,
        te: false,
        cnc: false,
      },
    },
  });

  useEffect(() => {
    if (userData && userAssignatures) {
      const activeSubjects = userAssignatures.assignatures || [];

      const subjectsData = mapAssignaturesToSubjects(activeSubjects);
      form.reset({
        name: userData.user?.name || "",
        email: userData.user?.email || "",
        group: userData.group || 0,
        year: userData.year || 0,
        active: userData.active || false,
        subjects: subjectsData || {
          ep: false,
          tc: false,
          te: false,
          cnc: false,
        },
      });
    }
  }, [userData, userAssignatures, form]);

  const { fetch: fetchStudent } = useApiParams<
    StudentData,
    { id: number; studentData: InfoStudent }
  >(updateStudentData);

  const { fetch: fetchUser } = useApiParams<
    string,
    { id: number; userData: UserUpdate }
  >(updateUserData);

  const { fetch: fetchAssignatures } = useApiParams<
    StudentAssignatures,
    { id: number; array: number[] }
  >(updateAssignatures);

  function onSubmit(values: FormData) {
    const studentData = values;
    const { subjects, name, email, ...studentValues } = studentData;
    const subjects_array = assignaturesToArrayId(subjects);

    Promise.all([
      fetchStudent({ id: userData.user.id, studentData: studentData }),
      fetchUser({ id: userData.user.id, userData: { name, email } }),
      fetchAssignatures({ id: userData.id, array: subjects_array }),
    ]).then(() => {
      window.location.reload();
    });
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-8"
          >
            <div className="flex flex-row justify-around space-x-8">
              <div className="w-1/2 space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={userData?.user?.name ?? "..."}
                          {...field}
                        />
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
                        <Input
                          placeholder={userData?.user?.email ?? "..."}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Dirección de correo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2 space-y-4">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Activo</FormLabel>
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
                <Separator />
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
                >
                  Asignaturas Activas
                </Badge>

                <FormField
                  control={form.control}
                  name="subjects.cnc"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>CNC</FormLabel>
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

                <FormField
                  control={form.control}
                  name="subjects.ep"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Electrónica de Potencia</FormLabel>
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

                <FormField
                  control={form.control}
                  name="subjects.tc"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Tecnología de Control</FormLabel>
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

                <FormField
                  control={form.control}
                  name="subjects.te"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Tecnología de Energía</FormLabel>
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
              </div>
            </div>
            <div className="flex justify-center">
              <Button className="w-[50%]" type="submit">
                Registrar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
