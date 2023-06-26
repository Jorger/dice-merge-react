import { getValueFromCache, savePropierties } from "../utils/storage";
import { Howl } from "howler";
import backgroundSound from "./sounds/background.mp3";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import soundsSource from "./sounds/sounds.mp3";
import type {
  AmbientSounds,
  SoundContextProps,
  Sounds,
  SoundsType,
} from "../interfaces";

const ambientSound = new Howl({
  src: [backgroundSound],
  autoplay: getValueFromCache("sounds", { sound: true, music: true }).music,
  loop: true,
  volume: 1,
});

const sounds = new Howl({
  src: [soundsSource],
  sprite: {
    click: [0, 180],
    rotate: [180, 200],
    merge: [300, 390],
    final: [740, 1200],
  },
});

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

interface SoundProviderProps {
  children: React.ReactNode;
}

const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<Sounds>(() =>
    getValueFromCache("sounds", { sound: true, music: true })
  );

  const toggleSound = (type: SoundsType) => {
    const copySounds: Sounds = { ...soundEnabled };
    copySounds[type] = !copySounds[type];

    setSoundEnabled(copySounds);

    if (type === "music") {
      ambientSound[copySounds.music ? "play" : "stop"]();
    }

    savePropierties("sounds", copySounds);
  };

  const playSound = useCallback(
    (type: AmbientSounds) => {
      if (soundEnabled.sound) {
        sounds.play(type);
      }
    },
    [soundEnabled.sound]
  );

  useEffect(() => {
    const onClickEvent = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target && ["a", "button"].includes(target.tagName.toLowerCase())) {
        playSound("click");
      }
    };

    window.addEventListener("click", onClickEvent);

    return () => {
      window.removeEventListener("click", onClickEvent);
    };
  }, [playSound]);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

const useSoundContext = (): SoundContextProps => {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }

  return context;
};

export { SoundProvider, useSoundContext };
