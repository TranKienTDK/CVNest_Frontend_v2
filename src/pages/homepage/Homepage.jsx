import React from "react";
import Header from "../../components/header/Header";
import styles from "./Homepage.module.css";

const Homepage = () => {
  return (
    <div>
      <Header />  {/* Hiển thị Header */}
      <div className={styles.homeContent}>
        <h1>Chào mừng đến với trang chủ</h1>
        <p>Trang chính sau khi đăng nhập thành công.</p>
        {/* Bạn có thể thêm các phần khác ở đây */}
      </div>
    </div>
  );
};

export default Homepage;
