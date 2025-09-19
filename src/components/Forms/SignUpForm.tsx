import InputPassword from "../Inputs/InputPassword";
import InputTextFeild from "../Inputs/InputTextFeild";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import * as yup from "yup";
import Link from "next/link";

type FormValues = {
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
};

type SignUpFormProps = {
  onSubmit?: (values: FormValues) => void;
};

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const schema = yup.object().shape({
    username: yup.string().required("Name is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { username, email, password } = watch();
  const isEmpty = !username || !email || !password;

  return (
    <form
      onSubmit={handleSubmit(onSubmit ?? (() => {}))}
      className="max-w-[380px] flex flex-col items-center gap-10"
    >
      <h2 className="text-f-36 text-center text-white">Register</h2>
      <div className="w-full flex flex-col gap-4">
        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={"Username"}
              placeholder="Username"
              errors={errors.username?.message}
            />
          )}
          name="username"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={"Phone Number"}
              placeholder="Phone Number"
              errors={errors.phoneNumber?.message}
            />
          )}
          name="phoneNumber"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={"Email"}
              placeholder="Email"
              errors={errors.email?.message}
            />
          )}
          name="email"
          defaultValue=""
        />

        <div className="w-full">
          <Controller
            control={control}
            render={({ field }) => (
              <InputPassword
                {...field}
                type={"password"}
                label={"Password"}
                placeholder="Password"
                errors={errors.password?.message}
              />
            )}
            name="password"
            defaultValue=""
          />
        </div>
      </div>

      <div className="w-full">
        <Button
          disabled={isEmpty}
          className="btn-base blue-normal w-full h-12 flex rounded-b-sm justify-center items-center"
        >
          Register
        </Button>
      </div>
      <div>
        <div className="text-fr-16 text-gray-g3b0 flex gap-2 justify-center">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-white text-fm-16 underline cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </form>
  );
};
export default SignUpForm;
