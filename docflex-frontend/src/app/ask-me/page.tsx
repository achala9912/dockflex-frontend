"use client";

import React, { useState, FormEvent, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { getChatHistory, sendChatMessage } from "@/api/chatbotApi";

interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  _id?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getChatHistory();
        console.log("Chat history API response:", history);
        setMessages(history);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatHistoryMessage = {
      role: "user",
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage({ question: trimmedInput });
      console.log("Chatbot API normalized response:", response);

      const assistantMessage: ChatHistoryMessage = {
        role: "assistant",
        content: response.answer,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Unexpected error in handleSend:", error);

      const errorMessage: ChatHistoryMessage = {
        role: "assistant",
        content: "Sorry, I couldn't get a response. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    console.log("Starting a new chat.");
  };

  const handleLoadHistory = async () => {
    setIsLoading(true);
    try {
      const history = await getChatHistory();
      console.log("History button API response:", history);
      setMessages(history);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Buttons */}
      <div className="flex justify-center p-4">
        <div className="inline-flex rounded-full bg-gray-300 p-1">
          <button
            onClick={handleNewChat}
            className="px-4 py-2 text-sm rounded-full bg-white text-black shadow"
          >
            New Chat
          </button>
          <button
            onClick={handleLoadHistory}
            className="px-4 py-2 text-sm rounded-full text-gray-700"
          >
            History
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 text-center">
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">
                Ask me anything about medications or health
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg._id || i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-100 text-gray-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-gray-50">
        <form onSubmit={handleSend}>
          <div className="flex items-center bg-white border rounded-full px-4">
            <input
              type="text"
              placeholder="Ask Anything............"
              className="flex-1 py-2 px-2 text-sm outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              disabled={isLoading || !input.trim()}
            >
              <IoSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
