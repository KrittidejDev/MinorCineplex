import InputPassword from "../Inputs/InputPassword";
import InputTextFeild from "../Inputs/InputTextFeild";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import * as yup from "yup";
import Link from "next/link";
import { DefaultCheckbox } from "../ui/checkbox";


type FormValues = {
  email: string;
  password: string;
};

type SignUpFormProps = {
  onSubmit?: (values: FormValues) => void;
};

const SignInForm = ({ onSubmit }: SignUpFormProps) => {

  const schema = yup.object().shape({
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
    formState: { errors,isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { email, password } = watch();
  const isEmpty = !email || !password;

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit ?? (() => {}))}
      className="max-w-[380px] flex flex-col items-center gap-10"
    >
      <h2 className="text-f-36 text-center text-white">Login</h2>
      <div className="w-full flex flex-col gap-4">
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

      <div className="w-full flex justify-between">
        <DefaultCheckbox label="Remember" />
        <Link href="/" className="text-white underline text-fm-16">
          Forget password?
        </Link>
      </div>
      <div className="w-full">
        <Button
          disabled={isEmpty || isSubmitting}
          className="btn-base blue-normal cursor-pointer w-full h-12 flex rounded-b-sm justify-center items-center"
        >
          {isSubmitting ? "Loading..." : "Login"}
        </Button>
      </div>
      <div className="text-fr-16 text-gray-g3b0 flex gap-2 justify-center">
        {"Don't you have any account?"}
        <Link
          href="/auth/signup"
          className="text-white text-fm-16 underline cursor-pointer"
        >
          Register
        </Link>
      </div>
    </form>
  );
};
export default SignInForm;
