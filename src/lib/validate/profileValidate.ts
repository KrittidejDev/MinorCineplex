import * as yup from "yup";

export const profileValidate = yup.object({
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
  email: yup.string().email("Invalid email").required("Email is required"),
});
