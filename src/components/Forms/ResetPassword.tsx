import InputPassword from "../Inputs/InputPassword";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import { resetPasswordSchema } from "../../lib/validate/authRegister";
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
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const { newPassword, confirmPassword } = watch();
  const isEmpty = !newPassword || !confirmPassword;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit?.(values, () => reset());
      })}
      className={`w-full flex flex-col ${align === "center" ? "items-center justify-center gap-10" : "items-start justify-start gap-6"}`}
    >
      <h2 className="text-f-36 text-center text-white">Reset Password</h2>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <Controller
            control={control}
            render={({ field }) => (
              <InputPassword
                {...field}
                type={"password"}
                label={"New password"}
                placeholder="New password"
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
                label={"Confirm password"}
                placeholder="Confirm new password"
                errors={errors.confirmPassword?.message}
              />
            )}
            name="confirmPassword"
            defaultValue=""
          />
        </div>
      </div>
      <div className="w-full flex">
        <Button
          disabled={isEmpty || isLoading}
          className={`${align === "center" ? "btn-base blue-normal cursor-pointer" : "btn-base white-outline-normal"} w-full max-w-[182px] h-12 flex rounded-b-sm justify-center items-center`}
        >
          {isLoading ? "Loading..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
};
export default ResetPassword;
