import * as userRepo from "../repositories/userRepository";
import { UpdateUserInput } from "../types/user";



export const getUser = async () => {
  const user = await userRepo.getMany();
  return user;
};

export const getUserById = async (id: string) => {
  const user = await userRepo.getByID(id);
  return user;
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  const user = await userRepo.updateUser(id, data);
  return user;
};
