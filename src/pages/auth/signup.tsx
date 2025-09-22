import SignUpForm from "@/components/Forms/SignUpForm";
import axios, { AxiosError } from "axios";
import RegisterSuccess from "@/components/Widgets/RegisterSuccess";
import React, { useState } from "react";

const Signup = () => {
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (values: {
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          username: values.username,
          phone: values.phoneNumber,
          email: values.email,
          password: values.password,
        }
      );
      console.log("Register success:", response.data);
      setSuccess(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Register failed:",
          error.response?.data || error.message
        );
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
