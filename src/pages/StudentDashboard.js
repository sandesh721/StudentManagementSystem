import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../CSS/StudentDashboard.css"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const navigate = useNavigate(); 
  useEffect(() => {
   

const fetchStudentData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("No user logged in!");
    //   navigate("/login")
      return;
    }

    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("uid", "==", user.uid)); 
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const studentDoc = querySnapshot.docs[0]; 
      setStudent(studentDoc.data());
      setUpdatedStudent(studentDoc.data()); 
    } else {
      console.log("No student data found!");
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
};


    fetchStudentData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedStudent({ ...updatedStudent, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
          alert("No user logged in!");
          return;
        }
    
        const studentsRef = collection(db, "students");
        const q = query(studentsRef, where("uid", "==", user.uid)); // Query document where uid matches
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const studentDoc = querySnapshot.docs[0]; // Get first matching document
          const docRef = doc(db, "students", studentDoc.id); // Use Firestore-generated ID
    
          await updateDoc(docRef, updatedStudent);
          alert("Student data updated successfully!");
        } else {
          console.log("No student document found for this user.");
        }
      } catch (error) {
        console.error("Error updating student data:", error);
      }
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div>
        <Navbar />
      <div className="dashboard-container">
      <div className="student-info">
      <h2>Student Dashboard</h2>
        <div className="form-row">
          <div>
            <label>Registration Number:</label>
            <input type="text" value={student.registrationNumber} disabled />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={isEditing ? updatedStudent.name : student.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={isEditing ? updatedStudent.email : student.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={isEditing ? updatedStudent.phone : student.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Course:</label>
            <input type="text" value={student.course} disabled />
          </div>
          <div>
            <label>Attendance:</label>
            <input type="text" value={student.attendence} disabled />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Grade:</label>
            <input type="text" value={student.grade} disabled />
          </div>
          <div>
            <label>Joining Date:</label>
            <input type="text" value={student.createdAt} disabled />
          </div>
        </div>
        <br />
      <div className="buttons">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={handleEditClick}>Edit</button>
        )}
      </div>
      </div>

    </div>
    </div>
  );
};

export default StudentDashboard;
