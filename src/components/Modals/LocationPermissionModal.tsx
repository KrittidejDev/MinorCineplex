import React from "react";
import LocationPopupIcon from "../Icons/LocationPopupIcon";

interface Props {
  isOpen: boolean;
  onAllowSession: () => void;
  onAllowOnce: () => void;
  onNeverAllow: () => void;
  onClose: () => void;
}

const LocationPermissionModal: React.FC<Props> = ({
  isOpen,
  onAllowSession,
  onAllowOnce,
  onNeverAllow,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed flex flex-col top-6 left-6 z-50 bg-[#1A1B20] text-white  w-[359px] shadow-lg p-6 rounded-2xl ">
      <div className=" relative mb-6">
        <div className="text-lg font-medium">
          www.minorcineplex.com
          <br />
          wants to
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center gap-1 mb-4">
        <LocationPopupIcon />
        <div className="text-fm-16 text-[#C6C6CC]">Know your location</div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={onAllowSession}
          className="w-full py-3 rounded-full bg-[#323237] hover:bg-gray-700 text-center text-fm-16 text-[#A7B1B8]"
        >
          Allow while visiting the site
        </button>
        <button
          onClick={onAllowOnce}
          className="w-full py-3 rounded-full bg-[#323237] hover:bg-gray-700 text-center text-fm-16 text-[#A7B1B8]"
        >
          Allow this time
        </button>
        <button
          onClick={onNeverAllow}
          className="w-full py-3 rounded-full bg-[#323237] hover:bg-gray-700 text-center text-fm-16 text-[#A7B1B8]"
        >
          Never allow
        </button>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
