import React from "react";

interface ClinicalDetailsProps {
  clinicalDetails?: string;
}

const ClinicalDetails: React.FC<ClinicalDetailsProps> = ({
  clinicalDetails,
}) => {
  if (!clinicalDetails) return null; // don’t render if no details provided

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        Clinical Details
      </h2>
      <div className="bg-blue-50 p-4 rounded-xl">
        <p className="text-gray-700 whitespace-pre-line">{clinicalDetails}</p>
      </div>
    </div>
  );
};

export default ClinicalDetails;
