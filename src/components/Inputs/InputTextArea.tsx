import React, { ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";
import { clsx } from "clsx";

type InputTextAreaProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: string;
  disabled?: boolean;
  label?: string;
  require?: boolean;
  maxLength?: number;
  height?: string;
};

const InputTextArea = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  label,
  require,
  maxLength,
  height,
  ...props
}: InputTextAreaProps) => {
  return (
    <div className="flex flex-col flex-1 gap-1 relative">
      {label && (
        <div className="text-gray-gedd text-fr-16">
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
        style={{ height }}
        className={clsx(
          `bg-gray-g63f border-gray-gf7e max-w-[343px] h-34 rounded-sm px-3 py-2  `,
          errors
            ? "border-red-r64b text-red-r64b placeholder-white"
            : "border-gray-gf7e text-white placeholder-gray-g3b0"
        )}
      />
      {errors && <span className="text-fr-12 text-red-r64b ">{errors}</span>}
    </div>
  );
};

export default InputTextArea;
