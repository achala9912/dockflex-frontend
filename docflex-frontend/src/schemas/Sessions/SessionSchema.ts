import { z } from "zod";

export const SessionSchema = z
  .object({
    sessionName: z
      .string()
      .min(3, "Session name must be at least 3 characters"),
    centerId: z.string().min(1, "Center Name is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    isSessionActive: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        path: ["endTime"],
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
      });
    }
  });

export type SessionFormData = z.infer<typeof SessionSchema>;
