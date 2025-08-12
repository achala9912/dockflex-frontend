import { z } from "zod";

export const UserSchema = z.object({
  role: z.string().min(1, "Role is required"),
  title: z.string().min(1, "Title is required"),
  name: z.string().min(1, "Name is required"),
  gender: z.string().min(1, "Gender is required"),
  userName: z.string().min(1, "Username is required"),
  slmcNo: z.string().min(1, "SLMC No is required"),
  specialization: z.string().min(1, "Specialization is required"),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(1, "Contact No is required"),
});

export type UserFormData = z.infer<typeof UserSchema>;
