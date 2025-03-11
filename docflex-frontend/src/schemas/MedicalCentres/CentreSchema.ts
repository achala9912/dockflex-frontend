import * as z from "zod";

export const CentreSchema = z.object({
  centreName: z.string().min(1, "Medical Centre Name is required"),
  regNo: z.string().min(1, "Reg No is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  contactNo: z
    .string()
    .min(10, "Contact No must be at least 10 digits")
    .max(15, "Contact No cannot exceed 15 digits"),
  email: z.string().email("Invalid email format"),
  image: z.array(z.object({ url: z.string().url() })).optional(),
});

export type CentreFormData = z.infer<typeof CentreSchema>;
