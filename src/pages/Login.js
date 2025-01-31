import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase"; 
import "../CSS/login.css"; 
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.email === process.env.REACT_APP_ADMIN_EMAIL) {
          navigate("/Admindashboard");
        } else {
          navigate("/Studentdashboard");
        }
      }
    });
    return () => unsubscribe();
  }, []);
  const handleRegisterRedirect = () => {
    navigate("/register"); 
  };
  const handleForgotPasswordRedirect = ()=>{
    navigate("/forgotpassword")
  }
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;

      console.log("Login Successful!", user);
      toast.success("Login Successful!");
    

      if (user?.email === process.env.REACT_APP_ADMIN_EMAIL) {
        navigate("/Admindashboard"); 
      } else {
        navigate("/Studentdashboard"); 
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="login-container">
      
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" className="button">Login</button>
      </form>
      <p>
        Create an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={handleRegisterRedirect}>
          Register here
        </span>
        <span style={{ color: "blue", cursor: "pointer" }} onClick={handleForgotPasswordRedirect}>
          ForgotPassword?
        </span>
      </p>
      </div>
      <ToastContainer autoClose={2000} />

    </div>
  );
};

export default Login;
