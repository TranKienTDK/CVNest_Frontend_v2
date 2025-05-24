import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import userAPI from "@/api/user";
import { Camera, CheckCircle, Info, Lock, Mail, Phone, Calendar, User, Shield, Eye, EyeOff } from "lucide-react";
import styles from "./UserProfile.module.css";

// Helper để lấy thông tin người dùng từ localStorage
const getUserData = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

const UserProfile = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const userId = userData?.id;

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile data
  const [profileData, setProfileData] = useState({
    id: "",
    username: "",
    phone: "",
    dateOfBirth: "",
    avatar: "",
    email: "", // Thêm email cho hiển thị (dù không update)
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Avatar preview
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  useEffect(() => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để xem thông tin cá nhân");
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getUserProfile(userId);
        const data = response.data.data;
        
        setProfileData({
          id: data.id || userId,
          username: data.username || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          avatar: data.avatar || "",
          email: data.email || userData?.email || "",
        });
        
        setPreviewUrl(data.avatar || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Không thể tải thông tin người dùng");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const updateProfile = async () => {
    try {
      setUpdateLoading(true);
      
      let avatarUrl = profileData.avatar;
      
      // Upload avatar if a new file is selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        
        const uploadResponse = await userAPI.uploadAvatar(formData);
        avatarUrl = uploadResponse.data.data;
      }
      
      // Update profile with avatar URL
      const { email, ...dataToSend } = profileData;
      const updatedData = {
        ...dataToSend,
        avatar: avatarUrl
      };
      
      await userAPI.updateProfile(userId, updatedData);
      
      toast.success("Cập nhật thông tin thành công");
      
      // Update localStorage
      const currentUserData = getUserData();
      if (currentUserData) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...currentUserData,
            username: profileData.username,
            avatar: avatarUrl,
            phone: profileData.phone
          })
        );
      }
      
      setUpdateLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Lỗi khi cập nhật thông tin");
      setUpdateLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setPasswordLoading(true);
      
      const { confirmPassword, ...passwordToSend } = passwordData;
      
      await userAPI.changePassword(userId, passwordToSend);
      
      toast.success("Đổi mật khẩu thành công");
      setPasswordLoading(false);
      
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="w-full max-w-5xl mx-auto mt-20 p-6">
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D83B01]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="w-full max-w-5xl mx-auto mt-20 p-6">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Thông tin cá nhân
        </h1>
        
        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${styles['tab-button']} ${
              activeTab === "profile"
                ? `text-[#D83B01] border-b-2 border-[#D83B01] ${styles.active}`
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} /> Thông tin cá nhân
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${styles['tab-button']} ${
              activeTab === "password"
                ? `text-[#D83B01] border-b-2 border-[#D83B01] ${styles.active}`
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("password")}
          >
            <Lock size={18} /> Đổi mật khẩu
          </button>
        </div>
        
        {activeTab === "profile" && (
          <div className={`bg-white rounded-lg shadow-md overflow-hidden ${styles['profile-card']} ${styles['profile-section']}`}>
            {/* Avatar section */}
            <div className="flex flex-col sm:flex-row items-center bg-gray-50 p-6 border-b">
              <div className={`relative mb-4 sm:mb-0 sm:mr-8 ${styles['avatar-container']}`}>
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={previewUrl || "https://via.placeholder.com/150?text=User"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-[#D83B01] rounded-full p-2 cursor-pointer hover:bg-[#b43000] transition-colors ${styles['avatar-upload-label']}`}
                >
                  <Camera size={18} className="text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {profileData.username || "Chưa cập nhật tên"}
                </h2>
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-[#D83B01]" />
                  {profileData.email}
                </p>
                {profileData.phone && (
                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-[#D83B01]" />
                    {profileData.phone}
                  </p>
                )}
                {avatarFile && (
                  <p className="text-sm text-[#D83B01] mt-2 italic">
                    Hình ảnh mới sẽ được lưu khi bạn cập nhật thông tin
                  </p>
                )}
              </div>
            </div>

            {/* Profile form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={styles['form-group']}>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <User size={14} className="text-[#D83B01]" /> Họ và tên
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    placeholder="Nhập họ và tên"
                    className={`w-full ${styles['form-input']}`}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Mail size={14} className="text-[#D83B01]" /> Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="w-full bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Info size={12} /> Email không thể thay đổi
                  </p>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Phone size={14} className="text-[#D83B01]" /> Số điện thoại
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="Nhập số điện thoại"
                    className={`w-full ${styles['form-input']}`}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar size={14} className="text-[#D83B01]" /> Ngày sinh
                  </label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                    className={`w-full ${styles['form-input']}`}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  className={`bg-[#D83B01] hover:bg-[#b43000] flex items-center gap-2 ${styles['save-button']}`}
                  onClick={updateProfile}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <span className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ${styles.spinner}`}></span>
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Lưu thông tin</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "password" && (
          <div className={`bg-white rounded-lg shadow-md overflow-hidden p-6 ${styles['profile-card']} ${styles['password-section']}`}>
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Shield size={20} className="text-[#D83B01]" />
                Đổi mật khẩu
              </h2>

              <div className="space-y-4">
                <div className={styles['form-group']}>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Lock size={14} className="text-[#D83B01]" /> Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type={showPassword.oldPassword ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      className={`w-full ${styles['form-input']} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.oldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Lock size={14} className="text-[#D83B01]" /> Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword.newPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu mới"
                      className={`w-full ${styles['form-input']} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Lock size={14} className="text-[#D83B01]" /> Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword.confirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className={`w-full ${styles['form-input']} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className={`w-full bg-[#D83B01] hover:bg-[#b43000] flex items-center justify-center gap-2 ${styles['save-button']}`}
                    onClick={changePassword}
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <span className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ${styles.spinner}`}></span>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <Shield size={16} />
                        <span>Đổi mật khẩu</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
