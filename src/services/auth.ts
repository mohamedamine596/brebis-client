import api from './api';

export const register = async (name: string, email: string, password: string) => {
    try {
        const response = await api.post('/auth/register', { nom: name, email, password });
        const { user, token } = response.data.data;
        
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('brebis_user', JSON.stringify(user));
        }
        
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data.data;
        
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('brebis_user', JSON.stringify(user));
        }
        
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
};

// returns parsed user object saved in localStorage (fallbacks for different keys)
export const getUser = (): any => {
  const raw =
    localStorage.getItem('brebis_user') ||
    localStorage.getItem('user') ||
    localStorage.getItem('currentUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// simple logout helper that clears auth data from localStorage
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('brebis_token');
  localStorage.removeItem('user');
  localStorage.removeItem('brebis_user');
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user && user.role === 'admin';
};

const authService = {
    register,
    login,
    getProfile,
    logout,
    isAuthenticated,
    isAdmin,
};

export default authService;
