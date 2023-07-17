import { useEffect, useState } from "react";

const randomInt = (min, max) => min + Math.floor((max - min) * Math.random());

export const useTypingEffect = (text) => {
  const [isTyping, setIsTyping] = useState(false);
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    if (index < text.length) {
      setIsTyping(true);
      setTimeout(() => {
        setDisplayText(displayText + text[index]);
        setIndex(index + 1);
      }, randomInt(20, 60));
    } else {
      setIsTyping(false);
    }
  }, [text, index, displayText]);
  return { isTyping, setIndex, displayText, setDisplayText };
};
