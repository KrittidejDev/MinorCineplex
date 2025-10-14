import React, { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { clsx } from "clsx";

type InputTextFieldProps = {
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
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
};

const InputTextFeild = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  text,
  label,
  require,
  type = "text",
  maxLength,
  inputMode,
  pattern,
  ...props
}: InputTextFieldProps) => {
  return (
    <div className="flex flex-col flex-1 gap-1 relative">
      {/* Label */}
      {label && (
        <div className="text-gray-gedd text-fr-16 font-medium">
          {label} {require && <span className="text-red">*</span>}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Input
          {...props}
          type={type}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            "bg-gray-g63f w-full border rounded-sm h-12 px-4 py-3 focus:border-gray-g3b0 focus:ring-0 outline-none transition-colors duration-150",
            errors
              ? "border-red-r64b text-red-r64b placeholder-white"
              : "border-gray-gf7e text-white placeholder-gray-400",
            props.className
          )}
        />

        {/* Error / Helper text */}
        <div className="h-4 mt-1">
          {errors ? (
            <span className="text-fr-12 text-red-500">{errors}</span>
          ) : (
            text && <span className="text-fr-12 text-gray-g3b0">{text}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputTextFeild;
