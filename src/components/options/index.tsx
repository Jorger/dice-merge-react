import "./styles.css";
import { useSoundContext } from "../../context/SoundContext";
import FocusTrap from "focus-trap-react";
import Icon, { TypeIcon } from "../icon";
import React from "react";
import Switch from "react-switch";
import { SoundsType } from "../../interfaces";

interface RenderOptionProps {
  label: string;
  icon: TypeIcon;
  checked: boolean;
  handleChecked: (nextChecked: boolean) => void;
}

const RenderOption = ({
  label = "",
  icon,
  checked,
  handleChecked,
}: RenderOptionProps) => (
  <div className="options-game-option">
    <Icon type={icon} fill="white" />
    <div className="options-game-option-label">{label}</div>
    <Switch
      borderRadius={15}
      checked={checked}
      onChange={handleChecked}
      onColor="#ffe901"
      onHandleColor="#f6ba00"
      handleDiameter={30}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      height={30}
      width={60}
    />
  </div>
);

interface OptionsProps {
  handleClose: () => void;
  handleRestart?: () => void;
}

const Options = ({ handleClose, handleRestart }: OptionsProps) => {
  const { soundEnabled, toggleSound } = useSoundContext();

  return (
    <FocusTrap focusTrapOptions={{ escapeDeactivates: false }}>
      <div className="options-game">
        <div className="options-game-container">
          <div className="options-game-header">
            Options
            <button
              title="Close"
              className="button options-game-close"
              onClick={handleClose}
            >
              <Icon type="close" fill="white" />
            </button>
          </div>
          <div className="options-game-options">
            {Object.keys(soundEnabled).map((type) => (
              <RenderOption
                key={type}
                label={type}
                icon={type as TypeIcon}
                checked={soundEnabled[type as SoundsType]}
                handleChecked={() => toggleSound(type as SoundsType)}
              />
            ))}
          </div>
          {handleRestart && (
            <div className="options-game-buttons">
              <button className="button blue options-game-button">
                <Icon type="home" fill="white" />
                <span>Home</span>
              </button>
              <button
                className="button blue options-game-button"
                onClick={handleRestart}
              >
                <Icon type="restart" fill="white" />
                <span>Restart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </FocusTrap>
  );
};

export default React.memo(Options);
