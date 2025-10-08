import React, { ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";
import { clsx } from "clsx";

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
  ...props
}: AdminInputTextAreaProps) => {
  return (
    <div className="flex flex-col flex-1 gap-1 relative">
      {label && (
        <div className="text-blue-bbee text-fr-16 mb-1">
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
        className={clsx(
          `w-full p-3 border rounded-sm text-gray-g63f focus:border-blue-bbee focus:outline-none`,
          `w-full p-3 border rounded-sm text-gray-g63f focus:border-blue-bbee focus:outline-none field-sizing-fixed`,
          errors
            ? "border-red-r64b text-red-r64b placeholder-white-wfff"
            : "border-blue-bbee text-gray-g63f placeholder-gray-g3b0"
        )}
      />
      {errors && <span className="text-fr-12 text-red-r64b">{errors}</span>}
    </div>
  );
};

export default AdminInputTextArea;