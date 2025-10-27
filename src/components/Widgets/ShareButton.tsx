import OutLight from "../Icons/OutLight";
import { useState } from "react";
import ShareModal from "./ShareModal";
import { toast } from "react-toastify";

interface ShareButtonProps {
  publicId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ publicId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const customUrl = `${window.location.origin}/booking/detail/${publicId}`;

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(customUrl)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleShareMessenger = () => {
    navigator.clipboard.writeText(customUrl);
    window.open("https://www.messenger.com", "_blank", "width=600,height=400");
  };

  const handleShareTwitter = () => {
    const text = "Let's watch together! Join me & book now! ";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + customUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleShareLine = () => {
    const text = "Let's watch together! Join me & book now! ";
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + "\n\n" + customUrl)}`;
    window.open(lineUrl, "_blank", "width=600,height=400");
  };

  const handleShareCopyLink = () => {
    navigator.clipboard.writeText(customUrl);
    toast.success("Link copied to clipboard");
  };

  const handleShare = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="flex items-center justify-center gap-1.5"
      onClick={handleShare}
    >
      <OutLight
        width="30"
        height="30"
        color="white"
        className="cursor-pointer"
      />
      <span className="text-fm-16 font-bold text-white hover:underline cursor-pointer">
        Share This Booking
      </span>
      {isOpen && (
        <div className="w-full max-w-[432px]">
          <ShareModal
            isOpen={isOpen}
            handleShare={handleShare}
            handleShareFacebook={handleShareFacebook}
            handleShareMessenger={handleShareMessenger}
            handleShareTwitter={handleShareTwitter}
            handleShareCopyLink={handleShareCopyLink}
            handleShareLine={handleShareLine}
          />
        </div>
      )}
    </div>
  );
};

export default ShareButton;
