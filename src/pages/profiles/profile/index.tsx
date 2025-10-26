import React, { useState, useEffect, useCallback } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import { useSession } from "next-auth/react";
import ProfileForm, { ProfileFormValues } from "@/components/Forms/ProfileForm";
import { UpdateProfileParams, userService } from "@/config/userServices";
import { AxiosError } from "axios";
import { UseFormSetError } from "react-hook-form";
import { SuccessAlert } from "@/components/ui/alert";
import { UserDataResponse } from "@/types/user";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface ResponseType {
  status: number;
  docs: UserDataResponse;
}

interface FileUploadResponse {
  url: string;
  public_id: string;
  originalname: string;
  size: number;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserDataResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const id = session?.user?.id;

  const fetchMe = useCallback(async () => {
    if (!id) return;
    try {
      const res = (await userService.GET_MY_PROFILE(id)) as ResponseType;
      setUserData(res.docs);
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchMe();
  }, [id, fetchMe]);

  const clearSuccessAlert = () => setIsSuccessAlert(false);

  const handleSaveProfile = async (
    data: ProfileFormValues,
    setError: UseFormSetError<ProfileFormValues>
  ) => {
    if (!session?.user?.id) return;
    try {
      let avatarUrl: string | null = null;
      let publicId: string | null = null;
      const oldPublicId = userData?.avatar_id ?? null;

      if (selectedFile) {
        const uploadResponse = (await userService.POST_FILE_UPLOAD({
          file: selectedFile,
        })) as FileUploadResponse;
        avatarUrl = uploadResponse.url;
        publicId = uploadResponse.public_id;
      }

      const formData: UpdateProfileParams = {
        username: data.username,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        ...(publicId && { avatar_id: publicId }),
      };

      await userService.PUT_UPDATE_PROFILE(session.user.id, formData);

      if (selectedFile && oldPublicId) {
        try {
          await userService.DELETE_FILE(oldPublicId);
        } catch (error) {
          console.log("Failed to delete old avatar:", error);
        }
      }

      await fetchMe();
      setIsSuccessAlert(true);
      setSelectedFile(null);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
        if (message.includes("Username")) {
          setError("username", { type: "server", message });
        }
      }
      console.log("Save failed:", error);
    }
  };

  return (
    <div className="bg-blue-b flex flex-col">
      <NavBarWidget />
      <div className="w-full flex flex-col md:flex-row max-w-[1129px] items-start gap-6 md:gap-12 top-21 transition-all duration-500 ease-in-out py-10 pl-4 lg:pl-20 md:py-15 xl:pl-56">
        <div className="w-full md:max-w-[257px]">
          <ProfileBar />
        </div>

        <div className="flex flex-col px-4 gap-6 md:gap-12 justify-start items-start w-full max-w-[380px] md:max-w-[711px]">
          <div className="text-f-36 text-white">
            {/* ใช้ i18n แปล */}Profile
          </div>

          <div className="text-[#8B93B0] text-sm sm:text-base">
            {/* แปลภาษา */}
            Keep your personal details private. Information you add here is
            visible to anyone who can view your profile
          </div>
          <ProfileForm
            userData={userData as UserDataResponse}
            onFileSelect={setSelectedFile}
            onSave={handleSaveProfile}
          />
        </div>
      </div>

      <div className="absolute bottom-5 right-5">
        {isSuccessAlert && (
          <SuccessAlert
            header="Profile updated successfully"
            text="Your profile has been updated successfully"
            onClick={clearSuccessAlert}
          />
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default ProfilePage;
