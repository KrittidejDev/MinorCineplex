import React, { useState } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import { useSession } from "next-auth/react";
import ProfileForm, { ProfileFormValues } from "@/components/Forms/ProfileForm";

type User = {
  username: string;
  email: string;
};

const ProfilePage = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);

  const handleImageUploaded = (url: string, pid: string) => {
    setAvatarUrl(url);
    setPublicId(pid);
  };

  const handleSave = async (data: ProfileFormValues) => {

    console.log(data);
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
          <ProfileForm user={user} onImageUpload={handleImageUploaded} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
