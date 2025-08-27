import React from "react";

interface Medication {
  productName: string;
  genericName?: string;
  route?: string;
  dose?: string;
  frequency?: string;
  duration?: string;
  note?: string;
}

interface MedicationsProps {
  medications: Medication[];
}

const Medications: React.FC<MedicationsProps> = ({ medications }) => {
  if (!medications || medications.length === 0) {
    return null; 
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
            clipRule="evenodd"
          />
        </svg>
        Medications
      </h2>

      <div className="space-y-4">
        {medications.map((med, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-xl p-5 bg-gradient-to-r from-blue-50 to-teal-50"
          >
            {/* Title & Route */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-blue-700">
                {med.productName}
              </h3>
              {med.route && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {med.route}
                </span>
              )}
            </div>

            {med.genericName && (
              <p className="text-sm text-gray-600 mb-3">{med.genericName}</p>
            )}

            {/* Dose, Frequency, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {med.dose && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500">Dosage</p>
                  <p className="font-medium">{med.dose}</p>
                </div>
              )}
              {med.frequency && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500">Frequency</p>
                  <p className="font-medium">{med.frequency}</p>
                </div>
              )}
              {med.duration && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{med.duration}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            {med.note && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-500">Note</p>
                <p className="text-sm font-medium">{med.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Medications;
