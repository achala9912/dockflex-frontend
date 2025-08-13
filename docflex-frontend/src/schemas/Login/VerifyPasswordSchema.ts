import { z } from "zod";

export const VerifyPasswordSchema = z.object({
  userName: z.string().min(1, "User Name is required."),
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits.")
    .regex(/^\d{4}$/, "OTP must contain only numbers."),
  newPassword: z.string().min(6, "New Password must be at least 6 characters."),
});

export type VerifyPasswordData = z.infer<typeof VerifyPasswordSchema>;
