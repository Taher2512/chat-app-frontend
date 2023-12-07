"use client";

import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { db } from "./firebaseConfig";

let socket;

export default function Chat() {
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io("http://localhost:3500");

    const q = query(collection(db, "messages"), orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => doc.data());
      setMessages(messages);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (message) {
      const timestamp = new Date().getTime(); // Get current timestamp
      const userMessage = { text: message, user: userName, timestamp }; // Add timestamp to userMessage
      socket.emit("newMessage", userMessage);
      setMessage("");
      messageInputRef.current.focus();

      try {
        await addDoc(collection(db, "messages"), userMessage);
      } catch (error) {
        console.error("Error adding message to Firestore: ", error);
      }
    }
  };

  const handleUserNameSubmit = () => {
    if (userName.trim()) {
      setIsModalOpen(false);
      socket.emit("newUser", userName);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded">
            <h2 className="text-lg font-bold mb-4">Enter Your Name</h2>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Your Name"
            />
            <button
              onClick={handleUserNameSubmit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Enter Chat
            </button>
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl bg-white rounded shadow">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">Chat</h1>
        </div>
        <div className="h-96 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.user === userName ? "items-end" : "items-start"
              } animate-fade-in-up`}
            >
              <span className="text-xs text-gray-600">
                {msg.user === userName ? "You" : msg.user}
              </span>
              <p
                className={`px-4 py-2 rounded-lg text-sm ${
                  msg.user === userName
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex p-4 border-t">
          <input
            ref={messageInputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
