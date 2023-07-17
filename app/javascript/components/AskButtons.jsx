import React from "react";
import "./AskButtons.css";

export const AskButtons = ({
  onClickAsk,
  onClickLucky,
  isLoading,
  isHidden,
  isDisabled,
}) =>
  isHidden ? null : (
    <div className="Buttons">
      <button className="AskButton" disabled={isDisabled} onClick={onClickAsk}>
        {isLoading ? "Asking..." : "Ask Question"}
      </button>
      <button
        className="LuckyButton"
        disabled={isDisabled}
        onClick={onClickLucky}
      >
        I'm Feeling Lucky
      </button>
    </div>
  );
