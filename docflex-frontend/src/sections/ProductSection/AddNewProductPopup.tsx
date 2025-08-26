"use client";

import Popup from "@/components/Popups/Popup";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/Product/ProductSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";
import { createProduct } from "@/api/productApi";

interface AddNewProductPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddNewProductPopup({ isOpen, onClose }: AddNewProductPopupProps) {
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      centerId: "",
      genericId: "",
      productName: "",
      remark: "",
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await createProduct(data);
      toast.success("Product created successfully!");
      methods.reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <Popup
      title="New Product"
      isOpen={isOpen}
      onClose={() => {
        methods.reset();
        onClose();
      }}
      headerClassName="bg-blue-600"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ProductForm />

          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="default"
              size="default"
              onClick={() => {
                methods.reset();
                onClose();
              }}
              className="px-6 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="default"
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
            >
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </Popup>
  );
}

export default AddNewProductPopup;
