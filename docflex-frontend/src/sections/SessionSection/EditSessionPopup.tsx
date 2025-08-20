"use client";

import Popup from "@/components/Popups/Popup";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import SessionForm from "./SessionForm";
import {
  SessionFormData,
  SessionSchema,
} from "@/schemas/Sessions/SessionSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSessionById, updateSession } from "@/api/sessionsApi";
import { toast } from "react-toastify";

interface EditSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

function EditSessionPopup({
  isOpen,
  onClose,
  sessionId,
}: EditSessionPopupProps) {
  const methods = useForm<SessionFormData>({
    resolver: zodResolver(SessionSchema),
    defaultValues: {
      centerId: "",
      sessionName: "",
      startTime: "",
      endTime: "",
    },
  });
  function extractLocalTimeHHMM(isoTime?: string): string {
    if (!isoTime) return "";
    const date = new Date(isoTime);
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const data = await getSessionById(sessionId);
        if (!data) {
          toast.error("Session data not found");
          return;
        }

        methods.reset({
          centerId: data.centerId?._id || "",
          sessionName: data.sessionName || "",
          startTime: extractLocalTimeHHMM(data.startTime),
          endTime: extractLocalTimeHHMM(data.endTime),
        });
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toast.error("Failed to load session details.");
      }
    };
    if (isOpen) fetchSession();
  }, [sessionId, methods, isOpen]);

  const onSubmit = async (data: SessionFormData) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const payload = {
        ...data,
        startTime: new Date(`${today}T${data.startTime}`).toISOString(),
        endTime: new Date(`${today}T${data.endTime}`).toISOString(),
      };

      await updateSession(sessionId, payload);
      toast.success("Session updated successfully!");
      onClose();
      methods.reset();
    } catch (error: any) {
      console.error("Failed to update session:", error);
      toast.error(error.message || "Failed to update session");
    }
  };

  return (
    <Popup
      title="Edit Session"
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
              Update
            </Button>
          </div>
        </form>
      </FormProvider>
    </Popup>
  );
}

export default EditSessionPopup;
