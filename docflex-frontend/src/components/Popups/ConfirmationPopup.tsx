"use client";

import React from "react";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import alertLottie from "@/Lottie/alertLottie.json";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface CancelConfirmationProps {
  element?: string;
  handleYes: () => void;
  handleNo: () => void;
  isOpen: boolean;
  yesButtonColor?: string;
  yesButtonText?: string;
}

const ConfirmationPopup: React.FC<CancelConfirmationProps> = ({
  element,
  handleNo,
  handleYes,
  isOpen,
  yesButtonColor = "red", // Default button color
  yesButtonText = "Yes, I want", // Default button text
}) => {
  if (!isOpen) return null;

  // Define styles for button colors
  const buttonColors: { [key: string]: string } = {
    red: "flex-1 px-4 py-2 text-white bg-red-600 border rounded-lg shadow-sm hover:bg-red-700",
    blue: "flex-1 px-4 py-2 text-white bg-blue-600 border rounded-lg shadow-sm hover:bg-blue-700",
    green: "flex-1 px-4 py-2 text-white bg-green-500 border rounded-lg shadow-sm hover:bg-green-700",
    gray: "flex-1 px-4 py-2 text-white bg-gray-500 border rounded-lg shadow-sm hover:bg-gray-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-xl">
        {/* Lottie Animation */}
        <div className="flex justify-center mb-4">
          <Lottie
            animationData={alertLottie}
            loop
            autoplay
            className="w-36 h-36"
          />
        </div>

        {/* Confirmation Message */}
        <h4 className="mb-6 -mt-6 text-lg font-semibold text-center text-gray-800">
          Are you sure you want to {element || "cancel"}?
        </h4>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleNo}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 border rounded-lg hover:bg-gray-200"
          >
            No
          </Button>
          <Button
            onClick={handleYes}
            className={buttonColors[yesButtonColor] || buttonColors.red}
          >
            {yesButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
