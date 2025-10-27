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
  const formatDateForInput = (dateValue?: string) => {
    if (!dateValue) return "";
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "";
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const formattedValue = formatDateForInput(value);

  return (
    <div className="flex flex-col flex-1 gap-1 relative">
      <label className="text-black text-fr-16"><span>{label}</span>{require && <span className="text-red">*</span>}</label>
      <input
        type="date"
        className="w-full bg-white border-blue-b9a8 border rounded-sm h-10 p-2 text-gray-g3b0"
        value={formattedValue}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
export default InputAdminDate;
