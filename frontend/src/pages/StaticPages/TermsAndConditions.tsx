import React from "react";

function TermsAndConditions() {
  return (
    <div className="flex flex-col justify-start items-center h-full w-full px-4 sm:py-6 py-0 text-white z-1 select-none">
      <div className="text-center text-4xl sm:text-5xl font-bold sm:mt-4 sm:mb-6 mb-3">
        Terms and Conditions
      </div>
    </div>
  );
}

export default React.memo(TermsAndConditions);