import React from "react";

export const AnswerArea = ({
  isLoading,
  answerText,
  shouldDisplayReset,
  onClickReset,
}) => (
  <>
    {!isLoading && (
      <div style={styles.answer}>
        {answerText && <strong>Answer: </strong>}
        {answerText}
      </div>
    )}
    {shouldDisplayReset && (
      <button style={styles.button} onClick={onClickReset}>
        Ask another question
      </button>
    )}
  </>
);

const styles = {
  answer: {
    marginTop: "20px",
    display: "block",
    textAlign: "left",
  },
  button: {
    color: "white",
    background: "black",
    textAlign: "left",
    display: "block",
    marginTop: "20px",
  },
};
