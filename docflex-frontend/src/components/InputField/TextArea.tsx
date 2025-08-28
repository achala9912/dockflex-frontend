"use client";

import React, { useState, forwardRef } from "react";

interface TextAreaProps {
  id: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  width?: string;
  ariaLabel?: string;
  className?: string;
  label?: boolean;
  labelName?: string;
  uppercase?: boolean;
  capitalize?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      value = "",
      placeholder,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      className = "",
      width = "w-full",
      ariaLabel,
      label = false,
      labelName,
      uppercase = false,
      capitalize = false,
      disabled = false,
      readOnly = false,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="relative flex flex-col items-start">
        {label && (isFocused || value !== "") && (
          <label
            htmlFor={id}
            className={`absolute left-3 transition-all duration-200 text-xs ${
              isFocused || value !== ""
                ? "-top-3 text-blue_light bg-white px-1 font-medium z-[1]"
                : "top-2 text-gray-400"
            }`}
          >
            {labelName || placeholder}
          </label>
        )}

        <textarea
          id={id}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          className={`block ${width} py-2 px-2 text-sm text-black border rounded-md border-gray-400 focus:outline-none focus:ring-gray-700 focus:border-blue-500 resize-none ${
            uppercase ? "uppercase" : ""
          } ${disabled ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""} ${
            readOnly ? " text-black" : ""
          } ${className}`}
          style={{
            textTransform: uppercase
              ? "uppercase"
              : capitalize
              ? "capitalize"
              : "none",
          }}
          aria-label={ariaLabel || placeholder}
          {...rest}
        />
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
