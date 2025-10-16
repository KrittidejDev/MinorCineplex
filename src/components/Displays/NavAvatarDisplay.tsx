import Image from "next/image";
import ArrowDown from "../Icons/ArrowDown";
import { UserDataResponse } from "@/types/user";
import UserDuotone from "../Icons/UserDuotone";


interface AvatarDisplayProps {
  data?: UserDataResponse | null;
  className?: string;
  _isOpen: boolean;
  _handleOpen: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  data,
  className,
  _handleOpen,
}) => {
 
  return (
    <div className={`${className} relative`} >
      <div className="flex items-center gap-x-2.5 " onClick={_handleOpen}>
        <div className={"w-12 h-12 rounded-full overflow-hidden"}>
          {data?.avatar_url ? (
            <Image
              src={data.avatar_url}
              alt="avatar"
              className="object-cover object-center w-full h-full"
              width={48}
              height={48}
            />
          ) : (
            <UserDuotone width={48} height={48} />
          )}
        </div>
        <div className="flex flex-nowrap items-center gap-x-1.5 text-white">
          <span className=" max-w-[10ch] overflow-hidden whitespace-nowrap text-ellipsis">
            {data?.username}
          </span>
          <ArrowDown />
        </div>
      </div>
    </div>
  );
};
