import { Button } from "@/components/ui/button";
import AddRoundLight from "@/components/Icons/AddRoundLight";
import TableCard from "@/components/Cards/TableCard";
import AdminShowtimeFilter from "./AdminShowtimeFilter";
import {
  ShowtimeQuery,
  SelectOption,
  SelectCinemaOption,
  ShowtimeFormData,
  ShowtimeData,
} from "@/types/adminShowtime";
import CreateNewShowtimeForm from "../Forms/CreateNewShowtimeForm";
import EditShowtimeForm from "../Forms/EditShowtimeForm";
import ViewShowtime from "../Forms/ViewShowtime";
import { useState } from "react";
import { dateFormat } from "@/lib/dateFormat";
import AdminStPagination from "./AdminStPagination";

interface AdminShowtimeWidgetProps {
  data: ShowtimeData[];
  totalPages: number;
  total: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  query: ShowtimeQuery;
  setQuery: (query: ShowtimeQuery) => void;
  formData: ShowtimeFormData;
  setFormData: (formData: ShowtimeFormData) => void;
  clearFormData: () => void;
  movies: SelectOption[];
  cinemas: SelectCinemaOption[];
  timeSlots: SelectOption[];
  handleCreateShowtime: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<boolean>;
  handleUpdateShowtime: (id: string) => Promise<boolean>;
  handleDeleteShowtime: (id: string) => void;
}

const AdminShowtimeWidget = ({
  data,
  totalPages,
  total,
  currentPage,
  setCurrentPage,
  query,
  setQuery,
  formData,
  setFormData,
  clearFormData,
  movies,
  cinemas,
  timeSlots,
  handleCreateShowtime,
  handleUpdateShowtime,
  handleDeleteShowtime,
}: AdminShowtimeWidgetProps) => {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowViewModal, setIsShowViewModal] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeData | null>(
    null
  );

  const handleViewShowtime = (id: string) => {
    const showtime = data.find((item) => item.id === id) as
      | ShowtimeData
      | undefined;
    if (showtime) {
      setSelectedShowtime(showtime);
      setIsShowViewModal(true);
    }
  };

  const handleEditShowtime = (id: string) => {
    const originalShowtime = data.find((item) => item.id === id);
    if (originalShowtime) {
      setFormData({
        id: originalShowtime.id,
        cinema_id: originalShowtime.cinema_id,
        hall_id: originalShowtime.hall_id,
        time_slot_id: originalShowtime.timeslot,
        movie_id: originalShowtime.movie_id,
        date: originalShowtime.date,
        price: originalShowtime.price,
      });
      setIsShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsShowEditModal(false);
    clearFormData();
  };

  const handleCloseCreateModal = () => {
    setIsShowCreateModal(false);
    clearFormData();
  };

  const onCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const result = await handleCreateShowtime(event);
    if (result) {
      setIsShowCreateModal(false);
      clearFormData();
    }
  };

  const mappedData = data.map((item) => ({
    ...item,
    timeslot: `${item.start_time} - ${item.end_time}`,
    date: dateFormat(item.date),
  }));

  const showtimeColumns = [
    { key: "movie_title", label: "Movie Name", align: "left" as const },
    { key: "cinema_name", label: "Cinema", align: "left" as const },
    { key: "hall_name", label: "Hall", align: "left" as const },
    { key: "timeslot", label: "Timeslot", align: "left" as const },
    { key: "date", label: "Date", align: "left" as const },
    { key: "price", label: "Price", align: "right" as const },
  ];

  const showtimeActions = data.map((item) => ({
    onView: () => handleViewShowtime(item.id),
    onEdit: () => handleEditShowtime(item.id),
    onDelete: () => handleDeleteShowtime(item.id),
  }));

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center px-15 mt-20">
          <h1 className="text-f-56 text-gray-g63f">Showtime</h1>
          <Button
            onClick={() => setIsShowCreateModal(true)}
            className="btn-base blue-normal cursor-pointer text-fm-16 font-bold px-4 py-3 gap-2.5"
          >
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
            timeSlots={timeSlots}
          />
        </div>
        <div className="w-full flex flex-col gap-10">
          <TableCard
            columns={showtimeColumns}
            data={mappedData}
            actions={showtimeActions}
          />
        </div>
        <AdminStPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        <div className="flex justify-start px-15">
          <span className="text-fm-14 text-gray-g63f">{`Showing ${data.length} of ${total} results`}</span>
        </div>
      </div>
      <CreateNewShowtimeForm
        movies={movies}
        cinemas={cinemas}
        timeSlots={timeSlots}
        formData={formData}
        setFormData={setFormData}
        isShowModal={isShowCreateModal}
        onClose={handleCloseCreateModal}
        handleCreateShowtime={onCreateSubmit}
      />
      <EditShowtimeForm
        movies={movies}
        cinemas={cinemas}
        timeSlots={timeSlots}
        formData={formData}
        setFormData={setFormData}
        isShowModal={isShowEditModal}
        onClose={handleCloseEditModal}
        handleUpdateShowtime={handleUpdateShowtime}
      />
      {selectedShowtime && (
        <ViewShowtime
          data={selectedShowtime}
          isShowModal={isShowViewModal}
          onClose={() => setIsShowViewModal(false)}
        />
      )}
    </>
  );
};
export default AdminShowtimeWidget;
