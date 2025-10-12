type InputAdminDateProps = {
  label?: string;
  require?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

const InputAdminDate = (
    {
        label,
        require,
        value,
        onChange,
    }: InputAdminDateProps
) => {

  return (
    <div className="flex flex-col flex-1 gap-1 relative">
      <label className="text-gray-gedd text-fr-16"><span className="text-blue-b9a8">{label}</span>{require && <span className="text-red">*</span>}</label>
      <input
        type="date"
        className="w-full bg-white border-blue-b9a8 border rounded-sm h-12 pl-4 pr-3 py-3"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
export default InputAdminDate;
