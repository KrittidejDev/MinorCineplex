import { useState } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import ResetPassword, { FormValues } from "@/components/Forms/ResetPassword";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { userService } from "@/config/userServices";
import { toast } from "react-toastify";

const ResetPasswordUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const handleResetPassword = async (values: FormValues, reset: () => void) => {
    try {
      setIsLoading(true);
      if (!session?.user.id) {
        throw new Error("User not found");
      }
      await userService.RESET_PASSWORD({
        id: session?.user.id,
        newPassword: values.newPassword,
      });
      toast.success("Password reset successfully");
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBarWidget />
      <div className="bg-blue-b flex flex-col">
        <div className="flex-1 top-21 transition-all duration-500 ease-in-out py-10 md:pl-20 md:py-15 xl:pl-56 ">
          <div className="w-full max-w-[1129px] flex flex-col md:flex-row h-full gap-4 md:gap-12 ">
            {/* ProfileBar */}
            <div className="w-full md:min-w-[240px] md:max-w-[257px]">
              <ProfileBar />
            </div>
            {/* Content - Full Width Container */}
            <div className="flex items-center px-4 justify-center md:justify-start md:items-start w-full max-w-[380px] md:min-w-[380px]">
              <ResetPassword
                align="left"
                onSubmit={handleResetPassword}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordUser;
