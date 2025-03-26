import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroimage from "../assets/hero.png";
import robotImage from "../assets/robot.gif";
import Footer from "../components/Footer";

const Homepage = () => {
  let navigate = useNavigate();
  const auth = localStorage.getItem("userId");

  return (
    <>
      {auth && <Navbar />}
      <div className="bg-white">
        <section className="bg-[#FCF8F1] bg-opacity-30 py-10 sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <p className="text-base font-semibold tracking-wider text-blue-600 uppercase">
                  From words to conversation...
                </p>
                <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-5xl xl:text-6xl">
                  Learning Languages
                </h1>
                {localStorage.getItem("userId") == null ? (
                  <div className="mt-5 flex items-center">
                    <p className="text-gray-600">Already joined us?</p>
                    <button
                      onClick={() => navigate("/login")}
                      title=""
                      className="ml-2 text-purple-600 font-semibold transition-all duration-200 hover:text-purple-800"
                    >
                      Log in
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                <img className="w-full" src={heroimage} alt="" />
              </div>
            </div>
          </div>
        </section>
      </div>
      {auth && (
        <div className="bg-white from-bg-gray-200 to-bg-gray-500 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center mb-4 sm:mb-6">
              Select language
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
                onClick={() => navigate("/sanskrit")}
              >
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1">
                  क
                </span>{" "}
                Sanskrit
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
                onClick={() => navigate("/english")}
              >
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1">
                  A
                </span>{" "}
                English
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
                onClick={() => navigate("/gujarati")}
              >
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1">
                  ક
                </span>{" "}
                Gujarati
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
                onClick={() => navigate("/hindi")}
              >
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1">
                  क
                </span>{" "}
                Hindi
              </button>
            </div>
          </div>
        </div>
      )}
      {auth && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-float">
              <img 
                src={robotImage}
                alt="LangBuddy Robot" 
                className="mx-auto w-96 h-72 md:w-[700px] md:h-[500px]"
              />
            </div>
            <h2 className="mt-6 text-4xl font-bold text-gray-900">Where AI Meets Learning Languages</h2>
            <p className="mt-3 text-xl text-purple-600 font-semibold">Practice anytime and anywhere</p>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet LangBuddy - your intelligent language companion that transforms language learning from textbook theory to real-world fluency. 
              Whether you're a beginner or advanced learner, LangBuddy is here to chat, correct, and celebrate your progress.
            </p>
            <button
              onClick={() => navigate("/ai-practice")}
              className="mt-8 inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 group"
            >
              Practice with LangBuddy
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      <Footer />
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Homepage;
