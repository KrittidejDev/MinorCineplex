import { useState } from "react";
interface DefaultCheckbox {
    label: string;
}

export function DefaultCheckbox({ label }: DefaultCheckbox) {
    const [checked, setChecked] = useState(false); // แต่ละตัวมี state ของตัวเอง

    return (
        <label className="flex items-center gap-2 text-white cursor-pointer mb-2">
            <input
                type="checkbox"
                className="w-4 h-4 accent-blue-500"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />
            {label}
        </label>
    );
}

// Disabled
export function DisabledCheckbox() {
    return (
        <label className="flex items-center gap-2 text-gray-400 mb-2">
            <input type="checkbox" disabled className="w-4 h-4 accent-blue-500" />
            Option 1
        </label>
    );
}
