import ModalEmpty from "../Modals/ModalEmpty";
import { Button } from "../ui/button";
import AdminInputTextField from "../Inputs/AdminInputTextField";
import { ShowtimeData } from "@/types/adminShowtime";
import { dateFormat } from "@/lib/dateFormat";

interface ViewShowtimeProps {
  isShowModal: boolean;
  onClose: () => void;
  data: ShowtimeData;
}

const ViewShowtime = ({ isShowModal, onClose, data }: ViewShowtimeProps) => {
  const rows = [
    [
      { label: "Cinema", value: data.cinema_name, width: "w-full max-w-[400px]" },
      { label: "Hall", value: data.hall_name, width: "max-w-[200px]" },
      { label: "Date", value: dateFormat(data.date), width: "max-w-[200px]" },
    ],
    [
      { label: "Movie Title", value: data.movie_title, width: "w-[400px]" },
      { label: "Time Slot", value: `${data.start_time} - ${data.end_time}`, width: "max-w-[200px]" },
      { label: "Price", value: data.price, width: "max-w-[200px]" },
    ],
  ];

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <form className="w-full bg-white flex flex-col justify-center items-center py-10 px-15 rounded-lg">
        <h1 className="text-f-36 text-black">Showtime Details</h1>
        <div className="w-full min-w-[900px] flex flex-col gap-10 mt-10">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between gap-6">
              {row.map((field, fieldIndex) => (
                <div key={fieldIndex} className={`${field.width} truncate`}>
                  <AdminInputTextField
                    label={field.label}
                    value={field.value}
                    disabled
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="btn-base blue-normal cursor-pointer opacity-40 w-[120px]"
            >
              Back
            </Button>
          </div>
        </div>
      </form>
    </ModalEmpty>
  );
};
export default ViewShowtime;
