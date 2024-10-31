/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setResultData("");
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt && prompt.length !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      response = await run(input);
      setPrevPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
    }
    let newResponse = response().split("**, ##");
    let updateResponse = "";
    for (let i = 0; i < newResponse.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        updateResponse += newResponse[i];
      } else {
        updateResponse += "<b>" + newResponse[i] + "</b>";
      }
    }
    let newResponse2 = updateResponse.split("*").join("</br>");
    let updatedResponse2 = newResponse2.split(" ");
    for (let i = 0; i < updatedResponse2.length; i++) {
      const newText = updatedResponse2[i];
      delayPara(i, newText + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
