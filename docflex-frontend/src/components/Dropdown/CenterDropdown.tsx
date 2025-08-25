// "use client";

// import React, { useEffect, useState } from "react";
// import Select, { SingleValue, StylesConfig } from "react-select";
// import { useAuthStore } from "@/store/authStore";
// import { getMedicalCenterSuggestions } from "@/api/medicalCentersApi";

// interface OptionType {
//   label: string;
//   value: string;
// }

// interface CenterDropdownProps {
//   id: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   width?: string;
//   readOnly?: boolean;
//   disabled?: boolean;
//   label?: boolean;
//   labelName?: string;
//   requiredLabel?: boolean;
// }

// const CenterDropdown: React.FC<CenterDropdownProps> = ({
//   id,
//   value,
//   onChange,
//   placeholder,
//   width = "w-full",
//   readOnly = false,
//   disabled = false,
//   label = false,
//   labelName,
//   requiredLabel = false,
// }) => {
//   const [centerOptions, setCenterOptions] = useState<OptionType[]>([]);
//   const [selectedOption, setSelectedOption] =
//     useState<SingleValue<OptionType>>(null);
//   const [isFocused, setIsFocused] = useState(false);

//   const user = useAuthStore((state) => state.user);
//   const userCenterId = user?.centerId as string | string[] | undefined;

//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const centers = await getMedicalCenterSuggestions();
//         const options: OptionType[] = centers.map((c) => ({
//           label: c.centerName,
//           value: c._id,
//         }));

//         let availableOptions = options;
//         let initialSelection: SingleValue<OptionType> = null;

//         if (userCenterId) {
//           if (typeof userCenterId === "string") {
//             // 🔹 Single center → preselect + restrict options
//             initialSelection =
//               options.find((c) => c.value === userCenterId) || null;
//             availableOptions = initialSelection ? [initialSelection] : options;
//           } else if (Array.isArray(userCenterId)) {
//             if (userCenterId.length === 1) {
//               // 🔹 Exactly one center → preselect + restrict options
//               initialSelection =
//                 options.find((c) => c.value === userCenterId[0]) || null;
//               availableOptions = initialSelection
//                 ? [initialSelection]
//                 : options;
//             } else {
//               // 🔹 Multiple centers → show only allowed ones
//               availableOptions = options.filter((c) =>
//                 userCenterId.includes(c.value)
//               );
//             }
//           }
//         }

//         setCenterOptions(availableOptions);

//         // 🔹 Pre-select user’s centerId if found
//         if (initialSelection) {
//           setSelectedOption(initialSelection);
//           onChange(initialSelection.value); // 🚀 update parent immediately
//         }
//       } catch (err) {
//         console.error("Failed to fetch centers:", err);
//         setCenterOptions([]);
//       }
//     };

//     fetchCenters();
//   }, [userCenterId, onChange]);

//   useEffect(() => {
//     if (value && centerOptions.length) {
//       const selected = centerOptions.find((c) => c.value === value) || null;
//       setSelectedOption(selected);
//     }
//   }, [value, centerOptions]);

//   const handleChange = (newValue: SingleValue<OptionType>) => {
//     setSelectedOption(newValue);
//     onChange(newValue?.value || "");
//   };

//   const customStyles: StylesConfig<OptionType, false> = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
//       minHeight: "2.5rem",
//       borderWidth: "1px",
//       boxShadow: "none",
//       borderRadius: "6px",
//       cursor: readOnly ? "not-allowed" : "pointer",
//       backgroundColor: readOnly ? "#f3f4f6" : provided.backgroundColor,
//     }),
//     menu: (provided) => ({
//       ...provided,
//       display: readOnly ? "none" : provided.display,
//       maxHeight: "250px",
//       overflowY: "auto",
//       zIndex: 9999,
//     }),
//     menuList: (provided) => ({
//       ...provided,
//       maxHeight: "250px",
//       overflowY: "auto",
//     }),
//   };

//   return (
//     <div className={`relative flex items-center ${width}`}>
//       {label && (isFocused || value !== "") && (
//         <label
//           htmlFor={id}
//           className={`absolute left-3 transition-all duration-200 text-xs ${
//             isFocused || value !== ""
//               ? "-top-3 text-blue_light bg-white px-1 font-medium z-[1]"
//               : "top-2 text-gray-400"
//           }`}
//         >
//           {labelName || placeholder}
//           {requiredLabel && <span className="ml-1 text-red-500">*</span>}
//         </label>
//       )}
//       <div className="w-full">
//         <Select<OptionType, false>
//           inputId={id}
//           value={selectedOption}
//           onChange={handleChange}
//           onFocus={readOnly ? undefined : () => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           options={centerOptions}
//           placeholder={placeholder}
//           isDisabled={disabled || readOnly}
//           isClearable={!readOnly}
//           className="text-sm"
//           classNamePrefix="react-select"
//           styles={customStyles}
//         />
//       </div>
//     </div>
//   );
// };

// export default CenterDropdown;


"use client";

import React, { useEffect, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { useAuthStore } from "@/store/authStore";
import { getMedicalCenterSuggestions } from "@/api/medicalCentersApi";

interface OptionType {
  label: string;
  value: string;
}

interface CenterDropdownProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
  readOnly?: boolean;
  disabled?: boolean;
  label?: boolean;
  labelName?: string;
  requiredLabel?: boolean;
}

const CenterDropdown: React.FC<CenterDropdownProps> = ({
  id,
  value,
  onChange,
  placeholder,
  width = "w-full",
  readOnly = false,
  disabled = false,
  label = false,
  labelName,
  requiredLabel = false,
}) => {
  const [centerOptions, setCenterOptions] = useState<OptionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<SingleValue<OptionType>>(null);
  const [isFocused, setIsFocused] = useState(false);

  const user = useAuthStore((state) => state.user);
  const userCenterId = user?.centerId as string | string[] | undefined;

  // 🔹 Fetch centers only once
  useEffect(() => {
    let mounted = true;
    const fetchCenters = async () => {
      try {
        const centers = await getMedicalCenterSuggestions();
        if (!mounted) return;

        let options: OptionType[] = centers.map((c) => ({
          label: c.centerName,
          value: c._id,
        }));

        // Preselect user's center if single
        let initialSelection: SingleValue<OptionType> = null;
        if (userCenterId) {
          if (typeof userCenterId === "string") {
            initialSelection = options.find((c) => c.value === userCenterId) || null;
            options = initialSelection ? [initialSelection] : options;
          } else if (Array.isArray(userCenterId) && userCenterId.length === 1) {
            initialSelection = options.find((c) => c.value === userCenterId[0]) || null;
            options = initialSelection ? [initialSelection] : options;
          }
        }

        setCenterOptions(options);

        // Only preselect once
        if (initialSelection && !value) {
          setSelectedOption(initialSelection);
          onChange(initialSelection.value);
        }
      } catch (err) {
        console.error("Failed to fetch centers:", err);
        setCenterOptions([]);
      }
    };

    fetchCenters();

    return () => {
      mounted = false;
    };
  }, [userCenterId, onChange, value]);

  // Update selected option if parent value changes
  useEffect(() => {
    if (value && centerOptions.length) {
      const selected = centerOptions.find((c) => c.value === value) || null;
      setSelectedOption(selected);
    }
  }, [value, centerOptions]);

  const handleChange = (newValue: SingleValue<OptionType>) => {
    setSelectedOption(newValue);
    onChange(newValue?.value || "");
  };

  const customStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
      minHeight: "2.5rem",
      borderWidth: "1px",
      boxShadow: "none",
      borderRadius: "6px",
      cursor: readOnly ? "not-allowed" : "pointer",
      backgroundColor: readOnly ? "#f3f4f6" : provided.backgroundColor,
    }),
    menu: (provided) => ({
      ...provided,
      display: readOnly ? "none" : provided.display,
      maxHeight: "250px",
      overflowY: "auto",
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "250px",
      overflowY: "auto",
    }),
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
        <Select<OptionType, false>
          inputId={id}
          value={selectedOption}
          onChange={handleChange}
          onFocus={readOnly ? undefined : () => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          options={centerOptions}
          placeholder={placeholder}
          isDisabled={disabled || readOnly}
          isClearable={!readOnly}
          className="text-sm"
          classNamePrefix="react-select"
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default CenterDropdown;
