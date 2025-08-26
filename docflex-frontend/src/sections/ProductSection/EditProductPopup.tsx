"use client";

import Popup from "@/components/Popups/Popup";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/Product/ProductSchema";
import { toast } from "react-toastify";
import { getProductById, updateProduct } from "@/api/productApi";
import ProductForm from "./ProductForm";

interface EditProductPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

function EditProductPopup({
  isOpen,
  onClose,
  productId,
}: EditProductPopupProps) {
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      centerId: "",
      genericId: "",
      productName: "",
      remark: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const data = await getProductById(productId);
        console.log("Prod", data);

        methods.reset({
          centerId: data.centerId._id || "",
          genericId: data.genericId._id || "",
          productName: data.productName || "",
          remark: data.remark || "",
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details.");
      }
    };

    if (isOpen) fetchProduct();
  }, [productId, isOpen, methods]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct(productId, data);
      toast.success("Product updated successfully!");
      methods.reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to update product:", error);
      toast.error(error.message || "Failed to update product");
    }
  };

  return (
    <Popup
      title="Edit Product"
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
              Update
            </Button>
          </div>
        </form>
      </FormProvider>
    </Popup>
  );
}

export default EditProductPopup;
