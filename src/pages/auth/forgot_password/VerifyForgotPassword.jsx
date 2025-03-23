import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./VerifyForgotPassword.module.css"; // Import file CSS
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import auth from "../../../api/auth";

const VerifyForgotPassword = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Mảng để lưu mã code 6 ký tự
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);

    // Move focus to next input
    if (e.target.value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join(""); // Join the code array into a single string

    if (verificationCode.length === 6) {
      try {
        await auth.verifyForgotPassword(email, verificationCode);
        toast.success("Mã xác thực hợp lệ, bạn có thể thay đổi mật khẩu.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/reset-password", { state: { email, code: verificationCode } });
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
      toast.error("Mã xác thực phải có 6 ký tự.", {
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
        <p className={styles.introText}>Nhập mã xác thực đã gửi đến email của bạn.</p>
        <h2 className={styles.title}>Xác thực mã</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`code-input-${index}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className={styles.codeInput}
              />
            ))}
          </div>
          <button type="submit" className={styles.button}>Xác thực</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VerifyForgotPassword;
