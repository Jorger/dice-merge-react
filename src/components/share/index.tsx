import { ShareData, shareLink, successMessage } from "./helpers";
import React, { useState } from "react";
import Modal from "./modal";

const SHARE_AVAILABLE = "share" in navigator;

interface ShareProps {
  children: JSX.Element;
  data: ShareData;
  useNativeOption?: boolean;
}

const Share = ({ children, data, useNativeOption = true }: ShareProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const onClick = () => {
    if (SHARE_AVAILABLE && useNativeOption) {
      shareLink(data);
    } else {
      setIsVisible(true);
    }
  };

  const onCloseModal = (isShare = false) => {
    if (isShare) {
      successMessage();
    }

    setIsVisible(false);
  };

  return (
    <React.Fragment>
      {React.cloneElement(children, { onClick })}
      {isVisible && <Modal data={data} onCloseModal={onCloseModal} />}
    </React.Fragment>
  );
};

export default React.memo(Share);
