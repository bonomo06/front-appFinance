import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Card, Title, FAB, Avatar, Chip, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { transactionService } from '../../services/apiServices';
import { colors } from '../../styles/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TransactionsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filter, searchQuery]);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll({ limit: 100 });
      console.log('Dados recebidos da API:', data);
      console.log('Tipo de data:', typeof data);
      console.log('É array?', Array.isArray(data));
      setTransactions(data.transactions || data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as transações');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, []);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filtro por categoria
    if (filter !== 'all') {
      filtered = filtered.filter((t) => t.category === filter);
    }

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.categoryTag?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await transactionService.delete(id);
              await loadTransactions();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a transação');
            }
          },
        },
      ]
    );
  };

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

  const groupTransactionsByDate = () => {
    const grouped = {};
    filteredTransactions.forEach((transaction) => {
      const date = format(new Date(transaction.createdAt), 'dd/MM/yyyy');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Transações</Title>
      </View>

      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Buscar transações..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={styles.chip}
          >
            Todas
          </Chip>
          <Chip
            selected={filter === 'income'}
            onPress={() => setFilter('income')}
            style={styles.chip}
            icon="arrow-up"
          >
            Receitas
          </Chip>
          <Chip
            selected={filter === 'expense'}
            onPress={() => setFilter('expense')}
            style={styles.chip}
            icon="arrow-down"
          >
            Despesas
          </Chip>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTransactions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <MaterialCommunityIcons
                name="inbox"
                size={60}
                color={colors.textSecondary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
              <Text style={styles.emptySubtext}>
                Adicione transações manualmente ou aguarde notificações bancárias
              </Text>
            </Card.Content>
          </Card>
        ) : (
          Object.keys(groupedTransactions).map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              {groupedTransactions[date].map((transaction) => (
                <Card key={transaction._id} style={styles.transactionCard}>
                  <TouchableOpacity
                    onLongPress={() => handleDelete(transaction._id)}
                    activeOpacity={0.7}
                  >
                    <Card.Content style={styles.transactionContent}>
                      <View style={styles.transactionLeft}>
                        <Avatar.Icon
                          size={45}
                          icon={getTransactionIcon(transaction.type)}
                          style={{
                            backgroundColor: getTransactionColor(transaction.type),
                          }}
                        />
                        <View style={styles.transactionInfo}>
                          <Text style={styles.transactionDescription}>
                            {transaction.description}
                          </Text>
                          <View style={styles.transactionMeta}>
                            <Text style={styles.transactionType}>
                              {transaction.type.toUpperCase()}
                            </Text>
                            {transaction.isAutomatic && (
                              <Chip
                                mode="outlined"
                                compact
                                style={styles.autoChip}
                                textStyle={{ fontSize: 10 }}
                              >
                                AUTO
                              </Chip>
                            )}
                          </View>
                        </View>
                      </View>
                      <View style={styles.transactionRight}>
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
                        <Text style={styles.transactionTime}>
                          {format(new Date(transaction.createdAt), 'HH:mm')}
                        </Text>
                      </View>
                    </Card.Content>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchbar: {
    marginBottom: 10,
    elevation: 0,
    backgroundColor: colors.background,
  },
  chips: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 10,
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
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  transactionType: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  autoChip: {
    height: 20,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    marginTop: 50,
  },
  emptyIcon: {
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default TransactionsScreen;
