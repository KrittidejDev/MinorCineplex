import { useState } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import ResetPassword, { FormValues } from "@/components/Forms/ResetPassword";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { SuccessAlert } from "@/components/ui/alert";

const ResetPasswordUser = () => {
  const [isAlert, setIsAlert] = useState(false);
  const { data: session } = useSession();
  const handleResetPassword = async (values: FormValues, reset: () => void) => {
    try {
      if (!session?.user.id) {
        throw new Error("User not found");
      }
      await axios.patch(`http://localhost:3000/api/auth/resetpassword`, {
        id: session?.user.id,
        newPassword: values.newPassword,
      });
      reset();
      setIsAlert(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  return (
    <>
    <NavBarWidget />
    <div className="bg-blue-b flex flex-col min-h-[100dvh] lg:px-50">
      
      <div className="flex-1 top-21 transition-all duration-500 ease-in-out py-10 md:pl-20 md:py-15 xl:pl-56 ">
        <div className="w-full max-w-[1129px] flex flex-col md:flex-row h-full gap-4 md:gap-12 ">
          {/* ProfileBar */}
          <div className="w-full md:min-w-[240px] md:max-w-[257px]">
            <ProfileBar />
          </div>
          {/* Content - Full Width Container */}
          <div className="flex items-center px-4 justify-center md:justify-start md:items-start w-full max-w-[380px] md:min-w-[380px]">
            <ResetPassword align="left" onSubmit={handleResetPassword} />
          </div>
        </div>
      </div>
      <div className="absolute right-5 bottom-5">
        {isAlert && (
          <SuccessAlert
            onClick={() => setIsAlert(false)}
            header="Reset password success"
            text="Your password has been reset successfully"
          />
        )}
      </div>
    </div>
    </>
  );
};

export default ResetPasswordUser;
