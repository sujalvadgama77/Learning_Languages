// eslint-disable-next-line react/prop-types
const Confirmation = ({ handleConfirmation, setShowConfirmationDialog }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">Confirmation</h3>
          <button
            type="button"
            onClick={() => setShowConfirmationDialog(false)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 mb-6">
          Are you sure you want to reset the recorded audio?
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleConfirmation}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-4 transition-colors duration-300"
          >
            Yes
          </button>
          <button
            onClick={() => setShowConfirmationDialog(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
