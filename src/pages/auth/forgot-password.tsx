import ForgotPasswordForm from "@/components/Forms/ForgotPasswordForm";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", values);
      const data = response.data;

      if (data.resetLink) {
        toast.success("Reset link sent to your email");
      }
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
      } else {
        toast.error(error instanceof Error ? error.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-[380px]">
        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ForgotPassword;