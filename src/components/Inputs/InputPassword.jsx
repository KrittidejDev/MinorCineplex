import React, { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react"; // 👈 ใช้ icon จาก lucide-react
import cx from "classnames";

const InputPassword = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  label,
  require,
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && !showPassword ? "password" : "text";

  return (
    <div className="flex flex-col flex-1 relative">
      {label && (
        <div className="text-b1 text-brown-16b! mb-1">
          {label} {require && <span className="text-red">*</span>}
        </div>
      )}

      <div className="relative">
        <Input
          {...props}
          type={inputType}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          className={cx(
            "border bg-white rounded-md px-3 py-2 w-full pr-10",
            errors
              ? "border-red-500 text-red-600 placeholder-red-400"
              : "border-gray-300 text-black placeholder-gray-400"
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

      {errors && <span className="text-b2 text-red! mt-1">{errors}</span>}
    </div>
  );
};

export default InputPassword;
