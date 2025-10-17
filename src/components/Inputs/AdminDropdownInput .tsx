import React, { useState, useRef, useEffect } from "react";
import ExpandDownLight from "../Icons/ExpandDownLight";

type DropdownOption = {
  value: string;
  label: string;
};

type AdminDropdownInputProps = {
  placeholder?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options?: DropdownOption[];
  errors?: string;
  disabled?: boolean;
  label?: string;
  text?: string;
  require?: boolean;
  className?: string;
  multiple?: boolean;
};

const AdminDropdownInput = ({
  placeholder = "",
  value = "",
  onChange,
  options = [],
  errors,
  disabled,
  label,
  text,
  require,
  className = "",
  multiple = false,
}: AdminDropdownInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseClass =
    "w-full mt-1 p-3 border rounded-sm focus:outline-none placeholder:text-gray-g3b0 cursor-pointer";
  const errorClass = errors
    ? "border-red-r64b text-red-r64b placeholder-white-wfff"
    : "border-blue-bbee text-gray-g63f placeholder-gray-g63f";

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string"
      ? [value]
      : [];

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      let newValues: string[];
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter((v) => v !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col relative"  ref={dropdownRef}>
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
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <span
              className={selectedLabels ? "text-gray-g63f" : "text-gray-g3b0"}
            >
              {selectedLabels || placeholder}
            </span>
            <ExpandDownLight
              width={20}
              height={20}
              color={errors ? "#EF4444" : "#9CA3AF"}
            />
          </div>
        </div>

        {/* Dropdown Options */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-blue-bbee rounded-sm shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value); // <-- เพิ่ม: เช็คว่าตัวนี้ถูกเลือกแล้ว
              return (
                <div
                  key={option.value}
                  className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-g63f text-fr-14 ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mr-2"
                    />
                  )}
                  <span>{option.label}</span>
                </div>
              );
            })}
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

export default AdminDropdownInput;
