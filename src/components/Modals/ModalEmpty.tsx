import React, { ReactNode } from "react";
import CloseRoundLight from "../Icons/CloseRoundLight";

interface ModalEmptyProps {
  children: ReactNode;
  isShowModal: boolean;
  onClose: () => void;
  isCloseBtn?: boolean;
}

const ModalEmpty = ({
  children,
  isShowModal,
  onClose,
  isCloseBtn = true,
}: ModalEmptyProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
        !isShowModal && "hidden"
      }`}
      onClick={onClose}
    >
      <div className="relative z-[60] p-6 rounded-2xl">
        {isCloseBtn && (
          <div
            className="absolute top-2 right-2 cursor-pointer"
            onClick={onClose}
          >
            <CloseRoundLight />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalEmpty;
