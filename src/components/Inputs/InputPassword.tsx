import React, { useState, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react"; // 👈 ใช้ icon จาก lucide-react
import cx from "classnames";

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
};

const InputPassword = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  text,
  label,
  require,
  type = "text",
  ...props
}: InputTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && !showPassword ? "password" : "text";

  return (
    <div className="flex flex-col flex-1 relative">
      {label && (
        <div className="text-gray-gedd text-fr-16">
          {label} {require && <span className="text-red">*</span>}
        </div>
      )}

      <div className="relative w-full">
        <Input
          {...props}
          type={inputType}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={cx(
            `bg-gray-g63f border rounded-sm h-12 pl-4 pr-3 py-3 focus:border-gray-g3b0 `,
            errors
              ? "border-red-r64b text-red-r64b placeholder-white"
              : "border-gray-gf7e text-white placeholder-gray-400"
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="bg-white! absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
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

export default InputPassword;
