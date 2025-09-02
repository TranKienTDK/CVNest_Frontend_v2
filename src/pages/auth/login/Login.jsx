import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAccessToken, saveUserData } from "../../../helper/storage";
import auth from "../../../api/auth";
import { ROUTES } from "@/routes/routes";
import BrandingPanel from "./BrandingPanel";
import LoginForm from "./LoginForm";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    
    try {
      const response = await auth.login(email, password);
      const { accessToken, user } = response.data.data;
      
      saveAccessToken(accessToken);
      saveUserData(user);

      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Redirect based on user role
      if (user?.role === "HR") {
        navigate(ROUTES.HR_HOME);
      } else {
        navigate(ROUTES.HOME);
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding Panel */}
      <div className="hidden md:flex md:w-1/2">
        <BrandingPanel />
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 md:p-8 bg-[#F6F8D5]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <LoginForm onSubmit={handleLogin} />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
