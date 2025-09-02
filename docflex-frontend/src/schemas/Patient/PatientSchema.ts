import { z } from "zod";
import { differenceInYears, parseISO } from "date-fns"; 

export const PatientSchema = z
  .object({
    centerId: z.string().min(1, "Medical Center is required"),
    title: z.string().min(1, "Title is required"),
    patientName: z.string().min(1, "Name is required"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of Birth is required"), // expecting YYYY-MM-DD string
    email: z.string().email("Invalid email address"),
    contactNo: z.string().min(1, "Contact No is required"),
    nic: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    remark: z.string().optional(),
  })
  .refine(
    (data) => {
      const age = differenceInYears(new Date(), parseISO(data.dob));
      if (age >= 18) {
        return !!data.nic && data.nic.trim().length > 0;
      }
      return true;
    },
    {
      message: "NIC is required for patients 18 years or older",
      path: ["nic"], // error will appear on NIC field
    }
  );

export type PatientFormData = z.infer<typeof PatientSchema>;
