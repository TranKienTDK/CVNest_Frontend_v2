import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { motion } from "framer-motion";
import "@fontsource/poppins";
import logo from "../../../assets/CVNest_logo.jpg";
import auth from "../../../api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!form.username.trim()) newErrors.username = "Tên người dùng không được để trống";
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (form.password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = {
          username: form.username,
          email: form.email,
          password: form.password,
        };
  
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
        }, 2000)
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
        setErrors({ api: error.response?.data?.message || "Đăng ký thất bại" });
      }
    }
  };

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className={styles.formWrapper} initial={{ y: -50 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 120 }}>
        <div className={styles.headerContainer}>
          <motion.h1 
            className={styles.siteTitle} 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: "spring", stiffness: 150 }}>
            CVNest
          </motion.h1>
          <img src={logo} alt="CVNest Logo" className={styles.logo} />
        </div>
        <p className={styles.introText}>Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng</p>
        <h2 className={styles.title}>Đăng ký</h2>
        <p className={styles.subtitle}>Tạo tài khoản miễn phí ngay hôm nay!</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <img src="https://img.icons8.com/ios/50/user--v1.png" alt="user" className={styles.inputIcon} />
            <input type="text" name="username" placeholder="Tên người dùng" required className={styles.input} value={form.username} onChange={handleChange} />
            {errors.username && <span className={styles.error}>{errors.username}</span>}
          </div>
          <div className={styles.inputWrapper}>
            <img src="https://img.icons8.com/ios/50/new-post--v1.png" alt="email" className={styles.inputIcon} />
            <input type="email" name="email" placeholder="Email" required className={styles.input} value={form.email} onChange={handleChange} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <div className={styles.inputWrapper}>
            <img src="https://img.icons8.com/ios/50/password--v1.png" alt="password" className={styles.inputIcon} />
            <input type="password" name="password" placeholder="Mật khẩu" required className={styles.input} value={form.password} onChange={handleChange} />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
          <div className={styles.inputWrapper}>
            <img src="https://img.icons8.com/ios/50/password--v1.png" alt="confirm-password" className={styles.inputIcon} />
            <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required className={styles.input} value={form.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className={styles.button}>Đăng ký ngay</button>
        </form>
        <p className={styles.loginLink}>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default Register;

