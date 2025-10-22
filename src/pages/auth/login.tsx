import React, { useState } from "react";
import SignInForm from "@/components/Forms/SignInForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { ErrorAlert } from "@/components/ui/alert";

const Login = () => {
  const router = useRouter();
  const [isAlert, setIsAlert] = useState(false);

  const handleLogin = async (value: { email: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: value.email,
        password: value.password,
      });
      if (result?.ok) {
        router.push("/");
      } else {
        setIsAlert(true);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log("Register failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative">
      <div className="w-[380px]">
        <SignInForm onSubmit={handleLogin} />
      </div>
      <div className="absolute right-5 bottom-5">
        {isAlert && (
          <ErrorAlert
            onClick={() => setIsAlert(false)}
            header="Your password is incorrect or this email doesn’t exist"
            text="Please try another password or email"
          />
        )}
      </div>
    </div>
  );
};

export default Login;
