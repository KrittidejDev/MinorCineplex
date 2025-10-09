import React from "react"
import { Input } from "../ui/input"
import SearchLight from "../Icons/SearchLight"
import CloseRoundLight from "../Icons/CloseRoundLight"

type AdminSearchBarProps = {
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const AdminSearchBar = ({
    placeholder,
    value,
    onChange,
}: AdminSearchBarProps) => {
    const baseClass = "w-full mt-1 p-3 pl-12 pr-12 border rounded-sm rounded-lg placeholder:text-gray-g3b0 focus:outline-none focus:border-blue-bbee ";
    const errorClass = "border-blue-bbee text-gray-g63f placeholder-gray-g63f";

    return (
        <div className="flex flex-col relative">
            <div className="relative w-full">
                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 ">
                    <SearchLight width={20} height={20} color="#9CA3AF" />
                </div>

                <Input
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={onChange}
                    className={`${baseClass} ${errorClass}`}
                />

                {/* Clear Button (X) */}
                {value && value.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 "
                    >
                        <CloseRoundLight width={24} height={24} color="#9CA3AF" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminSearchBar;