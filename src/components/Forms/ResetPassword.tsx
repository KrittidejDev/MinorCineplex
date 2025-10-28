import InputPassword from "../Inputs/InputPassword";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import { createResetPasswordSchema } from "../../lib/validate/authRegister";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

export type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordProps = {
  onSubmit?: (values: FormValues, reset: () => void) => void;
  align?: "center" | "left";
  isLoading?: boolean;
};

const ResetPassword = ({ onSubmit, align, isLoading }: ResetPasswordProps) => {
  const { t } = useTranslation("common");
  const schema = useMemo(() => createResetPasswordSchema(t), [t]);
  
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { newPassword, confirmPassword } = watch();
  const isEmpty = !newPassword || !confirmPassword;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit?.(values, reset);
      })}
      className={`w-full flex flex-col ${align === "center" ? "items-center justify-center gap-10" : "items-start justify-start gap-6"}`}
    >
      <h2 className="text-f-36 text-center text-white">{t("reset_password_title")}</h2>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <Controller
            control={control}
            render={({ field }) => (
              <InputPassword
                {...field}
                type={"password"}
                label={t("reset_password_new_password")}
                placeholder={t("reset_password_new_password_placeholder")}
                errors={errors.newPassword?.message}
              />
            )}
            name="newPassword"
            defaultValue=""
          />
        </div>
        <div className="w-full">
          <Controller
            control={control}
            render={({ field }) => (
              <InputPassword
                {...field}
                type={"password"}
                label={t("reset_password_confirm_password")}
                placeholder={t("reset_password_confirm_password_placeholder")}
                errors={errors.confirmPassword?.message}
              />
            )}
            name="confirmPassword"
            defaultValue=""
          />
        </div>
      </div>
      <div className={`w-full flex ${align === "center" ? "justify-center" : "justify-start"}`}>
        <Button
          disabled={isEmpty || isLoading}
          className={`${align === "center" ? "btn-base blue-normal cursor-pointer" : "btn-base white-outline-normal"} w-full max-w-[182px] h-12 flex rounded-b-sm justify-center items-center`}
        >
          {isLoading ? t("reset_password_loading") : t("reset_password_button")}
        </Button>
      </div>
    </form>
  );
};
export default ResetPassword;
