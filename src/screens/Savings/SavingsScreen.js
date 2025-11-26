import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  TextInput,
  Portal,
  Modal,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { accountService } from '../../services/apiServices';
import { colors } from '../../styles/theme';

const SavingsScreen = () => {
  const [account, setAccount] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const data = await accountService.getAccount();
      setAccount(data);
    } catch (error) {
      console.error('Erro ao carregar conta:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da conta');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAccount();
    setRefreshing(false);
  }, []);

  const handleTransferToSavings = async () => {
    const value = parseFloat(amount.replace(',', '.'));

    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    if (value > account.mainBalance) {
      Alert.alert('Erro', 'Saldo insuficiente na conta principal');
      return;
    }

    setLoading(true);

    try {
      await accountService.transferToSavings(value);
      setTransferModalVisible(false);
      setAmount('');
      await loadAccount();
      Alert.alert('Sucesso', `R$ ${value.toFixed(2)} transferido para a poupança!`);
    } catch (error) {
      console.error('Erro ao transferir:', error);
      Alert.alert('Erro', 'Não foi possível realizar a transferência');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawFromSavings = async () => {
    const value = parseFloat(amount.replace(',', '.'));

    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    if (value > account.savingsBalance) {
      Alert.alert('Erro', 'Saldo insuficiente na poupança');
      return;
    }

    setLoading(true);

    try {
      await accountService.withdrawFromSavings(value);
      setWithdrawModalVisible(false);
      setAmount('');
      await loadAccount();
      Alert.alert('Sucesso', `R$ ${value.toFixed(2)} retirado da poupança!`);
    } catch (error) {
      console.error('Erro ao retirar:', error);
      Alert.alert('Erro', 'Não foi possível realizar a retirada');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={['#6200ee', '#3700B3']} style={styles.header}>
        <Title style={styles.title}>Poupança</Title>
        <Text style={styles.subtitle}>Guarde dinheiro para o futuro</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.balanceCard}>
          <Card.Content>
            <View style={styles.balanceHeader}>
              <MaterialCommunityIcons
                name="piggy-bank"
                size={40}
                color={colors.secondary}
              />
              <Text style={styles.balanceLabel}>Saldo na Poupança</Text>
            </View>
            <Text style={styles.balanceAmount}>
              {formatCurrency(account?.savingsBalance)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.mainBalanceCard}>
          <Card.Content>
            <View style={styles.mainBalanceRow}>
              <View>
                <Text style={styles.mainBalanceLabel}>Conta Principal</Text>
                <Text style={styles.mainBalanceAmount}>
                  {formatCurrency(account?.mainBalance)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="wallet"
                size={30}
                color={colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Card style={styles.actionCard}>
            <Card.Content style={styles.actionContent}>
              <MaterialCommunityIcons
                name="arrow-down"
                size={40}
                color={colors.success}
              />
              <Text style={styles.actionTitle}>Guardar Dinheiro</Text>
              <Text style={styles.actionDescription}>
                Transfira da conta principal para a poupança
              </Text>
              <Button
                mode="contained"
                onPress={() => setTransferModalVisible(true)}
                style={styles.actionButton}
                buttonColor={colors.success}
                icon="arrow-down"
              >
                Transferir
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.actionCard}>
            <Card.Content style={styles.actionContent}>
              <MaterialCommunityIcons
                name="arrow-up"
                size={40}
                color={colors.warning}
              />
              <Text style={styles.actionTitle}>Retirar Dinheiro</Text>
              <Text style={styles.actionDescription}>
                Transfira da poupança para a conta principal
              </Text>
              <Button
                mode="contained"
                onPress={() => setWithdrawModalVisible(true)}
                style={styles.actionButton}
                buttonColor={colors.warning}
                icon="arrow-up"
              >
                Retirar
              </Button>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>💡 Dica</Text>
            <Text style={styles.infoText}>
              Use a poupança para guardar dinheiro que você não quer gastar agora.
              É uma ótima forma de criar uma reserva de emergência ou juntar para
              suas metas!
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Modal Transferir para Poupança */}
      <Portal>
        <Modal
          visible={transferModalVisible}
          onDismiss={() => setTransferModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Transferir para Poupança</Title>
          <Text style={styles.modalSubtitle}>
            Disponível: {formatCurrency(account?.mainBalance)}
          </Text>
          <TextInput
            label="Valor"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.modalInput}
            left={<TextInput.Affix text="R$" />}
            placeholder="0,00"
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setTransferModalVisible(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleTransferToSavings}
              loading={loading}
              disabled={loading}
              style={styles.modalButton}
              buttonColor={colors.success}
            >
              Transferir
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal Retirar da Poupança */}
      <Portal>
        <Modal
          visible={withdrawModalVisible}
          onDismiss={() => setWithdrawModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Retirar da Poupança</Title>
          <Text style={styles.modalSubtitle}>
            Disponível: {formatCurrency(account?.savingsBalance)}
          </Text>
          <TextInput
            label="Valor"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.modalInput}
            left={<TextInput.Affix text="R$" />}
            placeholder="0,00"
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setWithdrawModalVisible(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleWithdrawFromSavings}
              loading={loading}
              disabled={loading}
              style={styles.modalButton}
              buttonColor={colors.warning}
            >
              Retirar
            </Button>
          </View>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  balanceCard: {
    marginBottom: 15,
    backgroundColor: colors.secondary,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  mainBalanceCard: {
    marginBottom: 20,
  },
  mainBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainBalanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mainBalanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  actionCard: {
    marginBottom: 15,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  actionButton: {
    paddingHorizontal: 20,
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
  modal: {
    backgroundColor: colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default SavingsScreen;
