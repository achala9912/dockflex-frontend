"use client";

import React, { useState } from "react";
import Select, { MultiValue, SingleValue, StylesConfig } from "react-select";

interface OptionType {
  label: string;
  value: string;
}

interface MultiDropdownProps {
  id: string;
  value: string | string[];
  options: string[] | OptionType[];
  placeholder?: string;
  onChange: (value: string | string[]) => void;
  width?: string;
  ariaLabel?: string;
  label?: boolean;
  labelName?: string;
  disabled?: boolean;
  multiple?: boolean;
  requiredLabel?: boolean;
  readOnly?: boolean;
}

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  id,
  value,
  options,
  placeholder,
  onChange,
  width = "w-full",
  ariaLabel,
  label = false,
  labelName,
  disabled = false,
  multiple = false,
  requiredLabel = false,
  readOnly = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const selectOptions =
    typeof options[0] === "string"
      ? (options as string[]).map((option) => ({
          value: option,
          label: option,
        }))
      : (options as OptionType[]);

  const selectedOptions = Array.isArray(value)
    ? selectOptions.filter((option) => value.includes(option.value))
    : selectOptions.find((option) => option.value === value) || null;

  const customStyles: StylesConfig<OptionType, boolean> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
      outline: state.isFocused ? "none" : undefined,
      minHeight: "2.5rem",
      borderWidth: "1px",
      boxShadow: "none",
      borderRadius: "6px",
      cursor: readOnly ? "not-allowed" : "pointer",
      backgroundColor: readOnly ? "#f3f4f6" : provided.backgroundColor,
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
      },
    }),
    menu: (provided) => ({
      ...provided,
      display: readOnly ? "none" : provided.display,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "250px",
      overflowY: "auto", 
    }),
  };

  const handleChange = (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>
  ) => {
    if (readOnly) return;
    if (multiple) {
      onChange(
        (newValue as MultiValue<OptionType>).map((option) => option.value)
      );
    } else {
      onChange((newValue as SingleValue<OptionType>)?.value || "");
    }
  };

  return (
    <div className={`relative flex items-center ${width}`}>
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
          {requiredLabel && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="w-full">
        <Select<OptionType, boolean>
          inputId={id}
          value={selectedOptions}
          onChange={handleChange}
          onFocus={readOnly ? undefined : handleFocus}
          onBlur={handleBlur}
          options={selectOptions}
          placeholder={placeholder}
          isDisabled={disabled || readOnly}
          isClearable={!readOnly}
          isMulti={multiple}
          className="text-sm"
          classNamePrefix="react-select"
          aria-label={ariaLabel || placeholder}
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default MultiDropdown;
