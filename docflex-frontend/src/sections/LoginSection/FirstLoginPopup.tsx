import React, { useState } from "react";
import FirstLoginForm from "./FirstLoginForm";
import { IoClose } from "react-icons/io5";

interface FirstLoginPopupProps {
  userName: string;
  isOpen: boolean;
  onClose?: () => void;
}

const FirstLoginPopup: React.FC<FirstLoginPopupProps> = ({
  userName,
  isOpen,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md">
      <div className="relative p-6 rounded-lg shadow-sm bg-white w-full max-w-md">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-red-400 hover:text-red-700 focus:outline-none"
        >
          <IoClose size={22} />
        </button>

        <FirstLoginForm userName={userName} onSuccess={handleClose} />
      </div>
    </div>
  );
};

export default FirstLoginPopup;
