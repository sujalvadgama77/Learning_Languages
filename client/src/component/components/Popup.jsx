// eslint-disable-next-line react/prop-types
const Popup = ({ show, onClose, currentLetter }) => {
  if (!show) return null;

  const playDemoAudio = () => {
    try {
      // Construct the audio file path based on the pronunciation
      const audioPath = `/audio/sanskrit/${currentLetter}.mp3`;
      
      // Create and play the audio
      const audio = new Audio(audioPath);
      audio.play().catch((error) => {
        console.error("Error playing demo audio:", error);
      });
    } catch (error) {
      console.error("Error in playDemoAudio:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
          Listen and Learn 🎧
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-8">
          Listen to the correct pronunciation and try again
        </p>

        {/* Play Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={playDemoAudio}
            className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full flex items-center space-x-2 transform transition-transform duration-200 hover:scale-105"
          >
            <span className="text-2xl">▶</span>
            <span>Play Pronunciation</span>
          </button>
        </div>

        {/* Try Again Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transform transition-transform duration-200 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
