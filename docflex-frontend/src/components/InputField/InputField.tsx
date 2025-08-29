// "use client";

// import React, { useState, forwardRef } from "react";

// interface InputFieldProps {
//   id: string;
//   type: string;
//   value?: string | number;
//   placeholder?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
//   onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
//   onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
//   icon?: React.ReactNode;
//   width?: string;
//   ariaLabel?: string;
//   className?: string;
//   label?: boolean;
//   labelName?: string;
//   uppercase?: boolean;
//   capitalize?: boolean;
//   disabled?: boolean;
//   readOnly?: boolean;
// }

// const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
//   (
//     {
//       id,
//       type,
//       value,
//       placeholder,
//       onChange,
//       onKeyDown,
//       className = "",
//       icon,
//       width = "w-full",
//       ariaLabel,
//       label = false,
//       labelName,
//       uppercase = false,
//       capitalize = false,
//       disabled = false,
//       readOnly = false,
//       ...rest
//     },
//     ref
//   ) => {
//     const [isFocused, setIsFocused] = useState(false);

//     const handleFocus = () => setIsFocused(true);
//     const handleBlur = () => setIsFocused(false);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       if (type === "number" && Number(e.target.value) < 0) {
//         return;
//       }
//       onChange?.(e);
//     };

//     return (
//       <div className="relative flex flex-col items-start">
//         {label && (isFocused || value !== "") && (
//           <label
//             htmlFor={id}
//             className={`absolute left-3 transition-all duration-200 text-xs ${
//               isFocused || value !== ""
//                 ? "-top-3 text-blue_light bg-white px-1 font-medium z-[1]"
//                 : "top-2 text-gray-400"
//             }`}
//           >
//             {labelName || placeholder}
//           </label>
//         )}

//         <div className="relative flex items-center w-full ">
//           <input
//             id={id}
//             type={type}
//             value={value}
//             onChange={handleInputChange}
//             onKeyDown={onKeyDown}
//             placeholder={placeholder}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//             ref={ref}
//             disabled={disabled}
//             readOnly={readOnly}
//             className={`block ${width} h-10 py-2 px-2 text-sm text-black border rounded-md border-gray-400 focus:outline-none focus:ring-gray-700 focus:border-blue-500 ${
//               uppercase ? "uppercase" : ""
//             } ${
//               disabled ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
//             } ${readOnly ? " text-black" : ""} ${className}`}
//             style={{
//               textTransform: uppercase
//                 ? "uppercase"
//                 : capitalize
//                 ? "capitalize"
//                 : "none",
//               appearance: "none",
//             }}
//             aria-label={ariaLabel || placeholder}
//             {...rest}
//           />
//           {icon && (
//             <span className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer pointer-events-none right-3">
//               {icon}
//             </span>
//           )}
//         </div>
//       </div>
//     );
//   }
// );

// InputField.displayName = "InputField";

// export default InputField;

"use client";

import React, { useState, forwardRef } from "react";

interface InputFieldProps {
  id: string;
  type: string;
  value?: string | number;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  width?: string;
  ariaLabel?: string;
  className?: string;
  label?: boolean;
  labelName?: string;
  uppercase?: boolean;
  capitalize?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showAlwaysLabel?: boolean; // <-- new prop
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      type,
      value,
      placeholder,
      onChange,
      onKeyDown,
      className = "",
      icon,
      width = "w-full",
      ariaLabel,
      label = false,
      labelName,
      uppercase = false,
      capitalize = false,
      disabled = false,
      readOnly = false,
      showAlwaysLabel = false, // <-- default false
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number" && Number(e.target.value) < 0) {
        return;
      }
      onChange?.(e);
    };

    const shouldShowLabel = showAlwaysLabel || isFocused || value !== "";

    return (
      <div className="relative flex flex-col items-start">
        {label && shouldShowLabel && (
          <label
            htmlFor={id}
            className={`absolute left-3 transition-all duration-200 text-xs ${
              shouldShowLabel
                ? "-top-3 text-blue_light bg-white px-1 font-medium z-[1]"
                : "top-2 text-gray-400"
            }`}
          >
            {labelName || placeholder}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <input
            id={id}
            type={type}
            value={value}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            className={`block ${width} h-10 py-2 px-2 text-sm text-black border rounded-md border-gray-400 focus:outline-none focus:ring-gray-700 focus:border-blue-500 ${
              uppercase ? "uppercase" : ""
            } ${
              disabled ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
            } ${readOnly ? " text-black" : ""} ${className}`}
            style={{
              textTransform: uppercase
                ? "uppercase"
                : capitalize
                ? "capitalize"
                : "none",
              appearance: "none",
            }}
            aria-label={ariaLabel || placeholder}
            {...rest}
          />
          {icon && (
            <span className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer pointer-events-none right-3">
              {icon}
            </span>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
