"use client";

import Popup from "@/components/Popups/Popup";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  GenericFormData,
  GenericSchema,
} from "@/schemas/Generic/GenericSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import GenericForm from "./GenericForm";
import { createGenericName } from "@/api/genericNameApi";

interface AddNewGenericPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddNewGenericPopup({ isOpen, onClose }: AddNewGenericPopupProps) {
  const methods = useForm<GenericFormData>({
    resolver: zodResolver(GenericSchema),
    defaultValues: {
      centerId: "",
      genericName: "",
    },
  });

  const onSubmit = async (data: GenericFormData) => {
    try {
      await createGenericName(data);
      toast.success("Generic name created successfully!");
      onClose();
      methods.reset();
    } catch (error: any) {
      console.error("Failed to create generic:", error);
    }
  };

  return (
    <Popup
      title="New Generic Name"
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
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </Popup>
  );
}

export default AddNewGenericPopup;
