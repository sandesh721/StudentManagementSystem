import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Firebase configuration
import { collection, getDocs, doc,query, where, updateDoc, deleteDoc } from "firebase/firestore";
import "../CSS/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [adminDetails, setAdminDetails] = useState({
    name: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
    phone: "",
  });
  const [currentStudent, setCurrentStudent] = useState(null);
  const navigate = useNavigate(); 
  useEffect(() => {
    fetchAdminDetails();
    fetchStudents();
  }, []);
  const fetchAdminDetails = async () => {
    try{
        const user = auth.currentUser;
        if(!user){
            toast.error("No user logged in");
            navigate("/login");
            return;
        }
        const adminRef = collection(db,"admin"); 
        const q = query(adminRef,where("uid","==",user.uid));
        const adminSnapshot = await getDocs(adminRef);
        
        if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            // console.log(adminDoc);
          setAdminDetails(adminDoc.data());
        } else {
            toast.error("Admin details not found");
        }
    }
    catch(error){
        console.log(error);
    }
  };
  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const studentList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setStudents(studentList);
  };

  const handleUpdateProfile = async () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveStudent = async (studentId, updatedData) => {
    try{
        const studentRef = doc(db, "students", studentId);
        await updateDoc(studentRef, updatedData);
        fetchStudents();
        toast.success("Data Saved Successfully!");
    }
    catch(error){
        toast.error("Error while Updating the data");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try{

        const studentRef = doc(db, "students", studentId);
        await deleteDoc(studentRef);
        fetchStudents(); 
        toast.success("Student Deleted Successfully!");
    }
    catch(error){
        toast.error("Error while deleting data");
    }
  };

  const filteredStudents = students
    .filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((student) => (selectedCourse ? student.course === selectedCourse : true))
    .sort((a, b) => {
      if (sortOption === "grade-high-low") return b.grade - a.grade;
      if (sortOption === "grade-low-high") return a.grade - b.grade;
      if (sortOption === "Registration No.") return a.registrationNumber - b.registrationNumber;
      return 0;
    });
    
    
  return (
    <div className="admin-dashboard">
        <ToastContainer autoClose={2000} />

        <Navbar />
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("students")}>Student Details</button>
      </aside>
      <main className="content">
        {activeTab === "profile" && (
          <div className="profile-section">
            <h2>Admin Profile</h2>
            <div className="profile-fields">
              <label>Name:</label>
              <input
                type="text"
                value={adminDetails.name}
                onChange={(e) => setAdminDetails({ ...adminDetails, name: e.target.value })}
                disabled={!isEditing}
              />
              <label>Email:</label>
              <input type="email" value={adminDetails.email} disabled />
              <label>Phone:</label>
              <input
                type="text"
                value={adminDetails.phone}
                onChange={(e) => setAdminDetails({ ...adminDetails, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <button onClick={handleUpdateProfile} className="UpdateEdit">
              {isEditing ? "Update" : "Edit"}
            </button>
          </div>
        )}
        {activeTab === "students" && (
          <div className="student-section">
            <h2>Student List</h2>
            <input type="text" placeholder="Search students..." onChange={(e) => setSearchTerm(e.target.value)} />
            <select onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="grade-high-low">Grade: High to Low</option>
              <option value="grade-low-high">Grade: Low to High</option>
              <option value="Registration No.">Registration Number</option>
            </select>
            <select onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Filter by Course</option>
              {Array.from(new Set(students.map((s) => s.course))).map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <ul>
              {filteredStudents.map((student) => (
                <li key={student.id} onClick={() => setCurrentStudent(student)}>
                  {student.registrationNumber} - {student.name} - {student.course}
                </li>
              ))}
            </ul>

            {currentStudent && (
                <div className="student-details">
                  <h3>Student Details</h3>
                
                <div className="details" >
                    <label>Registration Number:</label>
                    <input
                    type="text"
                    value={currentStudent.registrationNumber}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, registrationNumber: e.target.value })}
                    />
               </div>
               <div className="details" >
                <label>Name:</label>
                <input
                  type="text"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                />
                </div>
                <div className="details" >
                <label>Email:</label>
                <input
                  type="text"
                  value={currentStudent.email}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                />
                </div>
                <div className="details" >
                <label>Phone:</label>
                <input
                  type="text"
                  value={currentStudent.phone}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
                />
                </div>
                <div className="details" >
                <label>Course:</label>
                <input
                  type="text"
                  value={currentStudent.course}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, course: e.target.value })}
                />
               </div>
               <div className="details" >
                <label>Attedence:</label>
                <input
                  type="text"
                  value={currentStudent.attendence}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, attendence: e.target.value })}
                />
                </div>
                <div className="details" >
                <label>Grade:</label>
                <input
                  type="text"
                  value={currentStudent.grade}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, grade: e.target.value })}
                />
                </div>
                <div className="details" >
                <label>Joining Date:</label>
                <input
                  type="text"
                  value={currentStudent.createdAt}
                  disabled
                />
                </div> 
                <br />
                <button className="save" onClick={() => handleSaveStudent(currentStudent.id, currentStudent)}>Save</button>
                <button className="delete" onClick={() => handleDeleteStudent(currentStudent.id)}>Delete</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
