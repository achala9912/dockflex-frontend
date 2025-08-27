import React from "react";

interface VisitInfoProps {
  reasonForVisit?: string;
  appointmentId?: string;
  symptoms?: string[];
}

const VisitInfo: React.FC<VisitInfoProps> = ({
  reasonForVisit,
  appointmentId,
  symptoms = [],
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Visit Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Reason for Visit</p>
          <p className="font-medium text-gray-800">
            {reasonForVisit || "Not provided"}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Appointment ID</p>
          <p className="font-medium text-gray-800">
            {appointmentId || "Not provided"}
          </p>
        </div>

        <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Symptoms</p>
          {symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {symptom}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-800 font-medium mt-1">No symptoms listed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitInfo;
