
// eslint-disable-next-line react/prop-types
const Popup = ({ show, onClose, videoUrl }) => {
  if (!show) return null;

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
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 flex items-center justify-center">
          Learn This from Here 📚
        </h2>

        {/* Embedded Video */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={videoUrl}
            title="Helpful Video"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Popup;
