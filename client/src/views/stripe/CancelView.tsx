export const CancelView = () => {
  return (
    <div className=" flex  justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-ds-2 p-8 text-center">
        <svg
          className="mx-auto h-16 w-16 text-ds-accent1-400 mb-4"
          xmlns="http://www.w3.org/2000/svg"
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your transaction was not completed. Don't worry, you can try again
          anytime.
        </p>
        <button
          onClick={() => (window.location.href = "/stripe/products")}
          className="px-6 py-2 bg-ds-primary-500 text-white rounded hover:bg-ds-primary-600 transition"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
};
