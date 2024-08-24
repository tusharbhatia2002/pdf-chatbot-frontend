"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import PDFUploader from "@/components/PDFUploader";
import { sendChatMessage, getPDFFiles, extractKeyPoints } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pdfFiles, setPDFFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPDFFiles();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchPDFFiles = async () => {
    const files = await getPDFFiles();
    setPDFFiles(files);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(input);
      const aiMessage: Message = {
        id: messages.length + 1,
        text: response,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleExtractKeyPoints = async (pdfFile: string) => {
    try {
      const response = await extractKeyPoints(pdfFile);
      const keyPointsMessage: Message = {
        id: messages.length + 1,
        text: `Key Points from ${pdfFile}:\n${response.key_points.join("\n")}`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, keyPointsMessage]);
    } catch (error) {
      console.error("Error extracting key points:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatSuggestions = [
    "What are the key points in [PDF Name]?",
    "What are the total number of responses in the survey?",
    "Summarize the content of [PDF Name].",
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-6">
      <div className="lg:w-1/3 p-6 bg-white rounded-lg shadow-md overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Chat Buddy</h2>
        <PDFUploader onUpload={fetchPDFFiles} uploadedPDFs={pdfFiles} />
      </div>
      <div className="lg:w-2/3 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 rounded-lg shadow-inner">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`p-4 max-w-[80%] ${
                    message.sender === "user"
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {message.text}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-200"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Chat Suggestions Above the Input Box */}
        <div className="suggestions p-4 bg-white border-t flex flex-wrap gap-2">
          {chatSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInput(suggestion.replace("[PDF Name]", pdfFiles[0] || "your PDF"))}
              className="suggestion-button flex-1 min-w-[30%] bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold py-2 px-4 rounded"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}