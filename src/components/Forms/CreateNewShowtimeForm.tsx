import { DatabaseZap } from "lucide-react";
import AdminComboBox from "../Inputs/AdminComboBox";
import ModalEmpty from "../Modals/ModalEmpty";
import { Button } from "../ui/button";
import {
  SelectOption,
  SelectCinemaOption,
  ShowtimeFormData,
} from "@/pages/admin/showtime";
import { useEffect, useState } from "react";
import InputAdminDate from "../Inputs/InputAdminDate";

interface CreateNewShowtimeFormProps {
  isShowModal: boolean;
  onClose: () => void;
  movies: SelectOption[];
  cinemas: SelectCinemaOption[];
  timeSlots: SelectOption[];
  formData: ShowtimeFormData;
  setFormData: (formData: ShowtimeFormData) => void;
  handleCreateShowtime: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CreateNewShowtimeForm = ({
  movies,
  cinemas,
  timeSlots,
  formData,
  setFormData,
  isShowModal,
  onClose,
  handleCreateShowtime,
}: CreateNewShowtimeFormProps) => {
  const [halls, setHalls] = useState<SelectOption[]>([]);
  useEffect(() => {
    if (formData.cinema) {
      const selectedCinema = cinemas.find(
        (item) => item.value === formData.cinema
      );
      if (selectedCinema) {
        setHalls(selectedCinema.halls);
      }
    } else {
      setHalls([]);
    }
  }, [formData.cinema, cinemas]);

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <form 
      onSubmit={handleCreateShowtime}
      className="w-full bg-white flex flex-col justify-center items-center py-10 px-20 rounded-lg">
        <h1 className="text-f-36 text-black">Create New Showtime</h1>
        <div className="w-full min-w-[1200px] flex flex-col gap-10 mt-10">
          <div className="flex justify-between gap-6">
            <AdminComboBox
              label="Select Cinema"
              placeholder="Select Cinema"
              options={cinemas}
              value={formData.cinema}
              onChange={(value) => setFormData({ ...formData, cinema: value })}
            />
            <AdminComboBox
              label="Select Hall"
              placeholder="Select Hall"
              options={halls}
              value={formData.hall}
              onChange={(value) => setFormData({ ...formData, hall: value })}
            />
          </div>
          <AdminComboBox
            label="Select Movie"
            placeholder="Select Movie"
            options={movies}
            value={formData.movie}
            onChange={(value) => setFormData({ ...formData, movie: value })}
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
              value={formData.timeSlot}
              onChange={(value) =>
                setFormData({ ...formData, timeSlot: value })
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
              Create
            </Button>
          </div>
        </div>
      </form>
    </ModalEmpty>
  );
};
export default CreateNewShowtimeForm;
