import { Button } from "@/components/ui/button";
import AddRoundLight from "@/components/Icons/AddRoundLight";
import TableCard from "@/components/Cards/TableCard";
import AdminShowtimeFilter from "./AdminShowtimeFilter";
import DateSelectionBarWidget from "./DateSelectionBarWidget";

const AdminShowtimeWidget = () => {
  const showtimeColumns = [
    { key: "movie", label: "Movie Name", align: "left" as const },
    { key: "cinema", label: "Cinema", align: "left" as const },
    { key: "hall", label: "Hall", align: "left" as const },
    { key: "timeslot", label: "Timeslot", align: "left" as const },
  ];
  const showtimeData = [
    {
      id: "1",
      movie: "Movie 1",
      cinema: "Cinema 1",
      hall: "Hall 1",
      timeslot: "Timeslot 1",
      created_at: "2021-01-01",
      updated_at: "2021-01-01",
    },
    {
      id: "2",
      movie: "Movie 3",
      cinema: "Cinema 3",
      hall: "Hall 3",
      timeslot: "Timeslot 1",
      created_at: "2021-01-01",
      updated_at: "2021-01-01",
    },
    {
      id: "3",
      movie: "Movie 2",
      cinema: "Cinema 2",
      hall: "Hall 2",
      timeslot: "Timeslot 1",
      created_at: "2021-01-01",
      updated_at: "2021-01-01",
    },
  ];
  const showtimeActions = [
    {
      onView: () => console.log("View Movie 1"),
      onEdit: () => console.log("Edit Movie 1"),
      onDelete: () => console.log("Delete Movie 1"),
    },
    {
      onView: () => console.log("View Movie 2"),
      onEdit: () => console.log("Edit Movie 2"),
      onDelete: () => console.log("Delete Movie 2"),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h1 className="text-f-56 text-gray-g63f">Showtime</h1>
        <Button className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5">
          <AddRoundLight width={24} height={24} color={"#FFFFFF"} />
          Add Showtime
        </Button>
      </div>
      <AdminShowtimeFilter />
      <DateSelectionBarWidget onSelectDate={() => {}} />
      <TableCard
        columns={showtimeColumns}
        data={showtimeData}
        actions={showtimeActions}
      />
      <div className="flex justify-start">
        <span className="text-fm-14 text-gray-g63f">{`Showing ${showtimeData.length} of ${showtimeData.length} results`}</span>
      </div>
    </div>
  );
};
export default AdminShowtimeWidget;
