import * as z from "zod";

export const FirstLoginSchema = z
  .object({
    userName: z.string().min(1, "User Name is required"),
    newPassword: z
      .string()
      .min(6, "New Password must be at least 6 characters."),
    confirmNewPassword: z
      .string()
      .min(6, "Please enter new password again to confirm"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type FirstLoginFormData = z.infer<typeof FirstLoginSchema>;
