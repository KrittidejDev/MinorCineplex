import * as userRepo from "../repositories/userRepository";

export const getUser = async () => {
  const user = await userRepo.getMany();
  return user;
};

export const getUserById = async (id: string) => {
  const user = await userRepo.getByID(id);
  return user;
};
