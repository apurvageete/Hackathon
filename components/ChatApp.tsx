"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import "./ChatApp.css";

type Message = {
  type: "user" | "bot";
  content: string;
};

const ChatApp: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: input }]);
    setInput("");

    // Simulate bot response with a delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", content: "Still working on your query..." }]);
    }, 1000); // 1-second delay
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    console.log("File selected:", selectedFile.name);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      console.log("Upload success:", result);
      setMessages((prev) => [...prev, { type: "bot", content: "File uploaded successfully!" }]);
    } catch (error) {
      console.error("Upload error:", error);
      setMessages((prev) => [...prev, { type: "bot", content: "Failed to upload file." }]);
    }

    setUploadPopupOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <img src="/ubsicon.png" alt="ChatBot Logo" className="org-icon" />
        <h2 className="chat-title">AI ChatBot</h2>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <Card key={index} className={`message-card ${msg.type === "user" ? "user-message" : "bot-message"}`}>
              <CardContent className="message-content">{msg.content}</CardContent>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="chat-textarea"
            aria-label="Chat input"
          />
          <Button onClick={handleSend} disabled={!input} className="chat-send-button" aria-label="Send message">
            <Send size={20} />
          </Button>
        </div>

        {/* Additional Buttons */}
        <div className="chat-extra-buttons">
          <Button className="gitlab-button">Connect GitLab</Button>
          <Button onClick={() => setUploadPopupOpen(true)} className="upload-button">Upload File</Button>
        </div>
      </div>

      {/* File Upload Popup */}
      {isUploadPopupOpen && (
        <div className="upload-popup">
          <div className="upload-popup-content">
            <h3>Upload File</h3>
            <input type="file" onChange={handleFileChange} />
            <div className="upload-popup-buttons">
              <Button onClick={handleFileUpload} disabled={!selectedFile}>Upload</Button>
              <Button onClick={() => setUploadPopupOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
