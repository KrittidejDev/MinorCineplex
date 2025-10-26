import ForgotPasswordForm from "@/components/Forms/ForgotPasswordForm";
import { useState } from "react";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }
      if (data.resetLink) {
        console.log("Reset Link:", data.resetLink);
        alert(`Reset Link: ${data.resetLink}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-[380px]">
        <ForgotPasswordForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ForgotPassword;