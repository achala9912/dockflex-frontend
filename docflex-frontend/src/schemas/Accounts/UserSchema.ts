import { z } from "zod";

const doctorRoles = ["Admin Doctor", "Doctor Specialization"];

export const UserSchema = z
  .object({
    centerId: z.string().min(1, "Medical is required"),
    role: z.string().min(1, "Role is required"),
    title: z.string().min(1, "Title is required"),
    name: z.string().min(1, "Name is required"),
    gender: z.string().min(1, "Gender is required"),
    userName: z.string().min(1, "Username is required"),
    slmcNo: z.string().optional(),
    specialization: z.string().optional(),
    email: z.string().email("Invalid email address"),
    contactNo: z.string().min(1, "Contact No is required"),
    password: z.string().min(6, "Default Password is required"),
    remarks: z.string().optional(),
    digitalSignature: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (doctorRoles.includes(data.role)) {
      if (!data.slmcNo || data.slmcNo.trim() === "") {
        ctx.addIssue({
          path: ["slmcNo"],
          message: "SLMC No is required for selected role",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.specialization || data.specialization.trim() === "") {
        ctx.addIssue({
          path: ["specialization"],
          message: "Specialization is required for selected role",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.digitalSignature || data.digitalSignature.trim() === "") {
        ctx.addIssue({
          path: ["digitalSignature"],
          message: "Digital Signature is required for selected role",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type UserFormData = z.infer<typeof UserSchema>;
