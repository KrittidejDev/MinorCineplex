import InputPassword from "../Inputs/InputPassword";
import InputTextFeild from "../Inputs/InputTextFeild";
import { UseFormSetError } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import { signupFormSchema } from "../../lib/validate/authRegister";
import Link from "next/link";

export type FormValues = {
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpFormProps = {
  onSubmit?: (
    values: FormValues,
    setError: UseFormSetError<FormValues>
  ) => void;
};

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors,isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(signupFormSchema),
  });

  const { username, email, password } = watch();
  const isEmpty = !username || !email || !password;

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit?.(values, setError))}
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
              label={"Email"}
              placeholder="Email"
              errors={errors.email?.message}
            />
          )}
          name="email"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={"Phone Number"}
              placeholder="Phone Number"
              maxLength={15}
              errors={errors.phone?.message}
            />
          )}
          name="phone"
          defaultValue=""
        />

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

        <Controller
          control={control}
          render={({ field }) => (
            <InputPassword
              {...field}
              type={"password"}
              label={"Confirm Password"}
              placeholder="confirm Password"
              errors={errors.confirmPassword?.message}
            />
          )}
          name="confirmPassword"
          defaultValue=""
        />
      </div>

      <div className="w-full">
        <Button
          disabled={isEmpty || isSubmitting}
          className="btn-base blue-normal w-full h-12 flex rounded-b-sm justify-center items-center"
        >
          {isSubmitting ? "Loading..." : "Register"}
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
