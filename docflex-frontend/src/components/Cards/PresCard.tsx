"use client";

import { PiGenderFemale, PiGenderMale, PiBaby } from "react-icons/pi";
import { PiArticleMedium } from "react-icons/pi";
import React from "react";

interface PresCardProps {
  appointmentId: string;
  patientName?: string;
  tokenNo?: number;
  age?: number;
  gender?: string;
  title?: string;
  handleGenerate: () => void;
}

const PresCard: React.FC<PresCardProps> = ({
  appointmentId,
  patientName,
  tokenNo,
  age,
  gender,
  title,
  handleGenerate,
}) => {
  // Determine icon based on age & gender
  const getIcon = () => {
    if (!age || !gender) return PiGenderMale; // default
    if (age <= 5) return PiBaby;
    return gender.toLowerCase() === "male" ? PiGenderMale : PiGenderFemale;
  };

  const MainIcon = getIcon();

  return (
    <div className="bg-white rounded-2xl shadow-lg w-72 flex flex-col items-center">
      <div className="p-4 w-full">
        <p className="text-gray-600 text-xs font-semibold text-left">
          {appointmentId}
        </p>

        <div className="mt-3 flex justify-center">
          <MainIcon size={56} className="text-gray-600" />
        </div>

        <h2 className="text-blue-600 text-md font-semibold mt-2 text-center font-inter">
          {title ? `${title} ${patientName}` : patientName}
        </h2>

        <div className="mt-2 flex flex-col items-center">
          <p className="text-gray-600 text-sm">{age} years</p>
          <p className="text-gray-600 text-sm">{gender}</p>
        </div>

        <div className="mt-2 flex flex-col items-center">
          <p className="w-8 h-8 bg-blue-400 text-white font-semibold rounded-full flex items-center justify-center mx-auto">
            {tokenNo}
          </p>
        </div>
      </div>

      <div className="bg-gray-600 w-full h-12 mt-2 rounded-b-2xl flex justify-center items-center gap-4 py-2">
        <button
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          onClick={handleGenerate}
        >
          <PiArticleMedium size={18} className="text-blue-500" />
        </button>
      </div>
    </div>
  );
};

export default PresCard;
