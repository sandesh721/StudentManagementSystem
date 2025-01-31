import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { db, auth, collection, addDoc, createUserWithEmailAndPassword } from "../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import "../CSS/register.css"
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Register = () => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
    confirmpassword: "",
  });
  const navigate = useNavigate(); 
 
  const handleLoginRedirect = () => {
    navigate("/login"); 
  };
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (student.password != student.confirmpassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (student.name.length < 2) {
      toast.error("Name should be at least 2 characters long.");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(student.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (student.phone.length !== 10 || isNaN(student.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(student.password)) {
      toast.error("Password must contain both letters and numbers, and be at least 6 characters long.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, student.password);
      const user = userCredential.user;
      console.log(user);
      const counterDocRef = doc(db, "counters", "registration_number");
      const counterDoc = await getDoc(counterDocRef);

      let registrationNumber = 1;
      if (counterDoc.exists()) {
        registrationNumber = counterDoc.data().lastNumber + 1;
      }
      await addDoc(collection(db, "students"), {
        uid: user.uid,
        registrationNumber: registrationNumber,
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        attendence:"Not Updated",
        grade:"Not Updated",
        createdAt: new Date().toISOString().split('T')[0],
      });
      await updateDoc(counterDocRef, {
        lastNumber: registrationNumber,
      });
      console.log("Registration Successful!");
      toast.success("Registration successful! You can now log in.");
      navigate("/login"); 
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="registration_container">
      <Navbar />
      <form onSubmit={handleSubmit} className="form">
        <h2>Register</h2>
        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          value={student.name}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={student.email}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Phone</label>
        <input
          type="text"
          name="phone"
          value={student.phone}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Course</label>
        <input
          type="text"
          name="course"
          value={student.course}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          value={student.password}
          onChange={handleChange}
          className="input"
        />
        <label className="label">Confirm Password</label>
        <input
          type="text"
          name="confirmpassword"
          value={student.confirmpassword}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" className="button">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={handleLoginRedirect}>
          Login here
        </span>
      </p>
      <ToastContainer autoClose={2000} />

    </div>
  );
};

export default Register;
