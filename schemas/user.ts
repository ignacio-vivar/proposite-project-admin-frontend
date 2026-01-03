import { z } from "zod";

export const userSchema = z.object({
  username: z.email({ message: "Debe ser un email válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type userForm = z.infer<typeof userSchema>;
