import OutLight from "../Icons/OutLight";
import { useState } from "react";
import ShareModal from "./ShareModal";
import { toast } from "react-toastify";
interface ShareButtonProps {
  text?: string;
  color?: string;
}
const ShareButton = ({ text, color }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShareFacebook = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };
  const handleShareMessenger = () => {
    navigator.clipboard.writeText(window.location.href);
    window.open("https://www.messenger.com", "_blank", "width=600,height=400");
  };
  const handleShareTwitter = () => {
    const url = window.location.href;
    const text = "Let's watch together! Join me & book now! ";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };
  const handleShareLine = () => {
    const url = window.location.href;
    const text = "Let's watch together! Join me & book now! ";
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + "\n\n" + url)}`;
    window.open(lineUrl, "_blank", "width=600,height=400");
  };

  const handleShareCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
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
        color={color || "white"}
        className="cursor-pointer"
      />
      <span className="text-fm-16 font-bold text-white hover:underline cursor-pointer">
        {text || ""}
      </span>
      {isOpen && (
        <div className="w-ful max-w-[432px]">
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
