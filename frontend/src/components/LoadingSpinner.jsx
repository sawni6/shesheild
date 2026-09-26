const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-8">
      <div className="w-4 h-4 border-2 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
      {text}
    </div>
  );
};

export default LoadingSpinner;
