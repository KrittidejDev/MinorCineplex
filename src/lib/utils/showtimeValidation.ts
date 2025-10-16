import { SelectOption, ShowtimeFormData } from "@/types/adminShowtime";

export const validateShowtimeFormData = (
  formData: ShowtimeFormData
): { isValid: boolean; errorMessage?: string } => {
  if (
    !formData.movie_id ||
    !formData.hall_id ||
    !formData.time_slot_id ||
    !formData.date ||
    !formData.price
  ) {
    return {
      isValid: false,
      errorMessage: "Please fill in all required fields"
    };
  }

  return { isValid: true };
};

export const validateShowtimeDateTime = (
  date: string,
  timeSlotId: string,
  timeSlots: SelectOption[]
): { isValid: boolean; errorMessage?: string } => {
  const selectedDate = new Date(date);
  const currentDate = new Date();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDay = new Date(selectedDate);
  selectedDay.setHours(0, 0, 0, 0);
  
  if (selectedDay < today) {
    return {
      isValid: false,
      errorMessage: "Cannot create/update showtime for past dates"
    };
  }
  
  if (selectedDay.getTime() === today.getTime()) {
    const selectedTimeSlot = timeSlots.find(ts => ts.value === timeSlotId);
    if (selectedTimeSlot) {
      const [hours, minutes] = selectedTimeSlot.label.split(' - ')[0].split(':').map(Number);
      const showtimeDateTime = new Date(selectedDate);
      showtimeDateTime.setHours(hours, minutes, 0, 0);
      
      if (showtimeDateTime <= currentDate) {
        return {
          isValid: false,
          errorMessage: "Cannot create/update showtime for past time slots"
        };
      }
    }
  }

  return { isValid: true };
};
