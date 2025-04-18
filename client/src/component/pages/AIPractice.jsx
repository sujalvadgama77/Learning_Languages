/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import robotImage from "../assets/chatbot.gif";
import { auth, db } from "../../firebase/Firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { generateAIResponse } from "../../services/openai";
import { INITIAL_GREETINGS } from "../../config/openai";
import { toast, ToastContainer } from "react-toastify";
import TypewriterMessage from "../components/TypewriterMessage";
import "react-toastify/dist/ReactToastify.css";

const AIPractice = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userPromptCount, setUserPromptCount] = useState(0);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = localStorage.getItem("userId");
        if (storedEmail) {
          const q = query(
            collection(db, "users"),
            where("Email", "==", storedEmail)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setData(doc.data());
            setUserName(doc.data().Name || "User");
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
      }
    };

    fetchUserData();
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedLanguage) {
      // Add initial greeting when language is selected
      const initialGreeting = {
        text: INITIAL_GREETINGS[selectedLanguage.code],
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([initialGreeting]);
    }
  }, [selectedLanguage]);

  const getGreeting = (langCode) => {
    const greetings = {
      en: "Hello",
      hi: "नमस्ते",
      gu: "નમસ્તે"
    };
    return greetings[langCode] || greetings.en;
  };

  const languages = [
    { name: "English", code: "en", icon: "A" , languages: "english" },
    { name: "Gujarati", code: "gu", icon: "ક" , languages: "gujarati" },
    { name: "Hindi", code: "hi", icon: "क" , languages: "hindi" },
  ];

  const startListening = () => {
    const isBrave = navigator.brave !== undefined;

    if (isBrave) {
      toast.info('If you are using Brave browser, please: \n1. Click the Brave shield icon in the address bar\n2. Turn off "Shields" or set it to "Basic"\n3. Refresh the page and try again');
    }

    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;

      // Set language based on selected language
      switch(selectedLanguage.code) {
        case 'en':
          recognition.lang = 'en-US';
          break;
        case 'hi':
          recognition.lang = 'hi-IN';
          break;
        case 'gu':
          recognition.lang = 'gu-IN';
          break;
        default:
          recognition.lang = 'en-US';
      }

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening...');
        setInputMessage(''); // Clear any existing input
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        // Loop through the results to get both interim and final transcripts
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the input field with either final or interim results
        setInputMessage(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch(event.error) {
          case 'network':
            if (isBrave) {
              toast.error('Network error. Please disable Brave shields for this site and try again.');
            } else {
              toast.error('Network error. Please check your internet connection.');
            }
            break;
          case 'not-allowed':
            toast.error('Microphone access denied. Please allow microphone access.');
            break;
          case 'no-speech':
            toast.error('No speech detected. Please try again.');
            break;
          default:
            toast.error('Speech recognition failed. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      // Add this to stop recognition after 5 seconds of silence
      let silenceTimer;
      recognition.onspeechend = () => {
        silenceTimer = setTimeout(() => {
          recognition.stop();
        }, 2000); // Stop after 2 seconds of silence
      };

      recognition.onspeechstart = () => {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        setIsListening(false);
        toast.error('Failed to start speech recognition. Please try again.');
      }
    } else {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Stop recognition if it's active
    stopListening();

    const userMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    // Clear input using ref
    const messageToSend = inputMessage;
    setInputMessage("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setUserPromptCount(prev => prev + 1);

    try {
      const aiResponse = await generateAIResponse(
        messageToSend,
        selectedLanguage.code
      );

      const aiMessage = {
        text: aiResponse,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get AI response. Please try again.");
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleRetakeTest = async () => {
    try {
      setIsLoading(true);
      const resetResponse = await fetch(`https://learning-languages-chatbot-server.onrender.com/chat/${selectedLanguage.languages}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (resetResponse.ok) {
        setMessages([{
          text: INITIAL_GREETINGS[selectedLanguage.code],
          sender: "ai",
          timestamp: new Date().toLocaleTimeString(),
        }]);
        setUserPromptCount(0);
        toast.success('Test reset successfully!');
      } else {
        toast.error('Failed to reset test. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting test:', error);
      toast.error('Failed to reset test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndTest = async () => {
    if (userPromptCount < 7) {
      toast.warning('Please complete at least 7 prompts before ending the test.');
      return;
    }

    try {
      setIsLoading(true);
      const endResponse = await generateAIResponse(
        "Please evaluate my language proficiency based on our conversation and provide a detailed feedback.",
        selectedLanguage.code
      );

      const endMessage = {
        text: endResponse,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, endMessage]);
    } catch (error) {
      console.error('Error ending test:', error);
      toast.error('Failed to end test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/homepage")}
            className="mb-6 flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>

          {!selectedLanguage ? (
            <>
              {/* Initial Language Selection View */}
              <div className="text-center mb-8">
                <img
                  src={robotImage}
                  alt="LangBuddy"
                  className="w-48 h-48 mx-auto mb-4"
                />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Practice with LangBuddy
                </h1>
                <p className="text-lg text-gray-600">
                  Select a language and start chatting to improve..!
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang)}
                      className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center"
                    >
                      <span className="text-4xl mb-2">{lang.icon}</span>
                      <span className="font-medium text-gray-900">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected Language Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Selected Language: {selectedLanguage.name}
              </h2>

              {/* Two Column Layout */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - LangBuddy */}
                <div className="lg:w-1/3">
                  <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6 rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.15)] h-[600px] flex flex-col">
                    <h2 className="text-2xl font-bold text-center mb-4 text-purple-600">
                      {getGreeting(selectedLanguage.code)} {data?.Name}
                    </h2>
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-100/30 to-transparent rounded-lg p-4">
                      <img
                        src={robotImage}
                        alt="LangBuddy"
                        className="w-full h-[250px] object-contain drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Chat Interface */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
                    {/* Chat Messages */}
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto p-6 border-b"
                    >
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          } mb-4`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === "user"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {message.sender === "ai" ? (
                              <TypewriterMessage 
                                text={message.text} 
                                onComplete={() => setIsTyping(false)}
                              />
                            ) : (
                              <p className="whitespace-pre-wrap">{message.text}</p>
                            )}
                            <span className="text-xs opacity-75 mt-1 block">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                            <p>Typing...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input area */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <form onSubmit={handleSendMessage} className="space-y-3">
                        {/* Row 1: Text Input, Mic, Send */}
                        <div className="flex items-end space-x-2">
                          <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={`Type your message in ${selectedLanguage?.name}...`}
                            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                            rows="1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                              }
                            }}
                            disabled={!selectedLanguage || isLoading}
                          />
                          <button
                            type="button"
                            onClick={isListening ? stopListening : startListening}
                            className={`p-2 rounded-full flex-shrink-0 transition-colors duration-200 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} disabled:opacity-50`}
                            disabled={!selectedLanguage || isLoading}
                            aria-label={isListening ? "Stop listening" : "Start listening"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading || !inputMessage.trim() || !selectedLanguage}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex-shrink-0"
                          >
                            Send
                          </button>
                        </div>

                        {/* Row 2: Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                           <button
                            type="button"
                            onClick={handleRetakeTest}
                            disabled={isLoading || !selectedLanguage}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 text-sm"
                          >
                            Re-Take Test
                          </button>
                          <button
                            type="button"
                            onClick={handleEndTest}
                            disabled={isLoading || !selectedLanguage}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                          >
                            End Test ({userPromptCount}/7)
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AIPractice; 