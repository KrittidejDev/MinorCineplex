import React, { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { clsx } from "clsx";
import SearchLight from "../Icons/SearchLight";
import CloseRoundLight from "../Icons/CloseRoundLight";

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
  type,
  ...props
}: InputTextFieldProps) => {
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
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            `bg-gray-g63f border rounded-sm pl-8 pr-3 py-3 focus:border-gray-g3b0 `,
            errors
              ? "border-red-r64b text-red-r64b placeholder-white"
              : "border-gray-gf7e text-white placeholder-gray-400",
              props.className
          )}
        />
        <div className="h-4 mt-1">
          <span
            className={`text-fr-12 ${errors ? "text-red-500" : "text-gray-g3b0"}`}
          >
            {!errors && (
              <span className="text-fr-12 text-gray-g3b0">{text}</span>
            )}
            {errors && (
              <span className="text-fr-12 text-red-500 ">{errors}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputTextFeild;
