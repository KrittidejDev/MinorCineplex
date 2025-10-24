import FacebookIcon from "../Icons/FacebookIcon";
import LineIcon from "../Icons/LineIcon";
import CopyLight from "../Icons/CopyLight";
import EmptyModal from "../Modals/ModalEmpty";
import MessengerIcon from "./MessengerIcon";
import TwitterIcon from "./TwitterIcon";

const ShareModal = ({
  isOpen,
  handleShare,
  handleShareFacebook,
  handleShareMessenger,
  handleShareTwitter,
  handleShareCopyLink,
  handleShareLine,
}: {
  isOpen: boolean;
  handleShare: () => void;
  handleShareFacebook: () => void;
  handleShareMessenger: () => void;
  handleShareTwitter: () => void;
  handleShareCopyLink: () => void;
  handleShareLine: () => void;
}) => {
  const shareOptions = [
    {
      id: 'line',
      name: 'Line',
      icon: LineIcon,
      onClick: handleShareLine,
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: MessengerIcon,
      onClick: handleShareMessenger,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FacebookIcon,
      onClick: handleShareFacebook,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: TwitterIcon,
      onClick: handleShareTwitter,
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: CopyLight,
      onClick: handleShareCopyLink,
    },
  ];

  return (
    <EmptyModal isShowModal={isOpen} onClose={handleShare}>
      <div
        className="w-full max-w-[432px] p-4 flex flex-col bg-gray-g63f rounded-xl 
      shadow-[4px_4px_30px_0px_rgba(0,0,0,0.5)] items-center justify-center gap-2"
      >
        <h2 className="text-fm-16 font-bold text-white">Share Booking</h2>
        <div className="flex items-center justify-center gap-2 w-full max-w-[400px]">
          {shareOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div key={option.id} className="flex flex-col items-center justify-center gap-1 w-20">
                <div className="flex items-center justify-center rounded-full h-10 w-10 bg-black cursor-pointer">
                  <IconComponent width="20" height="20" onClick={option.onClick} />
                </div>
                <p className="text-fr-14 text-gray-gedd">{option.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </EmptyModal>
  );
};
export default ShareModal;
