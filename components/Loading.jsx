import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-blue-50 to-purple-50 w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="mt-4 text-lg font-medium text-indigo-600">Loading...</p>
    </div>
  );
};

export default Loading;
