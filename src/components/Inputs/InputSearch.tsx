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
  delay = 500,
  label,
  require,
  errors,
  disabled,
  text,
  type = "text",
  ...props
}: InputSearchProps) => {
  const [_value, _setValue] = useState(value);

  const _handleChange = (e) => {
    _setValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch?.(_value ?? "");
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [_value, delay, handleSearch]);

  return (
    <div className="flex flex-col flex-1 gap-1 relative">
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
          value={value ?? ""}
          onChange={_handleChange}
          disabled={disabled}
          className={cx(
            `bg-gray-g63f border rounded-sm h-12 pl-8 pr-3 py-3 focus:border-gray-g3b0 `,
            errors
              ? "border-red-r64b text-red-r64b placeholder-white"
              : "border-gray-gf7e text-white placeholder-gray-400"
          )}
        />
        {/* Icon */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <CloseRoundLight width={20} height={20} color="#C8CEDD" />
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <SearchLight width={20} height={20} color="#C8CEDD" />
        </div>
      </div>
      <div className="h-4 mt-1">
        <span
          className={`text-fr-12 ${errors ? "text-red-500" : "text-gray-g3b0"}`}
        >
          {!errors && <span className="text-fr-12 text-gray-g3b0">{text}</span>}
          {errors && <span className="text-fr-12 text-red-500 ">{errors}</span>}
        </span>
      </div>
    </div>
  );
};

export default InputSearch;
