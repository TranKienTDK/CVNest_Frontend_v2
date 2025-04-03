import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgot_password/ForgotPassword";
import VerifyForgotPassword from "./pages/auth/forgot_password/VerifyForgotPassword";
import ResetPassword from "./pages/auth/forgot_password/ResetPassword";
import CompanyPage from "./pages/company/Companypage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'font-awesome/css/font-awesome.min.css';
import Homepage from "./pages/homepage/Homepage";
import JobPage from "./pages/job/JobPage";
import CompanyDetail from "./pages/company/CompanyDetail";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/nha-tuyen-dung" element={<CompanyPage />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/viec-lam-it" element={<JobPage />} />
        {/* <Route path="/nha-tuyen-dung" element={<CompanyPage />} /> */}
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App
