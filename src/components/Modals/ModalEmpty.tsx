import React, { ReactNode } from "react";

interface ModalEmptyProps {
  children: ReactNode;
  isShowModal: boolean;
  onClose: () => void;
  isCloseBtn?: boolean;
}

const ModalEmpty = ({ children, isShowModal, onClose }: ModalEmptyProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
        !isShowModal && "hidden"
      }`}
      onClick={onClose}
    >
      <div
        className="relative z-[60] p-6 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalEmpty;
