"use client"; // Ensure this is at the top

import React, { useState, forwardRef } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

interface PasswordFieldProps {
  id: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  className?: string;
  label?: boolean;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, value, placeholder, onChange, className = "", ariaLabel, label = false, ...rest }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <div className="relative flex flex-col items-start w-full">
        {label && <label htmlFor={id} className="absolute left-3 transition-all duration-200 text-sm">{placeholder}</label>}
        <div className="relative flex items-center w-full">
          <input
            id={id}
            type={isPasswordVisible ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref}
            className={`block w-full h-10 py-2 px-2 text-sm text-black border rounded-md border-gray-400 focus:outline-none focus:ring-gray-700 focus:border-blue-500 ${className}`}
            aria-label={ariaLabel || placeholder}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {isPasswordVisible ? <GoEye /> : <GoEyeClosed />}
          </button>
        </div>
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
export default PasswordField;
