import API from "./axios.config";

const userAPI = {
  uploadAvatar: (formData) => {
    return API.post("/user/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateProfile: (userId, profileData) => {
    return API.put(`/user/${userId}/profile`, profileData);
  },

  changePassword: (userId, passwordData) => {
    return API.put(`/user/${userId}/change-password`, passwordData);
  },

  getUserProfile: (userId) => {
    return API.get(`/user/${userId}/profile`);
  },
};

export default userAPI;
