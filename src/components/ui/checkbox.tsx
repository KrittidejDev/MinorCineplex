import { useState } from "react";
interface DefaultCheckbox {
  label: string;
  defaultChecked?: boolean;
}

export function DefaultCheckbox({
  label,
  defaultChecked = false,
}: DefaultCheckbox) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
  <span className="relative inline-block w-5 h-5">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      className="peer absolute inset-0 w-full h-full appearance-none bg-transparent border border-gray-g3b0 rounded-sm
                 checked:border-none checked:bg-blue-bbee"
    />
    <svg
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden peer-checked:block"
      viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" className="text-white" />
    </svg>
  </span>
  <span className="text-gray-gedd">{label}</span>
</label>
  );
}

// Disabled
export function DisabledCheckbox() {
  return (
    <label className="flex items-center gap-2 text-gray-400 mb-10">
      <input type="checkbox" disabled className="w-5 h-5 accent-blue-500" />
      Option 1
    </label>
  );
}
