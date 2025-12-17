"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useChatSocket from "@/hook/useChat.js";

const ChatContext = createContext(null);
const STORAGE_KEY = "system_chat_history";

const WELCOME_MESSAGE = {
  sender: "bot",
  text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?"
};

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.length ? parsed : [WELCOME_MESSAGE]);
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const { sendMessage } = useChatSocket({
    onMessage: (data) => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data }
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Lỗi hệ thống" }
      ]);
    }
  });

  const addUserMessage = (text) => {
    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    sendMessage(text, newMessages);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ChatContext.Provider value={{ messages, addUserMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
