import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("/api/v1/user/resetPassword", {
        token,
        newPassword,
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Reset Password
        </button>
      </form>
      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
