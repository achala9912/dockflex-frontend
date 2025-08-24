import { z } from "zod";

export const AppointmentSchema = z.object({
  centerId: z.string().min(1, "Medical Center is required"),
  contactNo: z.string().min(1, "Contact No is required"),
  date: z.string().min(1, "Date is required"),
  sessionId: z.string().min(1, "Session is required"),
  patientId: z.string().min(1, "Patient Name is required"),
  remarks: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
});

export type AppointmentFormData = z.infer<typeof AppointmentSchema>;
