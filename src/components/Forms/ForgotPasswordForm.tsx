import InputTextFeild from "../Inputs/InputTextFeild";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import * as yup from "yup";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "next-i18next";

type FormValues = {
  email: string;
};

type ForgotPasswordFormProps = {
  onSubmit?: (values: FormValues) => void;
  isLoading?: boolean;
};

const ForgotPasswordForm = ({ onSubmit, isLoading }: ForgotPasswordFormProps) => {
  const { t } = useTranslation("common");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(t("forgot_password_email_required"))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("forgot_password_invalid_email")),
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { email } = watch();
  const isEmpty = !email;

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await onSubmit?.(values);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        <h2 className="text-f-36 text-center text-white">{t("forgot_password_check_email")}</h2>
        <div className="text-center text-white">
          <p className="text-fm-16 mb-4">
            {t("forgot_password_reset_link_sent")}
          </p>
          <p className="text-fr-14 text-gray-g3b0">
            {t("forgot_password_check_email_instructions")}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="text-white underline text-fm-16"
        >
          {t("forgot_password_back_to_login")}
        </Link>
      </div>
    );
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full flex flex-col items-center gap-10"
    >
      <h2 className="text-f-36 text-center text-white">{t("forgot_password")}</h2>
      <div className="w-full flex flex-col gap-4">
        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={t("forgot_password_email")}
              placeholder={t("forgot_password_email_placeholder")}
              errors={errors.email?.message}
            />
          )}
          name="email"
          defaultValue=""
        />
      </div>

      <div className="w-full">
        <Button
          disabled={isEmpty || isSubmitting || isLoading}
          className="btn-base blue-normal cursor-pointer w-full h-12 flex rounded-b-sm justify-center items-center"
        >
          {(isSubmitting || isLoading) ? t("forgot_password_sending") : t("forgot_password_send_link")}
        </Button>
      </div>

      <div className="text-fr-16 text-gray-g3b0 flex gap-2 justify-center">
        {t("forgot_password_remember_password")}
        <Link
          href="/auth/login"
          className="text-white text-fm-16 underline cursor-pointer"
        >
          {t("login")}
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;