import React from "react";
import ReactMarkdown from "react-markdown";

const ChatHistory = ({ chatHistory }) => {
  return (
    <>
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex items-start py-2 px-4 rounded-lg mb-2 ${
            message.type === "user"
              ? "bg-[#424242] text-white"
              : "bg-[#2F2F2F] text-blue-400"
          }`}
        >
          {message.type === "user" && (
            <span className="mr-2 font-bold text-blue-400">You:</span>
          )}
          <div>
            {message.image && (
              <img
                src={message.image}
                alt="User upload"
                className="rounded-lg mb-2 max-h-32 object-contain"
              />
            )}
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatHistory;
