import { code } from 'framer-motion/client';
import API from './axios.config';

const auth = {
    register: (credentials) => {
        const url = "/auth/register";
        return API.post(url, credentials);
    },
    login: (email, password) => {
        const url = "/auth/login";
        return API.post(url, { email, password });
    },
    forgotPassword: (email) => {
        const url = `/auth/forgot-password?email=${encodeURIComponent(email)}`;
        return API.post(url);
    },
    verifyForgotPassword: (email, code) => {
        const url = "/auth/verify-forgot-password";
        return API.post(url, { email, code });
    },
    resetPassword: (email, code, newPassword) => {
        const url = "/auth/reset-password";
        return API.post(url, { email, code, newPassword });
    },
    logout: () => {
        const url = "/auth/logout";
        return API.post(url);
    }
}

export default auth