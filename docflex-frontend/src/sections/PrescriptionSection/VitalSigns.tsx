import React from "react";

interface VitalSignsData {
  weight?: string | number;
  height?: string | number;
  bmi?: string | number;
  pulseRate?: string | number;
}

interface VitalSignsProps {
  vitalSigns: VitalSignsData;
}

interface VitalItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
  iconBg: string;
}

const VitalItem: React.FC<VitalItemProps> = ({
  icon,
  label,
  value,
  bgColor,
  textColor,
  iconBg,
}) => (
  <div className={`${bgColor} p-4 rounded-xl text-center`}>
    <div
      className={`${iconBg} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}
    >
      {icon}
    </div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`font-medium ${textColor}`}>{value}</p>
  </div>
);

const VitalSigns: React.FC<VitalSignsProps> = ({ vitalSigns }) => {
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
            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
            clipRule="evenodd"
          />
        </svg>
        Vital Signs
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vitalSigns.weight && (
          <VitalItem
            icon={
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label="Weight"
            value={vitalSigns.weight}
            bgColor="bg-green-50"
            textColor="text-green-700"
            iconBg="bg-green-100"
          />
        )}
        {vitalSigns.height && (
          <VitalItem
            icon={
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label="Height"
            value={vitalSigns.height}
            bgColor="bg-purple-50"
            textColor="text-purple-700"
            iconBg="bg-purple-100"
          />
        )}
        {vitalSigns.bmi && (
          <VitalItem
            icon={
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label="BMI"
            value={vitalSigns.bmi}
            bgColor="bg-yellow-50"
            textColor="text-yellow-700"
            iconBg="bg-yellow-100"
          />
        )}
        {vitalSigns.pulseRate && (
          <VitalItem
            icon={
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label="Pulse Rate"
            value={vitalSigns.pulseRate}
            bgColor="bg-red-50"
            textColor="text-red-700"
            iconBg="bg-red-100"
          />
        )}
      </div>
    </div>
  );
};

export default VitalSigns;
