import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANTE: ALTERE ESTE IP PARA O IP DO SEU COMPUTADOR! ⚠️
// 
// Como descobrir seu IP:
// Windows: Abra CMD e digite 'ipconfig', procure por 'Endereço IPv4'
// Mac: Abra Terminal e digite 'ifconfig', procure por 'inet'
// Linux: Abra Terminal e digite 'hostname -I'
//
// Exemplos:
// const API_URL = 'http://192.168.1.100:3000/api';
// const API_URL = 'http://192.168.0.15:3000/api';
// const API_URL = 'http://10.0.0.5:3000/api';
//
const API_URL = 'http://192.168.0.11:3000/api'; // ✅ IP configurado!

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
