"use client";

import React, { useState, FormEvent, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaTrash, FaRobot, FaUser } from "react-icons/fa";
import {
  getChatHistory,
  sendChatMessage,
  deleteAllChats,
} from "@/api/chatbotApi";
import { toast } from "react-toastify";
import ConfirmationPopup from "@/components/Popups/ConfirmationPopup";

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

  const handleClearChat = async () => {
    try {
      await deleteAllChats();
      toast.success("Chat cleared successfully!");
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
      toast.error("Failed to clear chat. Please try again.");
    } finally {
      setIsPopupOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaRobot className="text-2xl" />
          <div>
            <h2 className="text-xl font-bold">Ask Me Chatbot</h2>
            <p className="text-sm opacity-90">Your Medical Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsPopupOpen(true)} 
          className="flex items-center space-x-1 bg-white text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          title="Clear conversation"
        >
          <FaTrash className="text-sm" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && !isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500 p-6 bg-white rounded-lg shadow-sm max-w-md">
              <FaRobot className="text-4xl mx-auto mb-3 text-blue-400" />
              <p className="text-lg font-medium mb-1">Start a conversation</p>
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
                className={`flex max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100"
                }`}
              >
                <div className="mr-2 mt-1">
                  {msg.role === "user" ? (
                    <FaUser className="text-white opacity-80" />
                  ) : (
                    <FaRobot className="text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs opacity-70">
                      {formatTimestamp(msg.timestamp)}
                    </p>
                    {msg.role === "assistant" && (
                      <p className="text-[11px] opacity-70 italic ml-2">
                        Based on BNF
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center p-3 rounded-2xl bg-white text-gray-800 shadow-sm border border-gray-100">
              <FaRobot className="text-blue-500 mr-2" />
              <div className="flex space-x-1">
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
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSend}>
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Ask anything about medications or health..."
              className="flex-1 py-2 px-2 text-sm outline-none bg-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`p-2 rounded-full ${
                isLoading || !input.trim()
                  ? "text-gray-400"
                  : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              } transition-colors`}
              disabled={isLoading || !input.trim()}
            >
              <IoSend size={20} />
            </button>
          </div>
        </form>
        <p className="text-xs text-center text-gray-500 mt-2">
          Press Enter to send. Shift+Enter for a new line.
        </p>
      </div>

      {isPopupOpen && (
        <ConfirmationPopup
          element="clear the chat"
          handleYes={handleClearChat}
          handleNo={() => setIsPopupOpen(false)}
          isOpen={isPopupOpen}
        />
      )}
    </div>
  );
}
