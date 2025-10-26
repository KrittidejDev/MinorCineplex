import InputTextFeild from "../Inputs/InputTextFeild";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import * as yup from "yup";
import Link from "next/link";
import { useState } from "react";

type FormValues = {
  email: string;
};

type ForgotPasswordFormProps = {
  onSubmit?: (values: FormValues) => void;
};

const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { email } = watch();
  const isEmpty = !email;

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await onSubmit?.(values);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        <h2 className="text-f-36 text-center text-white">Check Your Email</h2>
        <div className="text-center text-white">
          <p className="text-fm-16 mb-4">
            We&apos;ve sent a password reset link to your email address.
          </p>
          <p className="text-fr-14 text-gray-g3b0">
            Please check your email and click the link to reset your password.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="text-white underline text-fm-16"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full flex flex-col items-center gap-10"
    >
      <h2 className="text-f-36 text-center text-white">Forgot Password</h2>
      <div className="w-full flex flex-col gap-4">
        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={"Email"}
              placeholder="Enter your email"
              errors={errors.email?.message}
            />
          )}
          name="email"
          defaultValue=""
        />
      </div>

      <div className="w-full">
        <Button
          disabled={isEmpty || isSubmitting}
          className="btn-base blue-normal cursor-pointer w-full h-12 flex rounded-b-sm justify-center items-center"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </div>

      <div className="text-fr-16 text-gray-g3b0 flex gap-2 justify-center">
        Remember your password?
        <Link
          href="/auth/login"
          className="text-white text-fm-16 underline cursor-pointer"
        >
          Login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;