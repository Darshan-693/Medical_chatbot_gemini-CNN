import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Loading from "./component/Loading";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [drb,giveImage] = useState("");
  // Initialize Gemini API
  const api_key = "AIzaSyCxh7ulZGYUg-ZA9bL12U-ndoFP15P_oDs";


  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  //const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  
  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setUploadedImage(base64String); // Store base64 image data
        setChatHistory(
          [
            ...chatHistory,
            { type: "user", message: "", image: base64String }
          ].filter(Boolean)
        );
        giveImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const ecg= async ()=>
    {
      if(!uploadedImage)
      {
        setChatHistory(
          [
            ...chatHistory,
            { type: "user", message: userInput },
            { type: "bot", message: "No Image uploaded" },
          ].filter(Boolean)
        );
        return ;
      }
      setIsLoading(true);
      await fetch("https://ecgandlcbackend.onrender.com/ecg",{
        method:"POST",
        body:JSON.stringify({
          b64S:drb
        }),
        headers:
        {
          "Content-type": "application/json"
        }
      }).then(data=>data.json()).then(data=>
        model.generateContent("I have detected "+data.result+" heart condition through my CNN model. Generate a result paragraph informing about the condition")).then(data=>
          data.response.text()
      ).then(data=>
        setChatHistory(
          [
            ...chatHistory,
            { type: "user", message: userInput },
            { type: "bot", message: data },
          ].filter(Boolean)
        )
      )
      setIsLoading(false);
      setUploadedImage(null);
      giveImage(null);
    }
    const lcd= async ()=>
      {
        if(!uploadedImage)
        {
          setChatHistory(
            [
              ...chatHistory,
              { type: "user", message: userInput },
              { type: "bot", message: "No Image uploaded" },
            ].filter(Boolean)
          );
          return ;
        }
        setIsLoading(true);
        await fetch("https://ecgandlcbackend.onrender.com/lcd",{
          method:"POST",
          body:JSON.stringify({
            b64S:drb
          }),
          headers:
          {
            "Content-type": "application/json"
          }
        }).then(data=>data.json()).then(data=>
          model.generateContent("I have detected "+data.result+" lung condition through my CNN model. Generate a result paragraph informing about the condition")).then(data=>
            data.response.text()
        ).then(data=>
          setChatHistory(
            [
              ...chatHistory,
              { type: "user", message: userInput },
              { type: "bot", message: data },
            ].filter(Boolean)
          )
        )
        setIsLoading(false);
        setUploadedImage(null);
        giveImage(null);
      }
  // Function to send user message to Gemini
  const sendMessage = async () => {
    if (!userInput.trim() && !uploadedImage) return;
    setIsLoading(true);
    try {
      let botResponse = "";
      if (userInput) {
        /*var chat_history = ""
        for(let i in chatHistory)
        {
          if(i!==0&&i%2===0)
          chat_history = chatHistory[i].message+" ";
        }
        chat_history.replace(/\s+/," ");
        if(chat_history.length>1000)
        {
          chat_history = chat_history.slice(chat_history.length-500,chat_history.length)
        }
        console.log(chat_history);
        const context = ".Use the following as a context for answering this query:"+chat_history.toString()+
        "If the context does not match the query then ignore the context";*/
        const result = await model.generateContent(/*"query: "+*/userInput/*+
          (chat_history.length===0?"":context)*/);
        botResponse = await result.response.text();
      }

      setChatHistory(
        [
          ...chatHistory,
          { type: "user", message: userInput },
          botResponse && { type: "bot", message: botResponse },
        ].filter(Boolean)
      );
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setUserInput("");
      setUploadedImage(null);
      setIsLoading(false);
    }
  };

  // Function to clear the chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  // useEffect to show welcome message at the start
  useEffect(() => {
    setChatHistory([{ type: "bot", message: "Let me know your queries..." }]);
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <div className="flex-grow flex justify-start items-start">
        <h2 className="text-3xl text-gray-400 mt-4 ml-4">Medical ChatBot</h2>
      </div>

      <div className="flex-grow flex justify-center items-center">
        <div className="welcome-section text-center">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Hello, How can I help you today?
          </h1>
        </div>
      </div>

      <div
        className="chat-container bg-[#1E1E1E] rounded-lg shadow-md p-4 flex-grow overflow-auto mx-auto max-w-4xl mt-8"
        style={{ height: "40vh", width: "100%" }}
      >
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="flex items-center justify-center mt-4 px-4">
        <input
          type="file"
          accept="image/*"
          className="file-input hidden"
          id="image-upload"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="image-upload"
          className="file-input-label cursor-pointer px-4 py-2 bg-[#3A3A3A] text-white rounded-lg mr-2 hover:bg-[#4A4A4A] focus:outline-none"
        >
          Upload Image
        </label>

        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg bg-[#333333] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />

        <button
          className="px-4 py-2 ml-2 rounded-lg bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <div className="flex justify-between mt-4">
      <button
        className="mb-4 clear-chat-btn mt-4 px-4 py-2 mx-auto rounded-lg bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] focus:outline-none"
        onClick={clearChat}
      >
        Clear Chat
      </button>
      <button
        className="mb-4 clear-chat-btn mt-4 px-4 py-2 mx-auto rounded-lg bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] focus:outline-none"
        onClick={ecg}
      >
        ECG Analysis
      </button>
      <button
        className="mb-4 clear-chat-btn mt-4 px-4 py-2 mx-auto rounded-lg bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] focus:outline-none"
        onClick={lcd}
      >
        Lung cancer detection
      </button>
      </div>
    </div>
  );

};

export default App;
