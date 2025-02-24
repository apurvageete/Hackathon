"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "./ChatApp.css";

type Message = {
  type: "user" | "bot";
  content: string;
  isCode?: boolean;
};

const ChatApp: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showHelpText, setShowHelpText] = useState(true);
  const [loading, setLoading] = useState(false);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect if input is a code snippet
  const isCodeSnippet = (text: string) => {
    return /```[\s\S]*?```/.test(text) || /[{}();<>]/.test(text);
  };

  const formatCode = (code: string) => {
    return hljs.highlightAuto(code).value;
  };

  const callApi = async (message: string) => {
    try {
      setLoading(true);
      const response = await fetch("https://api.example.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      return data.reply || "I couldn't process your request.";
    } catch (error) {
      return "Error fetching response. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const isCode = isCodeSnippet(input);
    const formattedMessage = isCode ? formatCode(input) : input;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: formattedMessage, isCode }]);
    setInput("");
    setShowHelpText(false);

    // Fetch bot response
    const botResponse = await callApi(input);
    setMessages((prev) => [...prev, { type: "bot", content: botResponse }]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header fixed-header">
        <img src="/ubsicon.png" alt="ChatBot Logo" className="org-icon" />
        <h2 className="chat-title">AI ChatBot</h2>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <Card key={index} className={`message-card ${msg.type === "user" ? "user-message" : "bot-message"}`}>
              <CardContent className="message-content">
                {msg.isCode ? (
                  <pre>
                    <code dangerouslySetInnerHTML={{ __html: msg.content }}></code>
                  </pre>
                ) : (
                  msg.content
                )}
              </CardContent>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Help Text */}
        {showHelpText && <p className="help-text"> <strong>What can I help you with?</strong> </p>}

        {/* Input Area */}
        <div className="chat-input-container">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowHelpText(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Anything"
            className="chat-textarea"
            aria-label="Chat input"
          />
          <Button onClick={handleSend} disabled={!input || loading} className="chat-send-button" aria-label="Send message">
            {loading ? "..." : <Send size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
