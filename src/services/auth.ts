import api from './api';

export const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const isAdmin = (): boolean => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    try {
        const parsedUser = JSON.parse(user);
        return parsedUser.role === 'admin';
    } catch {
        return false;
    }
};

export default {
    register,
    login,
    getProfile,
    logout,
    isAuthenticated,
    isAdmin,
};
