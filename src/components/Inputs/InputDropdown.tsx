import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaSortDown } from "react-icons/fa6";

// กำหนด type สำหรับ option แต่ละตัว
interface DropdownOption {
  value: string;
  label: string;
}

// กำหนด props ของ component
interface InputDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  label: string;
  placeholder?: string;
  isAdmin?: boolean;
}

export const InputDropdown: React.FC<InputDropdownProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder,
  isAdmin = false,
}) => {
  return (
    <div className="w-full">
      <h4 className="text-b1 text-brown-16b!">{label}</h4>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full bg-white! relative">
          <SelectValue placeholder={placeholder} />
          {!isAdmin && (
            <FaSortDown className="absolute right-3 bottom-3 h-4 w-4 text-gray-500 pointer-events-none" />
          )}
        </SelectTrigger>
        <SelectContent className="border-none">
          {options.map((e) => (
            <SelectItem key={e.value} value={e.value}>
              {e.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
