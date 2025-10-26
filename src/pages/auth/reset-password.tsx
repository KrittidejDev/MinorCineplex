import ResetPassword from "@/components/Forms/ResetPassword";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import Link from "next/link";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { email: emailParam, token } = router.query;

      if (emailParam && typeof emailParam === "string") {
        setEmail(emailParam);
      }

      if (token && typeof token === "string") {
        const parts = token.split("-");
        if (parts.length === 2) {
          const timestamp = parseInt(parts[1]);
          const now = Date.now();
          const expiresIn = 60 * 60 * 1000;

          if (now - timestamp > expiresIn) {
            setIsExpired(true);
          }
        }
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (
    values: { newPassword: string; confirmPassword: string },
    reset: () => void
  ) => {
    if (!email) {
      alert("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/resetpassword", {
        email,
        newPassword: values.newPassword,
      });

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password reset successfully!");
      reset();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
      } else {
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isExpired) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-[380px] text-center text-white">
          <h2 className="text-f-36 mb-4">Link Expired</h2>
          <p className="text-fm-16 mb-4">
            This reset link has expired. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-white underline text-fm-16"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-[380px] text-center text-white">
          <h2 className="text-f-36 mb-4">Invalid Reset Link</h2>
          <p className="text-fm-16 mb-4">This reset link is invalid.</p>
          <Link
            href="/auth/forgot-password"
            className="text-white underline text-fm-16"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBarWidget />
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-[380px]">
          <ResetPassword
            onSubmit={handleSubmit}
            isLoading={isLoading}
            align="center"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
