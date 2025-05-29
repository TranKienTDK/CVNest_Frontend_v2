import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../assets/CVNest_logo.jpg";
import auth from "../../../api/auth";
import RegisterForm from "./RegisterForm";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      await auth.register(data);

      toast.success("Đăng ký thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log("Đăng ký thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.error("Lỗi đăng ký:", error.response?.data?.message || "Lỗi không xác định");
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#205781] via-[#4F959D] to-[#164563] text-white flex-col justify-center items-center p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.h1
              className="text-4xl font-bold tracking-wider"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              CVNest
            </motion.h1>
            <img
              src={logo}
              alt="CVNest Logo"
              className="w-16 h-16 object-contain rounded-full bg-white p-1"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            Xây dựng tương lai nghề nghiệp của bạn
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý
            tưởng với nền tảng CVNest
          </p>

          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <p className="italic text-white/90">
              "CVNest đã giúp tôi tìm được công việc mơ ước chỉ sau 2 tuần. Giao
              diện dễ sử dụng và các mẫu CV chuyên nghiệp!"
            </p>
            <p className="mt-4 font-semibold">
              - Eric Johnson, Software Engineer
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side registration form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8 bg-[#F6F8D5]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <RegisterForm onSubmit={handleRegister} logo={logo} />
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;

