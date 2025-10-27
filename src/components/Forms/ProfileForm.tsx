import InputTextFeild from "@/components/Inputs/InputTextFeild";
import ImageUploadButton from "@/components/Inputs/InputPictureProfile";
import { Button } from "@/components/ui/button";
import { useForm, Controller, UseFormSetError } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { profileValidate } from "@/lib/validate/profileValidate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";

export type ProfileFormValues = {
  username: string;
  email: string;
  avatar_url?: string | null;
};

interface ProfileFormProps {
  userData: ProfileFormValues;
  onFileSelect: (file: File) => void;
  onSave: (
    values: ProfileFormValues,
    setError: UseFormSetError<ProfileFormValues>
  ) => void;
}
const ProfileForm = ({
  userData,
  onFileSelect,
  onSave,
}: ProfileFormProps) => {
  const { i18n } = useTranslation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileValidate),
  });

  useEffect(() => {
    setValue("username", userData?.username);
    setValue("email", userData?.email);
  }, [userData, setValue]);

  const texts = useMemo(() => ({
    saving: i18n.language === "th" ? "กำลังบันทึก..." : "Saving...",
    save: i18n.language === "th" ? "บันทึก" : "Save",
  }), [i18n.language]);

  return (
    <form
      onSubmit={handleSubmit((values) => onSave?.(values, setError))}
      className="flex flex-col px-4 gap-6 md:gap-12 justify-start items-start w-full"
    >
      <div>
        <ImageUploadButton
          onFileSelect={onFileSelect}
          avatar_url={userData?.avatar_url ?? null}
        />
      </div>
      <div className="flex flex-col gap-y-5 w-full max-w-[380px]">
        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label={"Username"}
              placeholder="Username"
              errors={errors.username?.message}
            />
          )}
          name="username"
        />
        <Controller
          control={control}
          render={({ field }) => (
            <InputTextFeild
              {...field}
              label="Email"
              placeholder="Email"
              disabled
            />
          )}
          name="email"
        />
        <Button 
          className="btn-base white-outline-normal w-28 h-12 rounded-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? texts.saving : texts.save}
        </Button>
      </div>
    </form>
  );
};
export default ProfileForm;
