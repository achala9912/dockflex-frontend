"use client";

import Popup from "@/components/Popups/Popup";
import { Button } from "@/components/ui/button";
import React from "react";
import SessionForm from "./SessionForm";
import {
  SessionFormData,
  SessionSchema,
} from "@/schemas/Sessions/SessionSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSession } from "@/api/sessionsApi";
import { toast } from "react-toastify";

interface AddNewSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddNewSessionPopup({ isOpen, onClose }: AddNewSessionPopupProps) {
  const methods = useForm<SessionFormData>({
    resolver: zodResolver(SessionSchema),
    defaultValues: {
      centerId: "",
      sessionName: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (data: SessionFormData) => {
    try {
      const today = new Date().toISOString().split("T")[0]; 

      const payload = {
        ...data,
        startTime: new Date(`${today}T${data.startTime}`).toISOString(),
        endTime: new Date(`${today}T${data.endTime}`).toISOString(),
      };

      await createSession(payload);
      toast.success("Session created successfully!");
      onClose();
      methods.reset();
    } catch (error: any) {
      console.error("Failed to create session:", error);
      toast.error(error.message || "Failed to create session");
    }
  };

  return (
    <Popup
      title="Add New Session"
      isOpen={isOpen}
      onClose={onClose}
      headerClassName="bg-blue-600"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <SessionForm />

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

export default AddNewSessionPopup;
