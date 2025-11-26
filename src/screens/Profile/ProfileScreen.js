import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Avatar,
  List,
  Switch,
  Divider,
  Button,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { historyService } from '../../services/apiServices';
import { notificationService } from '../../services/notificationService';
import { colors } from '../../styles/theme';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { autoProcessEnabled, hasNotificationPermission, toggleAutoProcess, requestNotificationAccess } = useNotifications();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const simulateNotification = async (bank, isIncome, amount) => {
    const notifications = {
      nubank_income: {
        request: {
          content: {
            title: 'Nubank',
            body: `Você recebeu um Pix de R$ ${amount.toFixed(2).replace('.', ',')}`,
            data: { appName: 'Nubank' }
          }
        }
      },
      nubank_expense: {
        request: {
          content: {
            title: 'Nubank',
            body: `Compra aprovada no débito de R$ ${amount.toFixed(2).replace('.', ',')}`,
            data: { appName: 'Nubank' }
          }
        }
      },
      bb_income: {
        request: {
          content: {
            title: 'Banco do Brasil',
            body: `Transferência recebida - Pix de R$ ${amount.toFixed(2).replace('.', ',')}`,
            data: { appName: 'Banco do Brasil' }
          }
        }
      },
      bb_expense: {
        request: {
          content: {
            title: 'Banco do Brasil',
            body: `Pagamento realizado de R$ ${amount.toFixed(2).replace('.', ',')}`,
            data: { appName: 'Banco do Brasil' }
          }
        }
      },
      googlepay_income: {
        request: {
          content: {
            title: 'Google Pay',
            body: `Você recebeu R$ ${amount.toFixed(2).replace('.', ',')}`,
            data: { appName: 'Google Pay' }
          }
        }
      },
      googlepay_expense: {
        request: {
          content: {
            title: 'Google Pay',
            body: `Pagamento de R$ ${amount.toFixed(2).replace('.', ',')} aprovado`,
            data: { appName: 'Google Pay' }
          }
        }
      }
    };

    const key = `${bank}_${isIncome ? 'income' : 'expense'}`;
    const testNotification = notifications[key];

    if (!testNotification) {
      Alert.alert('Erro', 'Notificação de teste não encontrada');
      return;
    }

    // Processar a notificação simulada
    const result = await notificationService.processNotificationTransaction(testNotification);

    if (result.success) {
      Alert.alert(
        '✅ Teste bem-sucedido!',
        `Transação de ${result.transaction.category === 'income' ? 'receita' : 'despesa'} ` +
        `de R$ ${result.transaction.amount.toFixed(2)} foi criada automaticamente!\n\n` +
        `Tipo: ${result.transaction.type.toUpperCase()}\n` +
        `Descrição: ${result.transaction.description}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        '❌ Teste falhou',
        result.reason || 'Não foi possível processar a notificação',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCloseMonth = () => {
    Alert.alert(
      'Fechar Mês',
      'Escolha como deseja fechar o mês atual:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Manter Saldo',
          onPress: () => confirmCloseMonth(true),
        },
        {
          text: 'Zerar Tudo',
          style: 'destructive',
          onPress: () => confirmCloseMonth(false),
        },
      ]
    );
  };

  const confirmCloseMonth = async (keepBalance) => {
    try {
      await historyService.closeMonth({ keepBalance });
      Alert.alert(
        'Sucesso!',
        keepBalance
          ? 'Mês fechado! O saldo foi mantido.'
          : 'Mês fechado! Tudo foi zerado para começar do zero.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao fechar mês:', error);
      Alert.alert('Erro', 'Não foi possível fechar o mês');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={user?.name?.substring(0, 2).toUpperCase() || 'US'}
            style={styles.avatar}
          />
          <Title style={styles.userName}>{user?.name || 'Usuário'}</Title>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Notificações</Text>
            
            {!hasNotificationPermission && (
              <>
                <Card style={styles.warningCard}>
                  <Card.Content>
                    <Text style={styles.warningText}>
                      ⚠️ <Text style={styles.warningBold}>Permissão Necessária</Text>{'\n\n'}
                      Para que o app leia notificações bancárias automaticamente, você precisa conceder permissão de acesso às notificações do sistema.
                    </Text>
                    <Button
                      mode="contained"
                      onPress={requestNotificationAccess}
                      style={styles.warningButton}
                      icon="shield-check"
                    >
                      Conceder Permissão
                    </Button>
                  </Card.Content>
                </Card>
                <Divider style={styles.divider} />
              </>
            )}
            
            {hasNotificationPermission && (
              <Card style={styles.successCard}>
                <Card.Content>
                  <Text style={styles.successText}>
                    ✅ Permissão concedida! O app pode ler notificações bancárias.
                  </Text>
                </Card.Content>
              </Card>
            )}
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Processamento Automático"
              description="Registra transações automaticamente via notificações"
              left={(props) => (
                <MaterialCommunityIcons
                  name="bell-ring"
                  size={24}
                  color={colors.primary}
                  style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                />
              )}
              right={() => (
                <Switch
                  value={autoProcessEnabled}
                  onValueChange={toggleAutoProcess}
                  color={colors.primary}
                  disabled={!hasNotificationPermission}
                />
              )}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="Notificações Push"
              description="Receber notificações do app"
              left={(props) => (
                <MaterialCommunityIcons
                  name="bell"
                  size={24}
                  color={colors.primary}
                  style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                />
              )}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  color={colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Gerenciar Mês</Text>
            
            <TouchableOpacity onPress={handleCloseMonth}>
              <List.Item
                title="Fechar Mês Atual"
                description="Arquivar transações e opcionalmente zerar saldo"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={24}
                    color={colors.primary}
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🧪 Testar Notificações</Text>
            
            <TouchableOpacity onPress={() => simulateNotification('nubank', true, 150.00)}>
              <List.Item
                title="Simular Nubank - Recebimento PIX"
                description="Testar notificação de R$ 150,00 recebido"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="cash-plus"
                    size={24}
                    color="#8A05BE"
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="play" />}
              />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity onPress={() => simulateNotification('nubank', false, 89.90)}>
              <List.Item
                title="Simular Nubank - Pagamento"
                description="Testar notificação de R$ 89,90 pago"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="cash-minus"
                    size={24}
                    color="#8A05BE"
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="play" />}
              />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity onPress={() => simulateNotification('bb', true, 500.00)}>
              <List.Item
                title="Simular Banco do Brasil - PIX"
                description="Testar notificação de R$ 500,00 recebido"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="bank"
                    size={24}
                    color="#FFF100"
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="play" />}
              />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity onPress={() => simulateNotification('googlepay', false, 25.50)}>
              <List.Item
                title="Simular Google Pay - Compra"
                description="Testar notificação de R$ 25,50 pago"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="google-pay"
                    size={24}
                    color="#4285F4"
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="play" />}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Sobre</Text>
            
            <TouchableOpacity>
              <List.Item
                title="Versão do App"
                description="1.0.0"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="information"
                    size={24}
                    color={colors.primary}
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
              />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity>
              <List.Item
                title="Termos de Uso"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="file-document"
                    size={24}
                    color={colors.primary}
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity>
              <List.Item
                title="Política de Privacidade"
                left={(props) => (
                  <MaterialCommunityIcons
                    name="shield-lock"
                    size={24}
                    color={colors.primary}
                    style={{ marginLeft: 10, marginRight: 20, alignSelf: 'center' }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>📱 Como funciona o processamento automático?</Text>
            <Text style={styles.infoText}>
              {'\n'}🏦 <Text style={styles.infoBold}>Apps monitorados:</Text>{'\n'}
              • Nubank{'\n'}
              • Banco do Brasil{'\n'}
              • Google Pay{'\n'}
              {'\n'}💰 <Text style={styles.infoBold}>O que é detectado:</Text>{'\n'}
              • Valores em R$ (ex: R$ 150,00){'\n'}
              • Tipo: PIX, Débito, Crédito{'\n'}
              {'\n'}✅ <Text style={styles.infoBold}>Receitas (palavras-chave):</Text>{'\n'}
              "recebeu", "recebido", "transferência recebida", "depósito"{'\n'}
              {'\n'}❌ <Text style={styles.infoBold}>Despesas (palavras-chave):</Text>{'\n'}
              "transferiu", "pagamento", "compra", "pago"{'\n'}
              {'\n'}🧪 Use a seção "Testar Notificações" acima para experimentar!
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor={colors.error}
          icon="logout"
        >
          Sair da Conta
        </Button>

        <View style={styles.footer}>
          <Text style={styles.footerText}>App Finanças © 2025</Text>
          <Text style={styles.footerText}>Desenvolvido com ❤️</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.secondary,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  divider: {
    marginVertical: 5,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: 'bold',
    color: colors.text,
  },
  warningCard: {
    backgroundColor: '#3a2a00',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  warningText: {
    color: '#FFD54F',
    fontSize: 13,
    lineHeight: 20,
  },
  warningBold: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  warningButton: {
    marginTop: 15,
    backgroundColor: '#FFA000',
  },
  successCard: {
    backgroundColor: '#1B3A1B',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#A5D6A7',
    fontSize: 13,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginVertical: 10,
    paddingVertical: 6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
});

export default ProfileScreen;
