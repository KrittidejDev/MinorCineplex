import { cinemaRepo } from "@/repositories/cinemaRepo";
import { CinemaDTO } from "@/types/cinema";

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
};
