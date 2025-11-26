import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#BB86FC',
    secondary: '#03dac6',
    accent: '#03dac6',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
    success: '#4CAF50',
    warning: '#FF9800',
    income: '#4CAF50',
    expense: '#F44336',
    text: '#FFFFFF',
    onSurface: '#FFFFFF',
    disabled: '#666666',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.8)',
  },
};

export const colors = {
  primary: '#BB86FC',
  secondary: '#03dac6',
  accent: '#03dac6',
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  error: '#CF6679',
  success: '#4CAF50',
  warning: '#FF9800',
  income: '#4CAF50',
  expense: '#F44336',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  disabled: '#666666',
  
  // Cores para tipos de transação
  pix: '#32BCAD',
  credit: '#FF6B6B',
  debit: '#4ECDC4',
  cash: '#95E1D3',
};
