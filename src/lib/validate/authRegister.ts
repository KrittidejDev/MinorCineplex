import * as yup from "yup";

// Function to create schema with language support
export const createSignupFormSchema = (language: string) => {
  const isTh = language === "th";
  
  const messages = {
    username: {
      required: isTh ? "ชื่อผู้ใช้งานจำเป็นต้องกรอก" : "Username is required",
      min: isTh ? "ชื่อผู้ใช้งานต้องมีอย่างน้อย 3 ตัวอักษร" : "Username must be at least 3 characters",
      max: isTh ? "ชื่อผู้ใช้งานต้องมีไม่เกิน 10 ตัวอักษร" : "Username must be at most 10 characters",
      matches: isTh ? "ชื่อผู้ใช้งานต้องประกอบด้วยตัวอักษรและตัวเลขเท่านั้น" : "Username must contain only letters and numbers",
    },
    phone: {
      required: isTh ? "หมายเลขโทรศัพท์จำเป็นต้องกรอก" : "Phone number is required",
      matches: isTh ? "หมายเลขโทรศัพท์ไม่ถูกต้อง" : "Invalid phone number",
    },
    email: {
      required: isTh ? "อีเมลจำเป็นต้องกรอก" : "Email is required",
      email: isTh ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email format",
    },
    password: {
      required: isTh ? "รหัสผ่านจำเป็นต้องกรอก" : "Password is required",
      min: isTh ? "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" : "Password must be at least 8 characters",
      uppercase: isTh ? "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว" : "Password must contain at least one uppercase letter",
      lowercase: isTh ? "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว" : "Password must contain at least one lowercase letter",
      number: isTh ? "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว" : "Password must contain at least one number",
    },
    confirmPassword: {
      required: isTh ? "ยืนยันรหัสผ่านจำเป็นต้องกรอก" : "Confirm Password is required",
      oneOf: isTh ? "รหัสผ่านไม่ตรงกัน" : "Passwords must match",
    },
  };

  return yup.object({
    username: yup
      .string()
      .trim()
      .required(messages.username.required)
      .min(3, messages.username.min)
      .max(10, messages.username.max)
      .matches(/^[a-zA-Z0-9]+$/, messages.username.matches),
    phone: yup
      .string()
      .trim()
      .required(messages.phone.required)
      .matches(/^(0\d{9}|\+[1-9]\d{1,14})$/, messages.phone.matches),
    email: yup
      .string()
      .trim()
      .required(messages.email.required)
      .email(messages.email.email),
    password: yup
      .string()
      .required(messages.password.required)
      .min(8, messages.password.min)
      .matches(/[A-Z]/, messages.password.uppercase)
      .matches(/[a-z]/, messages.password.lowercase)
      .matches(/[0-9]/, messages.password.number),
    confirmPassword: yup
      .string()
      .required(messages.confirmPassword.required)
      .oneOf([yup.ref("password")], messages.confirmPassword.oneOf),
  });
};

// Schema for API validation (without confirmPassword) - keep for backward compatibility
export const signupSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(10, "Username must be at most 10 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username must contain only letters and numbers"
    ),
  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^(0\d{9}|\+[1-9]\d{1,14})$/, "Invalid phone number"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});


export const signupFormSchema = signupSchema.shape({
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});



// Function to create reset password schema with translation
export const createResetPasswordSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    newPassword: yup
      .string()
      .required(t("Email is required"))
      .min(8, t("Password must be at least 8 characters"))
      .matches(/[A-Z]/, t("Password must contain at least one uppercase letter"))
      .matches(/[a-z]/, t("Password must contain at least one lowercase letter"))
      .matches(/[0-9]/, t("Password must contain at least one number")),
    confirmPassword: yup
      .string()
      .required(t("Email is required"))
      .oneOf([yup.ref("newPassword")], t("Passwords must match")),
  });
};

// Keep old schema for backward compatibility
export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
  .string()
  .required("New Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: yup
  .string()
  .required("Confirm New Password is required")
  .oneOf([yup.ref("newPassword")], "Passwords must match"),
});
