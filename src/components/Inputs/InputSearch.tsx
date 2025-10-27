import React from "react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useEffect } from "react";
import cx from "classnames";
import SearchLight from "../Icons/SearchLight";
import CloseRoundLight from "../Icons/CloseRoundLight";

type InputSearchProps = {
  placeholder?: string;
  delay?: number;
  value?: string;
  handleSearch?: (value: string) => void;
  label?: string;
  require?: boolean;
  errors?: string;
  disabled?: boolean;
  text?: string;
  type?: React.HTMLInputTypeAttribute;
};

const InputSearch = ({
  placeholder,
  handleSearch,
  value,
  delay,
  label,
  require,
  errors,
  disabled,
  type = "text",
  ...props
}: InputSearchProps) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (delay && delay > 0) {
      const handler = setTimeout(() => {
        handleSearch?.(newValue);
      }, delay);
      return () => clearTimeout(handler);
    } else {
      handleSearch?.(newValue);
    }
  };

  const handleClear = () => {
    setInternalValue("");
    handleSearch?.("");
  };

  return (
    <div className="flex flex-col gap-1 relative">
      {label && (
        <div className="text-gray-gedd text-fr-16">
          {label} {require && <span className="text-red">*</span>}
        </div>
      )}
      <div className="relative w-full">
        <Input
          {...props}
          type={type}
          placeholder={placeholder}
          value={internalValue}
          onChange={_handleChange}
          disabled={disabled}
          className={cx(
            `w-full bg-gray-g63f border rounded-sm h-12 pl-8 pr-3 py-3 focus:border-gray-g3b0 `,
            errors
              ? "border-red-r64b text-red-r64b placeholder-white"
              : "border-gray-gf7e text-white placeholder-gray-400"
          )}
        />
        {/* Icon */}
        {value !== "" && (
          <div 
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
            <CloseRoundLight width={20} height={20} color="#C8CEDD" />
          </div>
        )}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <SearchLight width={20} height={20} color="#C8CEDD" />
        </div>
      </div>
    </div>
  );
};

export default InputSearch;
