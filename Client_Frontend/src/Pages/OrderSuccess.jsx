import React from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Your order has been successfully placed. Thank you for ordering with
          us!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
