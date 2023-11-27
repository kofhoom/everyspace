import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { IconType } from "react-icons/lib";

interface CopyToClipboardButtonProps {
  text: string;
  onCopy?: () => void;
  children: React.ReactNode;
  icon?: IconType;
  classNames?: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  text,
  onCopy,
  children,
  icon: IconComponent,
  classNames = "py-1 rounded-xl px-3",
}) => {
  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      <div
        className={`transition hover:border-black cursor-pointer flex items-center border ${classNames}`}
        style={{
          boxShadow: "0 2px 0 rgba(5, 145, 255, 0.1)",
          fontSize: "14px",
        }}
      >
        {IconComponent && <IconComponent className="mr-2" />}
        <button>{children}</button>
      </div>
    </CopyToClipboard>
  );
};

export default CopyToClipboardButton;
