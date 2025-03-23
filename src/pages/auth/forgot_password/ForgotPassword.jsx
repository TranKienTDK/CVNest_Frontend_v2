import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../../../api/auth";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
  
      if (email.includes("@")) {
        try {
          await auth.forgotPassword(email);
          toast.success("Mã xác thực đã được gửi tới email của bạn.", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/verify-code", { state: { email } });
          }, 1200);
        } catch (error) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        setError("Email không hợp lệ");
        toast.error("Email không hợp lệ.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
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
        </div>
        <p className={styles.introText}>Nhập email để nhận mã xác thực.</p>
        <h2 className={styles.title}>Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <img src="https://img.icons8.com/ios/50/new-post--v1.png" alt="email" className={styles.inputIcon} />
            <input type="email" name="email" placeholder="Nhập email của bạn" required className={styles.input} value={email} onChange={handleChange} />
            {error && <span className={styles.error}>{error}</span>}
          </div>
          <button type="submit" className={styles.button}>Gửi mã xác thực</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
