import { z } from "zod";

export const MyProfileSchema = z
  .object({
    title: z.string().optional(),
    name: z.string().optional(),
    gender: z.string().optional(),
    profilePicture: z.string().optional(),
    slmcNo: z.string().optional(),
    specialization: z.string().optional(),
    email: z.string().email().optional(),
    digitalSignature: z.string().optional(),
    contactNo: z.string().optional(),
    remarks: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword) {
      // If changing password, only validate password fields
      if (!data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Confirm password is required",
          code: z.ZodIssueCode.custom,
        });
      } else if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Passwords do not match",
          code: z.ZodIssueCode.custom,
        });
      }
    } else {
      // If NOT changing password, enforce required profile fields
      if (!data.name) {
        ctx.addIssue({
          path: ["name"],
          message: "Name is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.gender) {
        ctx.addIssue({
          path: ["gender"],
          message: "Gender is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.email) {
        ctx.addIssue({
          path: ["email"],
          message: "Email is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.contactNo) {
        ctx.addIssue({
          path: ["contactNo"],
          message: "Contact number is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (data?.contactNo && !/^\d{10}$/.test(data.contactNo)) {
        ctx.addIssue({
          path: ["contactNo"],
          message: "Contact number must be exactly 10 digits",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type FormData = z.infer<typeof MyProfileSchema>;
