import AdminComboBox from "../Inputs/AdminComboBox";
import ModalEmpty from "../Modals/ModalEmpty";
import { Button } from "../ui/button";
import {
  SelectOption,
  SelectCinemaOption,
  ShowtimeFormData,
} from "@/types/adminShowtime";
import { useEffect, useState } from "react";
import InputAdminDate from "../Inputs/InputAdminDate";
import AdminInputTextField from "../Inputs/AdminInputTextField";

interface EditShowtimeFormProps {
  isShowModal: boolean;
  onClose: () => void;
  movies: SelectOption[];
  cinemas: SelectCinemaOption[];
  timeSlots: SelectOption[];
  formData: ShowtimeFormData;
  setFormData: (formData: ShowtimeFormData) => void;
  handleUpdateShowtime: (id: string) => Promise<boolean>;
}

const EditShowtimeForm = ({
  movies,
  cinemas,
  timeSlots,
  formData,
  setFormData,
  isShowModal,
  onClose,
  handleUpdateShowtime,
}: EditShowtimeFormProps) => {
  const [halls, setHalls] = useState<SelectOption[]>([]);
  useEffect(() => {
    if (formData.cinema_id) {
      const selectedCinema = cinemas.find(
        (item) => item.value === formData.cinema_id
      );
      if (selectedCinema) {
        setHalls(selectedCinema.halls);
      }
    } else {
      setHalls([]);
    }
  }, [formData.cinema_id, cinemas]);
  
  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await handleUpdateShowtime(formData.id || "");
          if (result) {
            onClose();
          }
        }}
        className="w-full bg-white flex flex-col justify-center items-center py-10 px-20 rounded-lg"
      >
        <h1 className="text-f-36 text-black">Edit Showtime</h1>
        <div className="w-full min-w-[1200px] flex flex-col gap-10 mt-10">
          <div className="flex justify-between gap-6">
            <AdminComboBox
              label="Select Cinema"
              placeholder="Select Cinema"
              options={cinemas}
              value={formData.cinema_id}
              onChange={(value) => setFormData({ ...formData, cinema_id: value, hall_id: "" })}
            />
            <AdminComboBox
              label="Select Hall"
              placeholder="Select Hall"
              options={halls}
              value={formData.hall_id}
              onChange={(value) => setFormData({ ...formData, hall_id: value })}
            />
          </div>
          <AdminComboBox
            label="Select Movie"
            placeholder="Select Movie"
            options={movies}
            value={formData.movie_id}
            onChange={(value) => setFormData({ ...formData, movie_id: value })}
          />
          <div className="flex justify-between gap-6">
            <InputAdminDate
              label="Select Date"
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value })}
            />
            <AdminComboBox
              label="Select Time"
              placeholder="Select Time"
              options={timeSlots}
              value={formData.time_slot_id}
              onChange={(value) =>
                setFormData({ ...formData, time_slot_id: value })
              }
            />
            <AdminInputTextField
              label="Price"
              placeholder="Enter Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 mt-10">
            <Button
              type="button"
              onClick={onClose}
              className="btn-base blue-normal opacity-40 w-[120px]"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-base blue-normal w-[120px]">
              Save
            </Button>
          </div>
        </div>
      </form>
    </ModalEmpty>
  );
};
export default EditShowtimeForm;
