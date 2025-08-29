import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSuggestionSelect: (suggestion: string) => void;
  suggestions: string[];
  type?: string;
  width?: string;
  showIcon?: boolean;
  label?: boolean;
  labelName?: string;
  handleClear?: () => void;
  readOnly?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  id,
  value,
  placeholder,
  onChange,
  onSuggestionSelect,
  suggestions,
  type = "text",
  width = "w-full",
  showIcon = true,
  label = false,
  labelName,
  handleClear,
  readOnly = false,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      setFilteredSuggestions(suggestions);
    }
    setIsLoading(false);
  }, [suggestions, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setShowSuggestions(true);
    setActiveIndex(-1);
    setIsLoading(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && activeIndex >= 0 && filteredSuggestions.length > 0) {
      onSuggestionSelect(filteredSuggestions[activeIndex]);
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    } else if (e.key === "ArrowDown" && activeIndex < filteredSuggestions.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (e.key === "ArrowUp" && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };


  const handleClearInput = () => {
    onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setIsLoading(false);
    if (handleClear) handleClear();
  };


  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="font-bold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`relative ${width}`} ref={searchBarRef}>
      {label && (isFocused || value) && (
        <label
          htmlFor={id}
          className={`absolute left-3 transition-all duration-200 text-xs ${
            isFocused || value
              ? "-top-3 text-blue_light bg-white px-1 font-medium z-[1]"
              : "top-2 text-gray-400"
          }`}
        >
          {labelName || placeholder}
        </label>
      )}

      <div
        className={`relative flex items-center h-10 border rounded-md transition-all duration-300 ${
          showSuggestions && value && isLoading
            ? "border-blue-500 animate-pulse"
            : "border-gray-400"
        } focus-within:border-blue-500`}
      >
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="w-full h-full py-2 pl-3 pr-10 text-sm text-black border-none rounded-md focus:outline-none"
          readOnly={readOnly}
        />

        {/* Loading Spinner */}
        {isLoading && value ? (
          <svg
            className="absolute w-5 h-5 text-blue-500 animate-spin right-3"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        ) : (
          <>
            {showIcon && !value && !readOnly && (
              <FiSearch className="absolute text-gray-500 pointer-events-none right-3" />
            )}
            {value && !isLoading && !readOnly && (
              <button className="absolute right-3" onClick={handleClearInput}>
                <FiX className="text-gray-500 hover:text-red-500" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && value && !readOnly && (
        <ul className="absolute z-10 w-full mt-1 overflow-y-auto border rounded-md shadow-lg bg-slate-100 max-h-60 scrollbar-thin scrollbar-thumb-scroll_blue scrollbar-track-transparent">
          {isLoading ? (
            <li className="px-4 py-2 text-sm text-gray-500">Loading...</li>
          ) : filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`px-4 py-2 text-sm cursor-pointer ${
                  index === activeIndex
                    ? "bg-blue-100 "
                    : "hover:bg-blue-100 font-medium text-gray-700"
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {getHighlightedText(suggestion, value)}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-red-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
