import React, { ChangeEvent } from "react";
import { Input } from "../ui/input";

type AdminInputTextFieldProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  errors?: string;
  disabled?: boolean;
  label?: string;
  text?: string;
  require?: boolean;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  maxLength?: number;
};

const AdminInputTextField = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  label,
  text,
  require,
  type,
  maxLength,
  className = "",
  ...props
}: AdminInputTextFieldProps) => {
  const baseClass =
    "w-full mt-1 p-3 border rounded-sm focus:outline-none placeholder:text-gray-g3b0";
  const errorClass =
    errors
      ? "border-red-r64b text-red-r64b placeholder-white-wfff"
      : "border-blue-bbee text-gray-g63f placeholder-gray-g63f";

  return (
    <div className="flex flex-col relative">
      {label && (
        <div className="text-blue-bbee text-fr-16">
          {label} {require && <span className="text-red-r64b">*</span>}
        </div>
      )}
      <div className="relative w-full">
        <Input
          {...props}
          type={type}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClass} ${errorClass} ${className}`}
        />
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

export default AdminInputTextField;
