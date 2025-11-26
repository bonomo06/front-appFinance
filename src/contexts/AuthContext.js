import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/apiServices';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredToken();
  }, []);

  const loadStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await loadUser();
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const userData = await authService.getMe();
      console.log('Dados do usuário recebidos:', userData);
      setUser(userData.user || userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      await signOut();
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response;
      
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await authService.register({ name, email, password });
      const { token: newToken, user: userData } = response;
      
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao criar conta' 
      };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
