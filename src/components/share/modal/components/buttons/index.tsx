import "./styles.css";
import { copyToClipboard } from "../../../../../utils/helpers";
import { ShareData } from "../../../helpers";
import Icon, { TypeIcon } from "../../../../icon";
import React from "react";

type TButtons = {
  icon: TypeIcon;
  label: string;
  action: string;
  url?: string;
};

const BUTTONS: TButtons[] = [
  {
    icon: "copy",
    label: "Copy",
    action: "copy",
  },
  {
    icon: "twitter",
    label: "Twitter",
    action: "twitter",
    url: "https://twitter.com/intent/tweet?text=DATA_TEXT&url=DATA_URL",
  },
  {
    icon: "facebook",
    label: "Facebook",
    action: "facebook",
    url: "https://www.facebook.com/sharer/sharer.php?u=DATA_URL&quote=DATA_TEXT",
  },
  {
    icon: "linkedin",
    label: "Linkedin",
    action: "linkedin",
    url: "https://www.linkedin.com/shareArticle?mini=true&url=DATA_URL&title=DATA_TITLE&summary=DATA_TEXT&source=LinkedIn",
  },
];

interface ModalShareButtonsProps {
  data: ShareData;
  onCloseModal: (isShare?: boolean) => void;
}

const ModalShareButtons = ({ data, onCloseModal }: ModalShareButtonsProps) => {
  const handleClick = (button: TButtons) => {
    if (button.action === "copy") {
      copyToClipboard(`${data.text} ${data.url}`);
    } else {
      let url = button.url;

      Object.keys(data).forEach(
        (v) =>
          (url = url?.replace(
            `DATA_${v.toUpperCase()}`,
            encodeURIComponent(data[v as keyof ShareData])
          ))
      );

      window.open(url, "_blank");
    }

    onCloseModal && onCloseModal(true);
  };

  return (
    <div className="modal-share-buttons">
      {BUTTONS.map((button) => (
        <div className="modal-share-button" key={button.icon}>
          <button onClick={() => handleClick(button)}>
            <Icon type={button.icon} fill="black" />
          </button>
          <span>{button.label}</span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ModalShareButtons);
