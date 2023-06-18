import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import { BOOK_INFO, API, COPY } from "../constants.js";

const getRandomQuestion = () =>
  BOOK_INFO.defaultQuestions[
    Math.floor(Math.random() * BOOK_INFO.defaultQuestions.length)
  ];

const LOADING_TEXT = "Loading...";

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

const App = () => {
  const [answer, setAnswer] = useState("");
  const [inputValue, setInputValue] = useState(getRandomQuestion());
  const navigate = useNavigate();
  const { questionId } = useParams();

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

  const isLoading = answer === LOADING_TEXT;

  const handleOnChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAskQuestion = async (question) => {
    setInputValue(question);
    setAnswer(LOADING_TEXT);
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
          className="QuestionInput"
          value={inputValue}
          onChange={handleOnChange}
          pattern="\w+"
        />
        <div className="Buttons">
          <button
            className="AskButton"
            disabled={isLoading}
            onClick={() => handleAskQuestion(inputValue)}
          >
            Ask Question
          </button>
          <button
            className="LuckyButton"
            disabled={isLoading}
            onClick={() => {
              handleAskQuestion(getRandomQuestion());
            }}
          >
            I'm Feeling Lucky
          </button>
        </div>
        <div className="AnswerContainer">{answer}</div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
