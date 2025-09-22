import * as cinemaRepo from "../repositories/cinemaRepository";

export const getCinemas = async () => {
  const cinema = await cinemaRepo.getMany();
  return cinema;
};

export const getCinemaById = async (id) => {
  const cinema = await cinemaRepo.getByID(id);
  return cinema;
};