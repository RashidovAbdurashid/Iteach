import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Groups from "./pages/Groups";
import Payments from "./pages/Payments";
import Workers from "./pages/Workers";
import Rooms from "./pages/Rooms";
import Subjects from "./pages/Subjects";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/students" element={<Students />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/employees" element={<Workers />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/subjects" element={<Subjects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
