import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function ForgotPassword() {
  // State to manage email input
  const [email, setEmail] = useState("");

  // State to manage validation errors
  const [error, setError] = useState("");

  // State to show success message
  const [successMessage, setSuccessMessage] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email input
    if (!email) {
      setError("Please enter your email");
      return;
    } else if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    // Simulate API request to send reset link
    setSuccessMessage("A password reset link has been sent to your email.");
    setError("");

    // Clear the input after success
    setEmail("");
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="container mx-auto px-8 py-8 shadow-lg w-1/3 rounded-lg bg-white">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your registered email address to receive a reset link.
        </p>

        {/* Show success message */}
        {successMessage && (
          <p className="text-green-600 text-center">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* Submit button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 focus:ring-2 focus:ring-teal-400"
            >
              Send Reset Link
            </button>
          </div>

          {/* Link to login page using NavLink */}
          <div className="text-center mt-4">
            <NavLink
              to="/login"
              className="text-teal-600 text-sm font-semibold hover:underline"
            >
              Back to Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
