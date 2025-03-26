import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import robotImage from "../assets/chatbot.gif";
import { auth, db } from "../../firebase/Firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const AIPractice = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [data, setData] = useState(null);

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

  const getGreeting = (langCode) => {
    const greetings = {
      en: "Hello",
      sa: "नमस्कारः",
      hi: "नमस्ते",
      gu: "નમસ્તે"
    };
    return greetings[langCode] || greetings.en;
  };

  const languages = [
    { name: "Sanskrit", code: "sa", icon: "क" },
    { name: "English", code: "en", icon: "A" },
    { name: "Gujarati", code: "gu", icon: "ક" },
    { name: "Hindi", code: "hi", icon: "क" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // TODO: Add AI response logic here
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
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
                  Select a language and start chatting to improve your skills
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
                  <div className="bg-white p-6 rounded-xl shadow-lg h-[600px] flex flex-col">
                    <h2 className="text-2xl font-bold text-center mb-4 text-purple-600">
                      {getGreeting(selectedLanguage.code)} {data?.Name}
                    </h2>
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={robotImage}
                        alt="LangBuddy"
                        className="w-full h-[800px] object-contain"
                      />
                    </div>
                    
                  </div>
                </div>

                {/* Right Column - Chat Interface */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 border-b">
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
                            <p>{message.text}</p>
                            <span className="text-xs opacity-75 mt-1 block">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 rounded-b-xl">
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="submit"
                          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          Send
                        </button>
                      </div>
                    </form>
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