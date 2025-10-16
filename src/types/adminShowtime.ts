export interface ShowtimeQuery {
  movie: string;
  cinema: string;
  hall: string;
  timeSlot: string;
  date: string;
}

export interface ShowtimeFormData {
  id?: string;
  movie_id: string;
  cinema_id: string;
  hall_id: string;
  time_slot_id: string;
  date: string;
  price: string;
}

export interface ShowtimeData {
  id: string;
  movie_id: string;
  movie_title: string;
  cinema_id: string;
  cinema_name: string;
  hall_id: string;
  hall_name: string;
  timeslot: string;
  start_time: string;
  end_time: string;
  date: string;
  price: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectCinemaOption extends SelectOption {
  halls: SelectOption[];
}

export interface MovieBasicInfo {
  id: string;
  title: string;
}

export interface TimeSlotBasicInfo {
  id: string;
  start_time: string;
  end_time: string;
}

export interface CinemaFromAPI {
  id: string;
  name: string;
  halls: {
    id: string;
    name: string;
  }[];
}
