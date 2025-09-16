import { useState } from "react";
interface DefaultCheckbox {
    label: string;
    defaultChecked?: boolean;
}

export function DefaultCheckbox({ label, defaultChecked = false }: DefaultCheckbox) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <label className="flex items-center gap-2 text-white cursor-pointer mb-10">
            <input
                type="checkbox"
                className="w-6 h-6 accent-blue-500"
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
        <label className="flex items-center gap-2 text-gray-400 mb-10">
            <input type="checkbox" disabled className="w-6 h-6 accent-blue-500" />
            Option 1
        </label>
    );
}
