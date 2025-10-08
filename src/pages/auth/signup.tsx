import SignUpForm, { FormValues } from "@/components/Forms/SignUpForm";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import RegisterSuccess from "@/components/Widgets/RegisterSuccess";
import React, { useState } from "react";
import { userService } from "@/config/userServices";

const Signup = () => {
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (
    values: FormValues,
    setError: UseFormSetError<FormValues>
  ) => {
    const data = {
      username: values.username,
      phone: values.phone,
      email: values.email,
      password: values.password,
    }
    try {
      await userService.POST_SIGNUP(data);
      setSuccess(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
        if (message.includes("Email")) {
          setError("email", { type: "server", message });
        }
        if (message.includes("Phone")) {
          setError("phone", { type: "server", message });
        }
        if (message.includes("Username")) {
          setError("username", { type: "server", message });
        }
      }
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      {success ? (
        <div className="w-[380px]">
          <RegisterSuccess />
        </div>
      ) : (
        <div className="w-[380px]">
          <SignUpForm onSubmit={handleRegister} />
        </div>
      )}
    </div>
  );
};

export default Signup;
