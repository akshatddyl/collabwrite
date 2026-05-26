import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import useStore from '../store';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, clearAuth } = useStore();

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    setAuth({ username: data.username, userId: data.userId }, data.token);
    navigate('/dashboard');
    return data;
  }, [setAuth, navigate]);

  const signup = useCallback(async (username, email, password) => {
    const data = await authService.signup(username, email, password);
    setAuth({ username: data.username, userId: data.userId }, data.token);
    navigate('/dashboard');
    return data;
  }, [setAuth, navigate]);

  const logout = useCallback(() => {
    authService.logout();
    clearAuth();
    navigate('/login');
  }, [clearAuth, navigate]);

  return { user, isAuthenticated, login, signup, logout };
};
