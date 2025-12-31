import api from './axios';



export const register = (data) =>
  api.post('/register', data);

export const login = async (data) => {
  const res = await api.post('/login', data);
  localStorage.setItem('token', res.data.token);
  return res;
};

export const logout = async () => {
  await api.post('/logout');
  localStorage.removeItem('token');
};

export const me = () => api.get('/me');
