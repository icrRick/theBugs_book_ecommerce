import React, { createContext, useContext, useState, useEffect } from 'react';
import { removeToken, setToken, getToken } from '../utils/cookie';
import axiosInstance from '../utils/axiosInstance';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true)
      const token = getToken();
      if (!token) {
        setUserInfo(null);
        setIsAuthenticated(false);
        return null;
      }
      const response = await axiosInstance.get('/auth/profile');
      if (response.data.status === true) {
        setUserInfo(response.data.data);
        setIsAuthenticated(true);
        return response.data.data;
      } else {
        setUserInfo(null);
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error)
      setUserInfo(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const login = async (token) => {
    setToken(token);
    return fetchUserInfo();
  };

  const logout = () => {
    removeToken();
    setUserInfo(null);
    setIsAuthenticated(false);
    setIsInitialized(false);
  };

  const hasRole = (requiredRole) => {
    if (!userInfo?.role) return false;

    const userRole = parseInt(userInfo.role);
    const requiredRoleInt = parseInt(requiredRole);
    if (userRole === 2) {
      return requiredRoleInt <= 2;
    }
    return userRole === requiredRoleInt;
  };

  const contextValue = {
    userInfo,
    isAuthenticated,
    isInitialized,
    isLoading,
    setUserInfo,
    fetchUserInfo,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Lỗi khi sử dụng AuthContext. Vui lòng bọc component trong AuthProvider.');
  }
  return context;
}; 