import * as z from "zod";

export const ForgotPasswordSchema = z.object({
    userName: z.string().min(1, "User Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
