import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import { BOOK_INFO, API, COPY } from "../constants";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { AskButtons } from "./AskButtons";
import { AnswerArea } from "./AnswerArea";

const getRandomQuestion = () =>
  BOOK_INFO.defaultQuestions[
    Math.floor(Math.random() * BOOK_INFO.defaultQuestions.length)
  ];

const App = () => {
  const [answer, setAnswer] = useState("");
  const [inputValue, setInputValue] = useState(getRandomQuestion());
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  const {
    isTyping,
    setIndex,
    displayText: answerText,
    setDisplayText: setAnswerText,
  } = useTypingEffect(answer);

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
    setAnswerText("");
    navigate("/");
    setIndex(0);
    inputRef.current.focus();
  };

  const handleAskQuestion = async (question) => {
    setInputValue(question);
    setIsLoading(true);
    setAnswerText("");
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
      setAnswer(answer);
    } catch (error) {
      console.error(error);
    }
  };
  const finishedShowingAnswer = answerText.length > 0 && !isTyping;

  return (
    <div className="AppContainer">
      <Header handleReset={handleReset} />
      <div className="AskContainer">
        <label className="Description">{COPY.description}</label>
        <textarea
          className="QuestionInput"
          autoFocus
          ref={inputRef}
          value={inputValue}
          onChange={handleOnChange}
          pattern="\w+"
          disabled={isLoading}
        />
        <AskButtons
          isHidden={answerText.length !== 0}
          isDisabled={isLoading || isTyping}
          onClickAsk={() => handleAskQuestion(inputValue)}
          onClickLucky={() => {
            handleAskQuestion(getRandomQuestion());
          }}
          isLoading={isLoading}
        />
        <AnswerArea
          isLoading={isLoading}
          answerText={answerText}
          shouldDisplayReset={finishedShowingAnswer}
          onClickReset={handleReset}
        />
      </div>
      <Footer />
    </div>
  );
};

export default App;
