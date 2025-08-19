"use client";

import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";

interface PopupProps {
  title: string;
  headerClassName?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Popup({
  title,
  headerClassName,
  isOpen,
  onClose,
  children,
}: PopupProps) {
  return (
    <Dialog 
      open={isOpen} 
      onClose={() => {}} 
      className="relative z-50"
      static 
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      {/* Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b bg-blue-600 ${headerClassName}`}
          >
            <DialogTitle className="text-base font-medium text-white">
              {title}
            </DialogTitle>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-white hover:text-red-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}