// แก้ไข src/components/Inputs/AdminTimeInput.tsx
import React from "react";
import { Input } from "../ui/input";
import TimeLight from "../Icons/TimeLight";

type AdminTimeInputProps = {
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors?: string;
    disabled?: boolean;
    require?: boolean;
    className?: string;
};

const AdminTimeInput = ({
    label,
    value,
    onChange,
    errors,
    disabled,
    require,
    className = "",
    ...props
}: AdminTimeInputProps) => {
    const baseClass = "w-full mt-1 p-3 pr-12 border rounded-sm focus:outline-none placeholder:text-gray-g3b0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-1 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full ";
    const errorClass = errors
        ? "border-red-r64b text-red-r64b placeholder-white-wfff"
        : "border-blue-bbee text-gray-g63f placeholder-gray-g63f";

    
    const formatTimeTo12Hour = (time24: string) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // State สำหรับแสดงเวลาในรูปแบบ 12-hour
    const [displayTime, setDisplayTime] = React.useState("--:-- --");

    // อัพเดท displayTime เมื่อ value เปลี่ยน
    React.useEffect(() => {
        if (value) {
            setDisplayTime(formatTimeTo12Hour(value));
        } else {
            setDisplayTime("--:-- --");
        }
    }, [value]);

    return (
        <div className="flex flex-col relative">
            {label && (
                <div className="text-blue-bbee text-fr-16">
                    {label} {require && <span className="text-red-r64b">*</span>}
                </div>
            )}
            <div className="relative w-full">
                <div className="relative">
                    <Input
                        {...props}
                        type="time"
                        placeholder="--:-- --" 
                        value={value ?? ""}
                        onChange={onChange}
                        disabled={disabled}
                        className={`${baseClass} ${errorClass} ${className}`}
                    />
                    
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none bg-white px-1">
                        <span className={`text-fr-16  ${errors ? "text-red-r64b" : value ? "text-blue-bbee" : "text-gray-g3b0"}`}>
                            {displayTime}
                        </span>
                    </div>
                </div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                    <TimeLight width={24} height={40} color="#3B82F6" />
                </div>
            </div>
        </div>
    );
};

export default AdminTimeInput;