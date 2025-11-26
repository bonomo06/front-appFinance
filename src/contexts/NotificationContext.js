import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [autoProcessEnabled, setAutoProcessEnabled] = useState(true);

  useEffect(() => {
    registerNotifications();
    
    const listeners = notificationService.setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationResponse
    );

    return () => {
      listeners.remove();
    };
  }, [autoProcessEnabled]);

  const registerNotifications = async () => {
    const token = await notificationService.registerForPushNotifications();
    if (token) {
      console.log('Push notification token:', token);
    }
  };

  const handleNotificationReceived = async (notification) => {
    console.log('Notificação recebida:', notification);
    
    setNotifications(prev => [...prev, notification]);

    if (autoProcessEnabled) {
      const result = await notificationService.processNotificationTransaction(notification);
      
      if (result.success) {
        Alert.alert(
          '💰 Transação Automática',
          `${result.transaction.category === 'income' ? 'Receita' : 'Despesa'} de R$ ${result.transaction.amount.toFixed(2)} registrada automaticamente!\n\n${result.transaction.description}`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleNotificationResponse = (response) => {
    console.log('Resposta da notificação:', response);
  };

  const toggleAutoProcess = () => {
    setAutoProcessEnabled(prev => !prev);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        autoProcessEnabled,
        toggleAutoProcess,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
  }
  return context;
};
