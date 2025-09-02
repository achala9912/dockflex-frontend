import { z } from "zod";

export const GenericSchema = z.object({
  genericName: z.string().min(3, "Generic Name is required"),
  centerId: z.string().min(1, "Center Name is required"),
});

export type GenericFormData = z.infer<typeof GenericSchema>;
