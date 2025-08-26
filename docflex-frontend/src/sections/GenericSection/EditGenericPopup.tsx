"use client";

import Popup from "@/components/Popups/Popup";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GenericFormData,
  GenericSchema,
} from "@/schemas/Generic/GenericSchema";
import { toast } from "react-toastify";
import GenericForm from "./GenericForm";
import { getGenericNameById, updateGenericName } from "@/api/genericNameApi";

interface EditGenericPopupProps {
  isOpen: boolean;
  onClose: () => void;
  genericId: string;
}

function EditGenericPopup({
  isOpen,
  onClose,
  genericId,
}: EditGenericPopupProps) {
  const methods = useForm<GenericFormData>({
    resolver: zodResolver(GenericSchema),
    defaultValues: {
      centerId: "",
      genericName: "",
    },
  });

  useEffect(() => {
    const fetchGeneric = async () => {
      if (!genericId) return;
      try {
        const data = await getGenericNameById(genericId);
        methods.reset({
          centerId: data.centerId._id ?? "",
          genericName: data.genericName ?? "",
        });
      } catch (error) {
        console.error("Failed to fetch Generic:", error);
        toast.error("Failed to load Generic details.");
      }
    };

    if (isOpen) fetchGeneric();
  }, [genericId, isOpen, methods]);

  const onSubmit = async (data: GenericFormData) => {
    try {
      await updateGenericName(genericId, data);
      toast.success("Generic name updated successfully!");
      onClose();
      methods.reset();
    } catch (error: any) {
      console.error("Failed to update generic:", error);
      toast.error(error.message || "Failed to update generic");
    }
  };

  return (
    <Popup
      title="Edit Generic Name"
      isOpen={isOpen}
      onClose={onClose}
      headerClassName="bg-blue-600"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <GenericForm />

          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-white transition bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="default"
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
            >
              Update
            </Button>
          </div>
        </form>
      </FormProvider>
    </Popup>
  );
}

export default EditGenericPopup;
