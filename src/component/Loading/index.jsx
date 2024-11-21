import React from "react";

const Loading = ({ isLoading }) => {
  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center mt-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      )}
    </div>
  );
};

export default Loading;
