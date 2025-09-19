import React from "react";
import SignInForm from "@/components/Forms/SignInForm";

const login = () => {

  
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-[380px]">
        <SignInForm/>
      </div>
    </div>
  );
};

export default login;
