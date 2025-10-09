import AdminInputDropdown from "../Inputs/AdminDropdownInput ";
import { ShowTimeData } from "../Widgets/AdminShowtimeWidget";

const AdminShowtimeFilter = ({ data }: { data: ShowTimeData[] }) => {
  const queryOptions = [
    {
      value: "movie",
      label: "Movie",
    },
    {
      value: "cinema",
      label: "Cinema",
    },
    {
      value: "hall",
      label: "Hall",
    },
    {
      value: "timeslot",
      label: "Timeslot",
    },
  ];
  return (
    <div className="flex gap-4 justify-between">
      {queryOptions.map((option) => (
        <div key={option.value} className="min-w-[200px] max-w-[300px]">
          <AdminInputDropdown
            value={option.value}
            onChange={() => {}}
            options={data[option.value].map((item) => (item))}
            label={option.label}
          />
        </div>
      ))}
    </div>
  );
};
export default AdminShowtimeFilter;
