"use client";
import { User, UserCheck, Baby, FileText } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

interface PresCardProps {
  appointmentId: string;
  patientName?: string;
  tokenNo?: number;
  age?: number;
  gender?: string;
  title?: string;
}

const PresCard: React.FC<PresCardProps> = ({
  appointmentId,
  patientName,
  tokenNo,
  age,
  gender,
  title,
}) => {
  const router = useRouter();

  const getIcon = () => {
    if (!age || !gender) return User;
    if (age <= 5) return Baby;
    return gender.toLowerCase() === "male" ? User : UserCheck;
  };

  const MainIcon = getIcon();

  const getGenderTheme = () => {
    if (age && age <= 5)
      return "bg-yellow-100 text-yellow-600 border-yellow-200";
    if (gender?.toLowerCase() === "male")
      return "bg-blue-100 text-blue-600 border-blue-200";
    return "bg-pink-100 text-pink-600 border-pink-200";
  };

  const handleGenerate = () => {
    router.push(`/prescription/generate/new/${appointmentId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-80 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue_sp px-6 py-4">
        <p className="text-white/80 text-xs font-medium tracking-wider uppercase">
          ID: {appointmentId}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getGenderTheme()}`}
          >
            <MainIcon size={24} />
          </div>
          {tokenNo !== undefined && (
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-bold text-lg"># {tokenNo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="text-center mb-4">
          <h2 className="text-gray-800 text-lg font-bold leading-tight">
            {title && patientName ? `${title} ${patientName}` : patientName}
          </h2>
        </div>
        <div className="flex justify-center gap-6 mb-6">
          {age !== undefined && (
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Age
              </p>
              <p className="text-gray-800 text-base font-semibold">{age}</p>
            </div>
          )}
          {age !== undefined && gender && <div className="w-px bg-gray-200"></div>}
          {gender && (
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Gender
              </p>
              <p className="text-gray-800 text-base font-semibold">{gender}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="px-6 pb-6">
        <button
          className="w-full text-base bg-gradient-to-r from-blue-500 to-blue_sp text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
          onClick={handleGenerate}
        >
          <FileText size={18} />
          Generate Prescription
        </button>
      </div>
    </div>
  );
};

export default PresCard;
