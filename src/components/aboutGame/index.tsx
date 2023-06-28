import "./styles.css";
import { Link } from "react-router-dom";
import Icon, { TypeIcon } from "../icon";
import Logo from "../logo";
import React from "react";

export interface ISocialNetworks {
  title: string;
  icon: TypeIcon;
  link: string;
}

const SOCIAL_NETWORKS: ISocialNetworks[] = [
  {
    title: "Twitter",
    icon: "twitter",
    link: "https://twitter.com/ostjh",
  },
  {
    title: "Github",
    icon: "github",
    link: "https://github.com/Jorger",
  },
  {
    title: "Linkedin",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/jorge-rubiano-a8616319",
  },
  {
    title: "Dev.to",
    icon: "devto",
    link: "https://dev.to/jorger",
  },
  {
    title: "bio.link",
    icon: "games",
    link: "https://bio.link/jorgerub",
  },
];

const AboutGame = () => {
  return (
    <div className="about-game">
      <Logo />
      <Link to="/" className="button blue about-game-back">
        <Icon type="back" fill="white" />
      </Link>
      <div>
        <p>Come to play Dice Merge Puzzle and give your brain rest!</p>
        <p>
          Game developed by{" "}
          <a
            title="Jorge Rubiano"
            href="https://twitter.com/ostjh"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jorge Rubiano
          </a>{" "}
          in{" "}
          <a
            title="ReactJS"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ReactJS
          </a>{" "}
          as well as the{" "}
          <a
            title="Dnd kit"
            href="https://dndkit.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dnd kit
          </a>{" "}
          library for Drag and Drop type events.
        </p>
        <h2>How to play?</h2>
        <p>
          Drag the dices to move them: The same Dices will be merged to a larger
          number Dice.
        </p>
        <p>The Dices can be rotated.</p>
      </div>
      <div className="about-game-social">
        {SOCIAL_NETWORKS.map(({ title, icon, link }, key) => (
          <a
            key={key}
            className="button blue about-game-social-link"
            title={`Jorge Rubiano on ${title}`}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon type={icon} fill="white" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AboutGame);
