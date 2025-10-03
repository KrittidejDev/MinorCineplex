import React, { useState, useEffect } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import { useSession } from "next-auth/react";
import ProfileForm, { ProfileFormValues } from "@/components/Forms/ProfileForm";
import { UpdateProfileParams, userService } from "@/config/userServices";

interface User {
  username: string;
  email: string;
  id: string;
  avatar_id: string | null;
  avatar_url: string | null;
}

interface FileUploadResponse {
  url: string;
  public_id: string;
  originalname: string;
  size: number;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const id = session?.user?.id;
  const user = session?.user as User;
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMe = async () => {
    if (!id) return;
    try {
      const res = await userService.GET_MY_PROFILE(id);
      setUserData(res.docs);
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  console.log(userData);

  useEffect(() => {
    if (id) {
      fetchMe();
    }
  }, [id]);

  const handleSaveProfile = async (data: ProfileFormValues) => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      let avatarUrl = null;
      let publicId = null;
      const oldPublicId = user?.avatar_id as string | null;

      if (selectedFile) {
        //Upload รูปภาพ
        const uploadResponse = (await userService.POST_FILE_UPLOAD({
          file: selectedFile,
        })) as FileUploadResponse;
        avatarUrl = uploadResponse.url;
        publicId = uploadResponse.public_id;
      }
      //Update Profile
      const formData: UpdateProfileParams = {
        username: data.username,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        ...(publicId && { avatar_id: publicId }),
      };
      await userService.PUT_UPDATE_PROFILE(session.user.id, formData);

      if (selectedFile && oldPublicId) {
        //Delete รูปภาพเก่า
        try {
          await userService.DELETE_FILE(oldPublicId);
        } catch (error) {
          console.log("Failed to delete old avatar:", error);
        }
      }
    } catch (error) {
      console.log("Save failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-b flex flex-col">
      <NavBarWidget />

      <div
        className="w-full flex flex-col md:flex-row max-w-[1129px] items-start gap-6 md:gap-12 top-21 transition-all duration-500 ease-in-out 
      py-10 md:pl-20 md:py-15 xl:pl-56"
      >
        {/* ProfileBar */}
        <div className="w-full md:min-w-[240px] md:max-w-[257px]">
          <ProfileBar />
        </div>

        {/* Content */}
        <div className="flex flex-col px-4 gap-6 md:gap-12 justify-start items-start w-full max-w-[380px] md:min-w-[450px] md:max-w-[711px]">
          <div className="text-f-36 text-white">Profile</div>

          <div className="text-[#8B93B0] text-sm sm:text-base">
            Keep your personal details private. Information you add here is
            visible to anyone who can view your profile
          </div>
          <ProfileForm
            userData={userData as User}
            onFileSelect={setSelectedFile}
            onSave={handleSaveProfile}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
