import React, { ChangeEvent } from 'react'
import {Input} from '../ui/input'
import { clsx } from 'clsx'

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
    ...props
}: AdminInputTextFieldProps) => {
    return (
        <div className="flex flex-col flex-1 gap-1 relative">
        {label && (
          <div className="text-blue-bbee text-fr-16 mb-1">
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
            className={clsx(
              `w-full px-3 py-3 border rounded-md text-gray-g3b0 focus:border-blue-bbee focus:outline-none`,
              errors
                ? "border-red-r64b text-red-r64b placeholder-white-wfff"
                : "border-blue-bbee text-gray-g3b0 placeholder-gray-g3b0",
              props.className
            )}
          />
          <div className="h-4 mt-1">
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