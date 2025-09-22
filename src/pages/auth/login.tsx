import React from "react";
import SignInForm from "@/components/Forms/SignInForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const handleLogin = async (value: { email: string; password: string }) => {
    console.log(value.email, value.password);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: value.email,
        password: value.password,
      });
      console.log(result);
      if (result?.ok) {
        console.log("Credentials is Valid");
        // router.push("/");
      } else {
        console.log("Invalid credentials");
      }
    } catch (err: any) {
      console.error("Register failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-[380px]">
        <SignInForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
