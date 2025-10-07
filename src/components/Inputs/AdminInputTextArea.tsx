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
          {label} {require && <span className="text-red-500">*</span>}
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
          `w-full px-3 py-2 border rounded-md resize-y text-gray-g3b0 focus:border-blue-bbee focus:outline-none`,
          `w-full px-3 py-2 border rounded-md resize-y text-gray-g3b0 focus:border-blue-bbee focus:outline-none field-sizing-fixed`,
          errors
            ? "border-red-500 text-red-500 placeholder-red-300"
            : "border-blue-bbee text-gray-g3b0 placeholder-gray-400"
        )}
      />
      {errors && <span className="text-fr-12 text-red-500">{errors}</span>}
    </div>
  );
};

export default AdminInputTextArea;