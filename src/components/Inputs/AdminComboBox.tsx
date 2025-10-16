import React, { useRef, useState, useEffect } from "react";
import ExpandDownLight from "../Icons/ExpandDownLight";
import CloseRoundLight from "../Icons/CloseRoundLight";

type DropdownOption = {
  value: string;
  label: string;
};

type AdminComboBoxProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: DropdownOption[];
  errors?: string;
  disabled?: boolean;
  label?: string;
  text?: string;
  require?: boolean;
  className?: string;
};

const AdminComboBox = ({
  placeholder,
  value,
  onChange,
  options = [],
  errors,
  disabled,
  label,
  text,
  require,
  className = "",
}: AdminComboBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLInputElement>(null);

  const baseClass =
    "w-full mt-1 p-2 border rounded-sm focus:outline-none placeholder:text-gray-g3b0 cursor-pointer";
  const errorClass = errors
    ? "border-red-r64b text-red-r64b placeholder-white-wfff"
    : "border-blue-bbee text-gray-g63f placeholder-gray-g63f";

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setSearchValue("");
    setIsOpen(false);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleClear = () => {
    setSearchValue("");
    onChange?.("");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const displayOption = searchValue ? filteredOptions : options;
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = isOpen ? searchValue : selectedOption?.label || "";
  return (
    <div className="w-full flex flex-col relative">
      {label && (
        <div className="text-blue-bbee text-fr-16">
          {label} {require && <span className="text-red-r64b">*</span>}
        </div>
      )}
      <div className="relative w-full">
        <div
          className={`${baseClass} ${errorClass} ${className} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (!disabled) {
              if (!isOpen) {
                setSearchValue(selectedOption?.label || "");
              }
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <input
              className="focus:outline-none w-full"
              type="text"
              disabled={disabled}
              value={displayValue || searchValue || ""}
              onChange={handleChange}
              placeholder={placeholder}
            />

            {searchValue || value !== "" ? (
              <CloseRoundLight
                width={20}
                height={20}
                color={errors ? "#EF4444" : "#9CA3AF"}
                onClick={handleClear}
              />
            ) : (
              <ExpandDownLight
                width={20}
                height={20}
                color={errors ? "#EF4444" : "#9CA3AF"}
              />
            )}
          </div>
        </div>

        {/* Dropdown Options */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-blue-bbee rounded-sm shadow-lg max-h-60 overflow-y-auto"
          >
            {displayOption.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 truncate hover:bg-gray-50 cursor-pointer text-gray-g63f text-fr-14"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}

        <div>
          <span
            className={`text-fr-12 ${errors ? "text-red-r64b" : "text-gray-500"}`}
          >
            {!errors && (
              <span className="text-fr-12 text-gray-500">{text}</span>
            )}
            {errors && (
              <span className="text-fr-12 text-red-r64b">{errors}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminComboBox;
