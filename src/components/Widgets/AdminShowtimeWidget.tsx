import { Button } from "@/components/ui/button";
import AddRoundLight from "@/components/Icons/AddRoundLight";
import TableCard from "@/components/Cards/TableCard";
import AdminShowtimeFilter from "./AdminShowtimeFilter";
import { ShowtimeQuery, SelectOption, SelectCinemaOption } from "@/pages/admin/showtime";

interface AdminShowtimeWidgetProps {
  data: ShowTimeData[];
  query: ShowtimeQuery;
  setQuery: (query: ShowtimeQuery) => void;
  movies: SelectOption[];
  cinemas: SelectCinemaOption[];
}

export interface ShowTimeData {
  id: string;
  movie: string;
  cinema: string;
  hall: string;
  timeslot: string;
}



const AdminShowtimeWidget = ({ data, setQuery, query, movies, cinemas }: AdminShowtimeWidgetProps) => {
  const showtimeColumns = [
    { key: "movie", label: "Movie Name", align: "left" as const },
    { key: "cinema", label: "Cinema", align: "left" as const },
    { key: "hall", label: "Hall", align: "left" as const },
    { key: "timeslot", label: "Timeslot", align: "left" as const },
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
      <div className="flex justify-between items-center px-15 mt-20">
        <h1 className="text-f-56 text-gray-g63f">Showtime</h1>
        <Button className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5">
          <AddRoundLight width={24} height={24} color={"#FFFFFF"} />
          Add Showtime
        </Button>
      </div>
      <div className="px-15">
        <AdminShowtimeFilter 
          data={data} 
          setQuery={setQuery} 
          query={query}
          movies={movies}
          cinemas={cinemas}
        />
      </div>
      {/* <DateSelectionBarWidget onSelectDate={() => {}} /> */}
      <div className="w-full flex flex-col gap-10">
        <TableCard
          columns={showtimeColumns}
          data={data}
          actions={showtimeActions}
        />
      </div>
      <div className="flex justify-start">
        <span className="text-fm-14 text-gray-g63f">{`Showing ${data.length} of ${data.length} results`}</span>
      </div>
    </div>
  );
};
export default AdminShowtimeWidget;
