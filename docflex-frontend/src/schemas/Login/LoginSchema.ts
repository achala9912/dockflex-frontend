import { z } from "zod";

export const LoginSchema = z.object({
  userName: z.string().min(1, "User Name is required."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
