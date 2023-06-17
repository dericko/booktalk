import React, { useState } from "react";
import "./App.css";

const API = "/api/v1";

const App = () => {
  const [answer, setAnswer] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleOnChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAskQuestion = async () => {
    setAnswer("Loading...");
    const token = document.querySelector('meta[name="csrf-token"]').content;
    try {
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ question: inputValue }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="AppContainer">
      <div className="HeadingContainer">
        <a href="https://www.amazon.com/Minimalist-Entrepreneur-Great-Founders-More/dp/0593192397">
          <img src="./assets/tme_cover.png" alt="book cover" />
        </a>
        <h1>Ask My Book</h1>
      </div>
      <div className="AskContainer">
        <label className="Description">
          This is an experiment in using AI to make my book's content more
          accessible. Ask a question and AI'll answer it in real-time:
        </label>

        <textarea value={inputValue} onChange={handleOnChange} pattern="\w+" />
        <div className="Buttons">
          <button onClick={handleAskQuestion}>Ask Question</button>
          <button disabled onClick={() => console.log("todo")}>I'm Feeling Lucky</button>
        </div>
        <div className="AnswerContainer">{answer}</div>
      </div>
      <label className="Credits">
        Based on <a href="https://askmybook.com">askmybook.com</a> |
        View source: <a href="https://github.com/dericko/rera-askmybook">github.com/dericko</a>
      </label>
    </div>
  );
};

export default App;
