import { cinemaRepo } from "@/repositories/cinemaRepo";
import { CinemaFromAPI } from "@/types/adminShowtime";
import { CinemaDTO, MovieWithHalls } from "@/types/cinema";

export const cinemaService = {
  async getCinemas(
    filters?: { city?: string; group?: string; name?: string },
    pagination?: { page?: number; limit?: number }
  ): Promise<{ data: CinemaDTO[]; count: number }> {
    return cinemaRepo.findCinemas(filters, pagination);
  },

  async getCinemaBySlug(slug: string): Promise<CinemaDTO | null> {
    return cinemaRepo.findCinemaBySlug(slug);
  },

  async getCinemaById(id: string): Promise<CinemaDTO | null> {
    return cinemaRepo.findCinemaById(id);
  },

  async getCinemaShowtimesBySlug(
    slug: string,
    date?: string
  ): Promise<MovieWithHalls[] | null> {
    const targetDate = date ? new Date(date) : new Date();
    if (date && isNaN(targetDate.getTime())) {
      throw new Error("รูปแบบวันที่ไม่ถูกต้อง");
    }
    targetDate.setHours(0, 0, 0, 0);
    return cinemaRepo.findCinemaShowtimesBySlug(slug, targetDate);
  },
  async getCinemasForDropdown(): Promise<CinemaFromAPI[]> {
    const cinemas = await cinemaRepo.getCinemasForDropdown();
    return cinemas;
  },
};

