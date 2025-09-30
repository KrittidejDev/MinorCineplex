import bcrypt from "bcrypt";
import { signupSchema } from "../lib/validate/authRegister";
import * as userRepo from "../repositories/authRepository";

interface RegisterUserInput {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export const registerUser = async (body: RegisterUserInput) => {
  await signupSchema.validate(body, { abortEarly: false });

  const { username, phone, email, password } = body;

  if (await userRepo.findUserByEmail(email)) {
    throw { status: 400, message: "Email already exists" };
  }

  if (await userRepo.findUserByPhone(phone)) {
    throw { status: 400, message: "Phone Number already exists" };
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await userRepo.createUser({
    username,
    phone,
    email,
    password: hashed,
    role: "CUSTOMER",
  });

  return user;
};
