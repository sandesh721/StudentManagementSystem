import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
function App() {
  return (
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<Home bg="white"/>} />
         <Route path="/Studentdashboard" element={<StudentDashboard />} />
        <Route path="/Admindashboard" element={<AdminDashboard />} />
        {/* <Route path="/Studentdashboard/:id" element={<ReadArticle />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </div>
</Router>
  );
}

export default App;
