/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Login.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../assets/CVNest_logo.jpg";
import { saveAccessToken, saveUserData } from "../../../helper/storage";
import auth from "../../../api/auth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (form.password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors("");

    try {
      const response = await auth.login(form.email, form.password);

      const { accessToken, user } = response.data.data;
      console.log("response: ", response.data);
      console.log("accessToken: ", accessToken);
      
      saveAccessToken(accessToken);
      saveUserData(user);

      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
      });

      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrors({ ...errors, general: errorMessage });
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
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
        <p className={styles.introText}>Đăng nhập để tiếp tục khám phá cơ hội nghề nghiệp!</p>
        <h2 className={styles.title}>Đăng nhập</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
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
          {errors.general && <span className={styles.error}>{errors.general}</span>}
          <div className={styles.forgotPasswordContainer}>
            <a href="/forgot-password" className={styles.forgotPasswordLink}>Quên mật khẩu?</a>
          </div>
          <button type="submit" className={styles.button}>Đăng nhập</button>
        </form>
        <p className={styles.loginLink}>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
