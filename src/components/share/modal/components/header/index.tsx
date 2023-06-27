import "./styles.css";
import Icon from "../../../../icon";
import React from "react";

const ModalShareHeader = ({
  label = "Share...",
  onCloseModal,
}: {
  label?: string;
  onCloseModal: (isShare?: boolean) => void;
}) => (
  <div className="modal-share-header">
    <h4>{label}</h4>
    <button onClick={() => onCloseModal()}>
      <Icon type="close" fill="black" />
    </button>
  </div>
);

export default React.memo(ModalShareHeader);
