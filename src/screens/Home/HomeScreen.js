import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Title, Avatar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { accountService, transactionService } from '../../services/apiServices';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { colors } from '../../styles/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HomeScreen = ({ navigation }) => {
  const [account, setAccount] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { autoProcessEnabled, toggleAutoProcess } = useNotifications();

  useEffect(() => {
    loadData();
    
    // Recarregar dados quando a tela receber foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const [accountData, summaryData, transactionsData] = await Promise.all([
        accountService.getAccount(),
        accountService.getSummary(),
        transactionService.getAll({ limit: 5 }),
      ]);

      setAccount(accountData.account); // Pega o objeto 'account' dentro da resposta
      setSummary(summaryData.summary); // Pega o objeto 'summary' dentro da resposta
      setRecentTransactions(transactionsData.transactions || transactionsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}`;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'pix':
        return 'qrcode';
      case 'credit':
        return 'credit-card';
      case 'debit':
        return 'credit-card-outline';
      case 'cash':
        return 'cash';
      default:
        return 'swap-horizontal';
    }
  };

  const getTransactionColor = (type) => {
    return colors[type] || colors.primary;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#0a0a0a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Title style={styles.userName}>
              {user?.name?.split(' ')[0] || 'Usuário'}
            </Title>
          </View>
          <TouchableOpacity onPress={toggleAutoProcess}>
            <Avatar.Icon
              size={50}
              icon={autoProcessEnabled ? 'bell' : 'bell-off'}
              style={{ backgroundColor: autoProcessEnabled ? '#03dac6' : '#666' }}
            />
          </TouchableOpacity>
        </View>

        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Saldo Total</Text>
            <Title style={styles.balanceAmount}>
              {formatCurrency((account?.mainBalance || 0) + (account?.savingsBalance || 0))}
            </Title>
            
            <View style={styles.balanceDetails}>
              <View style={styles.balanceItem}>
                <MaterialCommunityIcons name="wallet" size={20} color={colors.income} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.balanceItemLabel}>Conta</Text>
                  <Text style={styles.balanceItemValue}>
                    {formatCurrency(account?.mainBalance)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.balanceItem}>
                <MaterialCommunityIcons name="piggy-bank" size={20} color={colors.secondary} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.balanceItemLabel}>Poupança</Text>
                  <Text style={styles.balanceItemValue}>
                    {formatCurrency(account?.savingsBalance)}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Resumo Mensal */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Resumo do Mês</Title>
          <View style={styles.summaryCards}>
            <Card style={[styles.summaryCard, { borderLeftColor: colors.income }]}>
              <Card.Content>
                <MaterialCommunityIcons name="arrow-up" size={24} color={colors.income} />
                <Text style={styles.summaryLabel}>Receitas</Text>
                <Text style={[styles.summaryValue, { color: colors.income }]}>
                  {formatCurrency(summary?.monthlyIncome)}
                </Text>
              </Card.Content>
            </Card>

            <Card style={[styles.summaryCard, { borderLeftColor: colors.expense }]}>
              <Card.Content>
                <MaterialCommunityIcons name="arrow-down" size={24} color={colors.expense} />
                <Text style={styles.summaryLabel}>Despesas</Text>
                <Text style={[styles.summaryValue, { color: colors.expense }]}>
                  {formatCurrency(summary?.monthlyExpenses)}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Status de Notificações */}
        <View style={styles.section}>
          <Chip
            icon={autoProcessEnabled ? 'check-circle' : 'alert-circle'}
            style={{
              backgroundColor: autoProcessEnabled ? colors.success : colors.warning,
            }}
            textStyle={{ color: '#fff' }}
          >
            {autoProcessEnabled
              ? 'Processamento automático ATIVO'
              : 'Processamento automático DESATIVADO'}
          </Chip>
        </View>

        {/* Transações Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Transações Recentes</Title>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
                <Text style={styles.emptySubtext}>
                  Adicione sua primeira transação ou aguarde notificações bancárias
                </Text>
              </Card.Content>
            </Card>
          ) : (
            recentTransactions.map((transaction) => (
              <Card key={transaction._id} style={styles.transactionCard}>
                <Card.Content style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <Avatar.Icon
                      size={40}
                      icon={getTransactionIcon(transaction.type)}
                      style={{
                        backgroundColor: getTransactionColor(transaction.type),
                      }}
                    />
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {format(new Date(transaction.createdAt), "dd 'de' MMM", {
                          locale: ptBR,
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.category === 'income'
                            ? colors.income
                            : colors.expense,
                      },
                    ]}
                  >
                    {transaction.category === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </Card.Content>
              </Card>
            ))
          )}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 15,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItemLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.secondary,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
    borderLeftWidth: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  transactionCard: {
    marginBottom: 10,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
