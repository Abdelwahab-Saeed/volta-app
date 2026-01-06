import api from './axios';



export const register = (data) =>
  api.post('/register', data);

export const login = async (data) => {
  const res = await api.post('/login', data);
  localStorage.setItem('token', res.data.data.token);
  return res;
};

export const logout = async () => {
  await api.post('/logout');
  localStorage.removeItem('token');
};

export const me = () => api.get('/me');

export const updateProfile = (data) => api.post('/profile', data);

export const changePassword = (data) => api.post('/change-password', data);
export const forgotPassword = (data) => api.post('/password/forgot', data);
export const resetPassword = (data) => api.post('/password/reset', data);
