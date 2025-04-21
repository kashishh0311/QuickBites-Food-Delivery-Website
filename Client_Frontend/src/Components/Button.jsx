import React, { useState } from "react";

function Button({ text, onClick }) {
  return (
    <div className="mt-2">
      <button
        className="mt-4 bg-orange-400 hover:bg-orange-500 font-bold text-white py-2 px-4 rounded w-32 h-4/5"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}

export default Button;
