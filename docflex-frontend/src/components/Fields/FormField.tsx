"use client";

interface FormFieldProps {
  label: string;
  subLabelText?: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
  labelClassName?: string;
  childClassName?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  subLabelText,
  children,
  error,
  className = "",
  labelClassName = "",
  childClassName = "",
}) => {
  return (
    <div className={className}>
      <div className={childClassName}>
        <label
          className={`block mb-1 text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
        {subLabelText && (
          <label className="block mb-4 text-sm font-normal text-gray-400">
            {subLabelText}
          </label>
        )}
        {children}
      </div>
      <div className="flex justify-between mt-1">
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default FormField;
