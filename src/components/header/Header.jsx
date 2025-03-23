import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/CVNest_logo.jpg";
import auth from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.headerContainer}>
        <div className={styles.leftSection}>
          <img src={logo} alt="CVNest Logo" className={styles.logo} />
          <div className={styles.navLinks}>
            <a href="/home" className={styles.navItem}>Trang chủ</a>
            <a href="/jobs" className={styles.navItem}>Việc làm</a>
            <a href="/companies" className={styles.navItem}>Công ty</a>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.notificationIcon}>
            <FontAwesomeIcon icon={faBell} />
          </div>
          
          <div className={styles.chatIcon}>
            <FontAwesomeIcon icon={faRocketchat} />
          </div>
          
          <div className={styles.avatar} onClick={handleDropdownToggle}>
            <FontAwesomeIcon icon={faUserTie} />
            <span className={styles.arrowDown}>▼</span>
          </div>

          {isDropdownOpen && (
            <div ref={dropdownRef} className={styles.dropdown}>
              <div className={styles.dropdownItem} onClick={handleProfileClick}>Profile</div>
              <div className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
