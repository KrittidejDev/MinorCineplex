import SignUpForm, { FormValues } from "@/components/Forms/SignUpForm";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import RegisterSuccess from "@/components/Widgets/RegisterSuccess";
import React, { useState, useMemo } from "react";
import { userService } from "@/config/userServices";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Signup = () => {
  const { i18n } = useTranslation("common");
  const [success, setSuccess] = useState<boolean>(false);

  const errorMessages = useMemo(() => {
    const isTh = i18n.language === "th";
    return {
      emailExists: isTh ? "อีเมลนี้ถูกใช้งานแล้ว" : "Email already exists",
      emailInvalid: isTh ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email format",
      phoneExists: isTh ? "หมายเลขโทรศัพท์นี้ถูกใช้งานแล้ว" : "Phone number already exists",
      phoneInvalid: isTh ? "หมายเลขโทรศัพท์ไม่ถูกต้อง" : "Invalid phone number",
      usernameExists: isTh ? "ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว" : "Username already exists",
      usernameInvalid: isTh ? "ชื่อผู้ใช้งานไม่ถูกต้อง" : "Invalid username",
      general: isTh ? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" : "An error occurred. Please try again",
    };
  }, [i18n.language]);

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

        let translatedMessage = message;
        
        if (message.toLowerCase().includes("email")) {
          if (message.toLowerCase().includes("exist") || message.toLowerCase().includes("already") || message.toLowerCase().includes("duplicate")) {
            translatedMessage = errorMessages.emailExists;
          } else if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("format")) {
            translatedMessage = errorMessages.emailInvalid;
          }
          setError("email", { type: "server", message: translatedMessage });
        } else if (message.toLowerCase().includes("phone")) {
          if (message.toLowerCase().includes("exist") || message.toLowerCase().includes("already") || message.toLowerCase().includes("duplicate")) {
            translatedMessage = errorMessages.phoneExists;
          } else if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("format")) {
            translatedMessage = errorMessages.phoneInvalid;
          }
          setError("phone", { type: "server", message: translatedMessage });
        } else if (message.toLowerCase().includes("username")) {
          if (message.toLowerCase().includes("exist") || message.toLowerCase().includes("already") || message.toLowerCase().includes("duplicate")) {
            translatedMessage = errorMessages.usernameExists;
          } else if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("format")) {
            translatedMessage = errorMessages.usernameInvalid;
          }
          setError("username", { type: "server", message: translatedMessage });
        } else {
          setError("email", { type: "server", message: errorMessages.general });
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

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default Signup;
