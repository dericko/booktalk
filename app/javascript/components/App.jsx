import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import { BOOK_INFO, API, COPY } from "../constants.js";

const getRandomQuestion = () =>
  BOOK_INFO.defaultQuestions[
    Math.floor(Math.random() * BOOK_INFO.defaultQuestions.length)
  ];

const Header = () => (
  <div className="HeadingContainer">
    <a href={BOOK_INFO.amazonLink}>
      <img src={BOOK_INFO.imageUrl} alt={BOOK_INFO.imageAlt} />
    </a>
    <h1>{COPY.heading}</h1>
  </div>
);

const Footer = () => (
  <>
    <label className="Credits">
      Based on <a href="https://askmybook.com">askmybook.com</a> | View source:{" "}
      <a href="https://github.com/dericko/rera-askmybook">github.com/dericko</a>
    </label>
    <label className="Credits">
      For entertainment only. I don't own this book nor any rights to it.
    </label>
  </>
);

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

const App = () => {
  const [answer, setAnswer] = useState("");
  const [inputValue, setInputValue] = useState(getRandomQuestion());
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef();

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    if (index < answer.length) {
      setIsTyping(true);
      setTimeout(() => {
        setDisplayText(displayText + answer[index]);
        setIndex(index + 1);
      }, randomInt(20, 60));
    } else {
      setIsTyping(false);
    }
  }, [answer, index, displayText]);

  useEffect(() => {
    if (questionId) {
      const fetchAnswerById = async () => {
        const response = await fetch(`${API}/ask/${questionId}`);
        const { answer, question } = await response.json();
        setInputValue(question);
        setAnswer(answer);
      };
      try {
        fetchAnswerById();
      } catch (error) {
        console.error(error);
      }
    }
  }, [questionId]);

  const handleOnChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleReset = () => {
    setAnswer("");
    setInputValue("");
    setDisplayText("");
    navigate("/");
    setIndex(0);
    inputRef.current.focus();
  };

  const handleAskQuestion = async (question) => {
    setInputValue(question);
    setIsLoading(true);
    setDisplayText("");
    try {
      const token = document.querySelector('meta[name="csrf-token"]').content;
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ question }),
      });
      const { answer, questionId } = await response.json();
      navigate(`/questions/${questionId}`);
      setIsLoading(false);
      console.log(answer)
      setAnswer(answer);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="AppContainer">
      <Header />
      <div className="AskContainer">
        <label className="Description">{COPY.description}</label>
        <textarea
          autoFocus
          ref={inputRef}
          className="QuestionInput"
          value={inputValue}
          onChange={handleOnChange}
          pattern="\w+"
          readOnly={isLoading}
        />
        {displayText.length === 0 && (
          <div className="Buttons">
            <button
              className="AskButton"
              disabled={isLoading || isTyping}
              onClick={() => handleAskQuestion(inputValue)}
            >
              {isLoading ? "Asking..." : "Ask Question"}
            </button>
            <button
              className="LuckyButton"
              disabled={isLoading || isTyping}
              onClick={() => {
                handleAskQuestion(getRandomQuestion());
              }}
            >
              I'm Feeling Lucky
            </button>
          </div>
        )}
        {!isLoading && <div className="AnswerContainer"><strong>Answer: </strong>{displayText}</div>}
        {displayText.length > 0 && !isTyping && (
          <button className="ResetButton" onClick={handleReset}>Ask another question</button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
