import InputTextFeild from "@/components/Inputs/InputTextFeild";
import ImageUploadButton from "@/components/Inputs/InputPictureProfile";
import { Button } from "@/components/ui/button";
import { useForm, Controller, UseFormSetError } from "react-hook-form";
import { useEffect } from "react";
import { profileValidate } from "@/lib/validate/profileValidate";
import { yupResolver } from "@hookform/resolvers/yup";

export type ProfileFormValues = {
  username: string;
  email: string;
  avatar_url?: string | null;
};

interface ProfileFormProps {
  userData: ProfileFormValues;
  isLoading: boolean;
  onFileSelect: (file: File) => void;
  onSave: (
    values: ProfileFormValues,
    setError: UseFormSetError<ProfileFormValues>
  ) => void;
}
const ProfileForm = ({
  userData,
  isLoading,
  onFileSelect,
  onSave,
}: ProfileFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileValidate),
  });

  useEffect(() => {
    setValue("username", userData?.username);
    setValue("email", userData?.email);
  }, [userData, setValue]);
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
        <Button className="btn-base white-outline-normal w-28 h-12 rounded-sm">
          {isLoading ? "Uploading..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
export default ProfileForm;
