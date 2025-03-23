import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ResetPassword.module.css"; // Import file CSS
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import auth from "../../../api/auth";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword === confirmPassword) {
      try {
        await auth.resetPassword(email, code, newPassword);
        toast.success("Mật khẩu đã được thay đổi thành công.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      setError("Mật khẩu xác nhận không khớp.");
      toast.error("Mật khẩu xác nhận không khớp.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className={styles.formWrapper} initial={{ y: -50 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 120 }}>
        <div className={styles.headerContainer}>
          <motion.h1 className={styles.siteTitle}>CVNest</motion.h1>
        </div>
        <p className={styles.introText}>Nhập mật khẩu mới của bạn.</p>
        <h2 className={styles.title}>Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              name="newPassword"
              placeholder="Mật khẩu mới"
              required
              className={styles.input}
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              required
              className={styles.input}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>
          <button type="submit" className={styles.button}>Đặt lại mật khẩu</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
