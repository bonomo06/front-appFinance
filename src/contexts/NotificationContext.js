import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { notificationService } from '../services/notificationService';
import bankNotificationListener from '../services/bankNotificationListener';

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [autoProcessEnabled, setAutoProcessEnabled] = useState(true);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  useEffect(() => {
    registerNotifications();
    checkAndRequestNotificationAccess();
    
    const listeners = notificationService.setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationResponse
    );

    // Listener para notificações bancárias (Android nativo)
    const bankListener = bankNotificationListener.addListener(handleBankNotification);

    return () => {
      listeners.remove();
      bankListener.remove();
    };
  }, [autoProcessEnabled]);

  const checkAndRequestNotificationAccess = async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    const hasPermission = await bankNotificationListener.checkPermission();
    setHasNotificationPermission(hasPermission);

    if (!hasPermission) {
      Alert.alert(
        '🔔 Permissão Necessária',
        'Para ler notificações bancárias automaticamente, você precisa conceder permissão de acesso às notificações.\n\n' +
        '1. Toque em "Abrir Configurações"\n' +
        '2. Encontre "App Finanças"\n' +
        '3. Ative a permissão',
        [
          { text: 'Agora Não', style: 'cancel' },
          {
            text: 'Abrir Configurações',
            onPress: async () => {
              await bankNotificationListener.requestPermission();
              // Verificar novamente após 2 segundos
              setTimeout(async () => {
                const permitted = await bankNotificationListener.checkPermission();
                setHasNotificationPermission(permitted);
                if (permitted) {
                  Alert.alert('✅ Sucesso!', 'Permissão concedida. O app agora pode ler notificações bancárias.');
                }
              }, 2000);
            }
          }
        ]
      );
    }
  };

  const handleBankNotification = async (notification) => {
    console.log('🏦 Notificação bancária detectada:', notification);
    
    if (!autoProcessEnabled) {
      console.log('⏸️ Processamento automático desativado');
      return;
    }

    // Criar objeto de notificação no formato esperado
    const formattedNotification = {
      request: {
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            appName: notification.appName,
            packageName: notification.packageName
          }
        }
      }
    };

    const result = await notificationService.processNotificationTransaction(formattedNotification);
    
    if (result.success) {
      Alert.alert(
        '💰 Transação Automática',
        `${result.transaction.category === 'income' ? '✅ Receita' : '❌ Despesa'} de R$ ${result.transaction.amount.toFixed(2)} registrada!\n\n` +
        `📱 ${notification.appName}\n` +
        `📝 ${result.transaction.description}`,
        [{ text: 'OK' }]
      );
      
      // Adicionar às notificações processadas
      setNotifications(prev => [...prev, { ...notification, processed: true, transaction: result.transaction }]);
    } else {
      console.log('❌ Não foi possível processar:', result.reason);
    }
  };

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
        hasNotificationPermission,
        toggleAutoProcess,
        clearNotifications,
        requestNotificationAccess: checkAndRequestNotificationAccess,
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
