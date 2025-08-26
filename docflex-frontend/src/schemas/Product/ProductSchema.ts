import { z } from "zod";

export const ProductSchema = z.object({
  productName: z.string().min(3, "Product Name is required"),
  centerId: z.string().min(1, "Center Name is required"),
  genericId: z.string().min(1, "Generic Name is required"),
  remark: z.string().optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
