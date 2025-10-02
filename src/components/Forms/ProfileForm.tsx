import InputTextFeild from "@/components/Inputs/InputTextFeild";
import ImageUploadButton from "@/components/Inputs/InputPictureProfile";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export type ProfileFormValues = {
  username: string;
  email: string;
};

interface ProfileFormProps {
  user: ProfileFormValues;
  avatarUrl?: string | null;
  onImageUpload: (url: string, publicId: string) => void;
  onSave: (data: ProfileFormValues) => void;
}

const ProfileForm = ({
  user,
  avatarUrl,
  onImageUpload,
  onSave,
}: ProfileFormProps) => {
  const { register, handleSubmit } = useForm<ProfileFormValues>();

  const onSubmit = (data: ProfileFormValues) => {
    onSave(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col px-4 gap-6 md:gap-12 justify-start items-start w-full"
    >
      <div>
        <ImageUploadButton />
      </div>
      <div className="flex flex-col gap-y-5 w-full max-w-[380px]">
        <InputTextFeild
          {...register("username")}
          label="Username"
          placeholder="Username"
          value={user?.username ?? ""}
        />
        <InputTextFeild
          {...register("email")}
          label="Email"
          placeholder="Email"
          disabled
          value={user?.email ?? ""}
        />
        <Button className="btn-base white-outline-normal max-w-[111px] max-h-[48px]">
          Save
        </Button>
      </div>
    </form>
  );
};
export default ProfileForm;
