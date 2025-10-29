import bcrypt from "bcrypt";
import { signupSchema } from "../lib/validate/authRegister";
import * as userRepo from "../repositories/authRepository";
import sgMail from "@sendgrid/mail";

interface RegisterUserInput {
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface ResetPasswordInput {
  id?: string;
  email?: string;
  newPassword: string;
}

export const registerUser = async (body: RegisterUserInput) => {
  await signupSchema.validate(body, { abortEarly: false });

  const { username, phone, email, password } = body;

  // Convert email to lowercase for case-insensitive comparison
  const normalizedEmail = email.toLowerCase();

  if (await userRepo.findUserByEmail(normalizedEmail)) {
    throw { status: 400, message: "Email already exists" };
  }

  if (await userRepo.findUserByPhone(phone)) {
    throw { status: 400, message: "Phone Number already exists" };
  }

  if (await userRepo.findUserByUsername(username)) {
    throw { status: 400, message: "Username already exists" };
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await userRepo.createUser({
    username,
    phone,
    email: normalizedEmail,
    password: hashed,
    role: "CUSTOMER",
  });

  return user;
};

export const resetPassword = async (body: ResetPasswordInput) => {
  const { id, email, newPassword } = body;

  let user;
  if (id) {
    // Reset password by user ID (existing functionality)
    user = await userRepo.findUserById(id);
  } else if (email) {
    // Reset password by email (new functionality)
    user = await userRepo.findUserByEmail(email.toLowerCase());
  } else {
    throw { status: 400, message: "Either id or email is required" };
  }

  if (!user) {
    throw { status: 400, message: "User not found" };
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await userRepo.updateUser(user.id, { password: hashed });
  return user;
};

export const sendResetPasswordEmail = async (email: string) => {
  const normalizedEmail = email.toLowerCase();
  const user = await userRepo.findUserByEmail(normalizedEmail);

  if (!user) {
    throw { status: 400, message: "Email not found" };
  }

  // สร้าง random token พร้อม timestamp สำหรับ check expiration
  const randomToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  const expiresIn = 60 * 60 * 1000; // 1 hour in milliseconds
  const expiresAt = timestamp + expiresIn;

  // สร้าง token ที่มี timestamp ฝังอยู่
  const token = `${randomToken}-${timestamp}`;

  // สร้าง reset link
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&email=${normalizedEmail}`;

  // ส่ง email จริงผ่าน SendGrid
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg = {
      to: normalizedEmail,
      from: process.env.SENDGRID_FROM!,
      subject: "Reset your password",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5">
          <h2>Reset your password</h2>
          <p>We received a request to reset your password</p>
          <p>
            Click the link below to reset your password:<br/>
            <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a>
          </p>
          <p>This link will expire in 1 hour</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("Successfully sent reset password email to:", normalizedEmail);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send reset password email:", error.message);
      throw { status: 500, message: error.message };
    }
    console.error("Failed to send reset password email:", error);
    throw { status: 500, message: "Failed to send email" };
  }

  return { message: "Reset link sent to your email", resetLink };
};
