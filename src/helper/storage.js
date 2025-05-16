export const saveAccessToken = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
}

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
}

export const removeAccessToken = () => {
    localStorage.removeItem("accessToken");
};

// Added functions to handle user data
export const saveUserData = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
};

export const getUserData = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
    localStorage.removeItem("userData");
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
    return !!getAccessToken();
};

// Helper to get user role
export const getUserRole = () => {
    const userData = getUserData();
    return userData ? userData.role : null;
};

// Clear all auth data on logout
export const clearAuthData = () => {
    removeAccessToken();
    removeUserData();
};