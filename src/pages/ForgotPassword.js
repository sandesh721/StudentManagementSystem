import React, { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/login.css"
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
        navigate("/login");
    } catch (err) {
        toast.error(err.message);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="login-container">
      
      <form onSubmit={handleReset} className="login-form">
        <h2>Reset Password</h2>
        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button">Send</button>
      </form>
      
      </div>
      <ToastContainer autoClose={2000} />

    </div>
  );
};

export default ForgotPassword;
