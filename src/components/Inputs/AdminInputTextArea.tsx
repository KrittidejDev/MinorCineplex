import React, { ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";

type AdminInputTextAreaProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: string;
  disabled?: boolean;
  label?: string;
  require?: boolean;
  maxLength?: number;
  height?: string;
  rows?: number;
  className?: string;
};

const AdminInputTextArea = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  label,
  require,
  maxLength,
  height,
  rows,
  className = "",
  ...props
}: AdminInputTextAreaProps) => {
  const baseClass =
    "w-full mt-1 p-3 border rounded-sm text-gray-g63f focus:border-blue-bbee focus:outline-none field-sizing-fixed";
  const errorClass = errors
    ? "border-red-r64b text-red-r64b placeholder-white-wfff"
    : "border-blue-bbee text-gray-g63f placeholder-gray-g3b0";

  return (
    <div className="flex flex-col relative">
      {label && (
        <div className="text-blue-bbee text-fr-16">
          {label} {require && <span className="text-red-r64b">*</span>}
        </div>
      )}
      <Textarea
        {...props}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        style={{ height }}
        className={`${baseClass} ${errorClass} ${className}`}
      />
      {errors && <span className="text-fr-12 text-red-r64b">{errors}</span>}
    </div>
  );
};

export default AdminInputTextArea;
