import * as userRepo from "../repositories/userRepository";
import * as authRepo from "../repositories/authRepository";
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
  const { username } = data;
  if (await authRepo.findUserByUsername(username as string, id as string)) {
    throw { status: 400, message: "Username already exists" };
  }
  const user = await userRepo.updateUser(id, data);
  return user;
};
