import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { transactionService } from './apiServices';

// Configuração de como as notificações devem ser tratadas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async registerForPushNotifications() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Transações',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6200ee',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permissão para notificações negada');
        return null;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      console.log('Deve usar um dispositivo físico para notificações push');
    }

    return token;
  },

  /**
   * Processa notificação recebida e extrai informações de transação
   * @param {Object} notification - Objeto de notificação
   * @returns {Object|null} - Dados da transação extraídos ou null
   */
  extractTransactionFromNotification(notification) {
    try {
      const { title, body } = notification.request.content;
      const text = `${title || ''} ${body || ''}`.toLowerCase();

      // Padrões para detectar tipo de transação
      const isPix = text.includes('pix') || text.includes('transferência recebida') || text.includes('transferencia recebida');
      const isDebit = text.includes('débito') || text.includes('debito') || text.includes('compra no débito');
      const isCredit = text.includes('crédito') || text.includes('credito') || text.includes('compra no crédito') || text.includes('fatura');
      
      // Se não for transação financeira, retorna null
      if (!isPix && !isDebit && !isCredit) {
        return null;
      }

      // Extrai valor (procura por padrões como R$ 100,00 ou 100.00 ou 100,00)
      const valuePatterns = [
        /r\$\s*(\d+(?:[.,]\d{3})*[.,]\d{2})/i,  // R$ 1.000,00 ou R$ 1000,00
        /(\d+(?:[.,]\d{3})*[.,]\d{2})/,         // 1.000,00 ou 1000,00
        /(\d+[.,]\d{2})/                         // 100,00 ou 100.00
      ];

      let amount = null;
      for (const pattern of valuePatterns) {
        const match = text.match(pattern);
        if (match) {
          // Remove pontos de milhar e substitui vírgula por ponto
          amount = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
          break;
        }
      }

      if (!amount || isNaN(amount)) {
        return null;
      }

      // Determina se é entrada ou saída
      const isIncome = text.includes('recebido') || text.includes('recebeu') || 
                       text.includes('depósito') || text.includes('deposito') ||
                       text.includes('crédito em conta') || text.includes('credito em conta') ||
                       text.includes('entrada');
      
      let type = 'pix';
      if (isDebit) type = 'debit';
      if (isCredit) type = 'credit';

      // Tenta extrair descrição
      let description = 'Transação automática via notificação';
      
      // Procura por padrões de descrição comuns
      const descPatterns = [
        /(?:de|para|em)\s+([^\d\r\n]{3,30}?)(?:\s*r\$|\s*\d|$)/i,
        /^([^\d\r\n]{3,30}?)(?:\s*r\$|\s*\d)/i
      ];

      for (const pattern of descPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          description = match[1].trim();
          break;
        }
      }

      return {
        type,
        category: isIncome ? 'income' : 'expense',
        amount,
        description: description.charAt(0).toUpperCase() + description.slice(1),
        categoryTag: isIncome ? 'Receita' : 'Despesa',
        isAutomatic: true,
        balanceType: 'main',
      };
    } catch (error) {
      console.error('Erro ao extrair transação da notificação:', error);
      return null;
    }
  },

  /**
   * Processa e cria transação automaticamente a partir de notificação
   */
  async processNotificationTransaction(notification) {
    const transactionData = this.extractTransactionFromNotification(notification);
    
    if (transactionData) {
      try {
        await transactionService.create(transactionData);
        return { success: true, transaction: transactionData };
      } catch (error) {
        console.error('Erro ao criar transação automática:', error);
        return { success: false, error };
      }
    }
    
    return { success: false, reason: 'Não é uma transação financeira' };
  },

  /**
   * Configura listeners para notificações
   */
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        onNotificationReceived && onNotificationReceived(notification);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        onNotificationResponse && onNotificationResponse(response);
      }
    );

    return {
      notificationListener,
      responseListener,
      remove: () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      },
    };
  },
};
