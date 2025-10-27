import InputPassword from "../Inputs/InputPassword";
import InputTextFeild from "../Inputs/InputTextFeild";
import { UseFormSetError } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import { createSignupFormSchema } from "../../lib/validate/authRegister";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

export type FormValues = {
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpFormProps = {
  onSubmit?: (
    values: FormValues,
    setError: UseFormSetError<FormValues>
  ) => void;
};

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {

  const { i18n } = useTranslation();

  const schema = useMemo(() => createSignupFormSchema(i18n.language), [i18n.language]);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors,isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { username, email, password } = watch();
  const isEmpty = !username || !email || !password;

  const texts = useMemo(() => ({
    username: i18n.language === "th" ? "ชื่อผู้ใช้งาน" : "Username",
    email: i18n.language === "th" ? "อีเมล" : "Email",
    phone: i18n.language === "th" ? "หมายเลขโทรศัพท์" : "Phone Number",
    password: i18n.language === "th" ? "รหัสผ่าน" : "Password",
    confirmPassword: i18n.language === "th" ? "ยืนยันรหัสผ่าน" : "Confirm Password",
    register: i18n.language === "th" ? "สมัครสมาชิก" : "Register",
    alreadyHaveAccount: i18n.language === "th" ? "คุณมีบัญชีแล้ว?" : "Already have an account?",
    login: i18n.language === "th" ? "เข้าสู่ระบบ" : "Login",
    loading: i18n.language === "th" ? "กำลังโหลด..." : "Loading...",
  }), [i18n.language]);
  return (
    <form
      key={i18n.language}
      onSubmit={handleSubmit((values) => onSubmit?.(values, setError))}
      className="max-w-[380px] flex flex-col items-center gap-10"
    >
      <h2 className="text-f-36 text-center text-white">{texts.register}</h2>
      <div className="w-full flex flex-col gap-4">
        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={texts.username}
              placeholder={texts.username}
              errors={errors.username?.message}
            />
          )}
          name="username"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={texts.email}
              placeholder={texts.email}
              errors={errors.email?.message}
            />
          )}
          name="email"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={texts.phone}
              placeholder={texts.phone}
              maxLength={15}
              errors={errors.phone?.message}
            />
          )}
          name="phone"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputPassword
              {...field}
              type={"password"}
              label={texts.password}
              placeholder={texts.password}
              errors={errors.password?.message}
            />
          )}
          name="password"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputPassword
              {...field}
              type={"password"}
              label={texts.confirmPassword}
              placeholder={texts.confirmPassword}
              errors={errors.confirmPassword?.message}
            />
          )}
          name="confirmPassword"
          defaultValue=""
        />
      </div>

      <div className="w-full">
        <Button
          disabled={isEmpty || isSubmitting}
          className={`btn-base blue-normal cursor-pointer w-full h-12 flex rounded-b-sm justify-center items-center ${
            (isEmpty || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? texts.loading : texts.register}
        </Button>
      </div>
      <div>
        <div className="text-fr-16 text-gray-g3b0 flex gap-2 justify-center">
          {texts.alreadyHaveAccount}
          <Link
            href="/auth/login"
            className="text-white text-fm-16 underline cursor-pointer"
          >
            {texts.login}
          </Link>
        </div>
      </div>
    </form>
  );
};
export default SignUpForm;
