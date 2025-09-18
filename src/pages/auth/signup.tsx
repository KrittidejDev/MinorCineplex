import SignUpForm from "@/components/Forms/SignUpForm";
// import RegisterSuccess from "@/components/Widgets/RegisterSuccess";
import React from "react";



const signup = () => {

  
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-[380px]">
        <SignUpForm/>
      </div>
      {/* <div className="w-[380px]">
        <RegisterSuccess/>
      </div> */}
    </div>
  );
};

export default signup;
