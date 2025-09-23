import * as yup from "yup";

export const signupSchema = yup.object({
  username: yup.string().required("Username is required"),
  phone: yup.string().required("Phone Number is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});