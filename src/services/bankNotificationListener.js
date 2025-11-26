import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { NotificationListenerModule } = NativeModules;

class BankNotificationListener {
  constructor() {
    this.eventEmitter = null;
    this.subscription = null;
    
    if (Platform.OS === 'android' && NotificationListenerModule) {
      this.eventEmitter = new NativeEventEmitter(NotificationListenerModule);
    }
  }

  /**
   * Solicita permissão para ler notificações (abre configurações do Android)
   */
  async requestPermission() {
    if (Platform.OS !== 'android' || !NotificationListenerModule) {
      console.warn('NotificationListener só funciona no Android');
      return false;
    }

    try {
      await NotificationListenerModule.requestPermission();
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  }

  /**
   * Verifica se já tem permissão para ler notificações
   */
  async checkPermission() {
    if (Platform.OS !== 'android' || !NotificationListenerModule) {
      return false;
    }

    try {
      return await NotificationListenerModule.checkPermission();
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  }

  /**
   * Registra um listener para receber notificações bancárias
   * @param {Function} callback - Função que será chamada quando receber notificação
   * @returns {Object} Objeto com método remove() para cancelar o listener
   */
  addListener(callback) {
    if (!this.eventEmitter) {
      console.warn('EventEmitter não disponível');
      return { remove: () => {} };
    }

    this.subscription = this.eventEmitter.addListener(
      'onBankNotification',
      (notification) => {
        console.log('📱 Notificação bancária recebida:', notification);
        callback(notification);
      }
    );

    return {
      remove: () => {
        if (this.subscription) {
          this.subscription.remove();
          this.subscription = null;
        }
      }
    };
  }

  /**
   * Remove o listener
   */
  removeListener() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

export default new BankNotificationListener();
