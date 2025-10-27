import InputPassword from "../Inputs/InputPassword";
import InputTextFeild from "../Inputs/InputTextFeild";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/button";
import * as yup from "yup";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";

type FormValues = {
  email: string;
  password: string;
};

type SignUpFormProps = {
  onSubmit?: (values: FormValues) => void;
};

const SignInForm = ({ onSubmit }: SignUpFormProps) => {
  const { i18n } = useTranslation();
  const texts = useMemo(() => ({
    email: i18n.language === "th" ? "อีเมล" : "Email",
    password: i18n.language === "th" ? "รหัสผ่าน" : "Password",
    forgetPassword: i18n.language === "th" ? "ลืมรหัสผ่าน" : "Forget password",
    login: i18n.language === "th" ? "เข้าสู่ระบบ" : "Login",
    register: i18n.language === "th" ? "สมัครสมาชิก" : "Register",
    dontHaveAccount: i18n.language === "th" ? "คุณยังไม่มีบัญชี?" : "Don't you have any account?",
    loading: i18n.language === "th" ? "กำลังโหลด..." : "Loading...",
  }), [i18n.language]);

  const schema = useMemo(() => {
    const emailLabel = i18n.language === "th" ? "อีเมล" : "Email";
    const passwordLabel = i18n.language === "th" ? "รหัสผ่าน" : "Password";
    
    return yup.object().shape({
      email: yup
        .string()
        .required(`${emailLabel} is required`)
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, `${emailLabel} is invalid`),
      password: yup
        .string()
        .required(`${passwordLabel} is required`)
        .min(8, `${passwordLabel} must be at least 8 characters`),
    });
  }, [i18n.language]);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { email, password } = watch();
  const isEmpty = !email || !password;

  return (
    <form
      key={i18n.language}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit ?? (() => {}))}
      className="w-full flex flex-col items-center gap-10"
    >
      <h2 className="text-f-36 text-center text-white">{texts.login}</h2>
      <div className="w-full flex flex-col gap-4">
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
      </div>

      <div className="w-full">
        <Link href="/auth/forgot-password" className="text-white underline text-fm-16">
          {texts.forgetPassword}?
        </Link>
      </div>
      <div className="w-full">
        <Button
          disabled={isEmpty || isSubmitting}
          className={`btn-base blue-normal cursor-pointer w-full h-12 flex rounded-b-sm justify-center items-center ${
            (isEmpty || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? texts.loading : texts.login}
        </Button>
      </div>
      <div className="text-fr-16 text-gray-g3b0 flex gap-2 justify-center">
        {texts.dontHaveAccount}
        <Link
          href="/auth/signup"
          className="text-white text-fm-16 underline cursor-pointer"
        >
          {texts.register}
        </Link>
      </div>
    </form>
  );
};
export default SignInForm;
