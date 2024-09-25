import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full  w-full">
      <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
      <p className="text-xl font-semibold text-red-600">Error</p>
    </div>
  );
};

export default Error;
