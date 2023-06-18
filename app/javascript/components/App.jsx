import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";

const API = "/api/v1";
const defaultQuestions = [
  "What is a minimalist entrepreneur?",
  "What is your definition of community?",
  "How do I decide what kind of business I should start?",
];

const getRandomQuestion = () =>
  defaultQuestions[Math.floor(Math.random() * defaultQuestions.length)];

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

  const isLoading = answer === "Loading...";

  const handleOnChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAskQuestion = async (question) => {
    setInputValue(question);
    setAnswer("Loading...");
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
      <div className="HeadingContainer">
        <a href="https://www.amazon.com/Minimalist-Entrepreneur-Great-Founders-More/dp/0593192397">
          <img
            src="../assets/tme_cover.png"
            alt="Cover image for the book The Minimalist Entrepreneur"
          />
        </a>
        <h1>Ask My Book</h1>
      </div>
      <div className="AskContainer">
        <label className="Description">
          This is an experiment in using AI to make my book's content more
          accessible. Ask a question and AI'll answer it in real-time:
        </label>

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
      <label className="Credits">
        Based on <a href="https://askmybook.com">askmybook.com</a> | View
        source:{" "}
        <a href="https://github.com/dericko/rera-askmybook">
          github.com/dericko
        </a>
      </label>
    </div>
  );
};

export default App;
