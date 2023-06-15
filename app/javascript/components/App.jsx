import React, { useState } from "react";

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
    <div style={styles}>
      <h1>Ask a book</h1>
      <label>Question</label>
      <textarea
        value={inputValue}
        onChange={handleOnChange}
        rows={6}
        cols={36}
        pattern="\w+"
      />
      <button onClick={handleAskQuestion}>Ask</button>
      <div>{answer}</div>
    </div>
  );
};

const styles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "600px",
  margin: "auto",
};

export default App;
