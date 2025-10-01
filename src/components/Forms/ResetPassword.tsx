import InputPassword from "../Inputs/InputPassword";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import * as yup from "yup";
type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

type SignUpFormProps = {
  onSubmit?: (values: FormValues) => void;
  align?: "center" | "left";
};

const ResetPassword = ({ onSubmit,align }: SignUpFormProps) => {
  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .min(8, "Password must be at least 8 characters")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { newPassword, confirmPassword } = watch();
  const isEmpty = !newPassword || !confirmPassword;

  return (
    <form
      onSubmit={handleSubmit(onSubmit ?? (() => {}))}
      className={`w-full flex flex-col ${align === "center" ? "items-center justify-center gap-10" : "items-start justify-start gap-6" }`}
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
          disabled={isEmpty}
          className={`${align === "center" ? "btn-base blue-normal" : "btn-base white-outline-normal"} w-full max-w-[182px] h-12 flex rounded-b-sm justify-center items-center`}
        >
          Reset Password
        </Button>
      </div>
    </form>
  );
};
export default ResetPassword;
