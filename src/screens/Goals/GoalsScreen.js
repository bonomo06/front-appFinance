import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  ProgressBar,
  FAB,
  Chip,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { goalService } from '../../services/apiServices';
import { colors } from '../../styles/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const GoalsScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('active'); // active, completed, all
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGoals();
  }, [filter]);

  const loadGoals = async () => {
    try {
      const params = {};
      if (filter === 'active') params.completed = false;
      if (filter === 'completed') params.completed = true;

      const data = await goalService.getAll(params);
      setGoals(data.goals || data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as metas');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  }, [filter]);

  const handleDelete = async (id) => {
    Alert.alert('Confirmar exclusão', 'Deseja realmente excluir esta meta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await goalService.delete(id);
            await loadGoals();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a meta');
          }
        },
      },
    ]);
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}`;
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Metas</Title>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={filter === 'active'}
            onPress={() => setFilter('active')}
            style={styles.chip}
            icon="target"
          >
            Em Andamento
          </Chip>
          <Chip
            selected={filter === 'completed'}
            onPress={() => setFilter('completed')}
            style={styles.chip}
            icon="check-circle"
          >
            Concluídas
          </Chip>
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={styles.chip}
            icon="view-list"
          >
            Todas
          </Chip>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {goals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <MaterialCommunityIcons
                name="target"
                size={60}
                color={colors.textSecondary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>Nenhuma meta encontrada</Text>
              <Text style={styles.emptySubtext}>
                Crie suas metas financeiras e acompanhe seu progresso!
              </Text>
            </Card.Content>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const isCompleted = goal.completed || progress >= 100;

            return (
              <Card key={goal._id} style={styles.goalCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('GoalDetail', { goalId: goal._id })}
                  onLongPress={() => handleDelete(goal._id)}
                  activeOpacity={0.7}
                >
                  <Card.Content>
                    <View style={styles.goalHeader}>
                      <View style={styles.goalInfo}>
                        <Text style={styles.goalName}>{goal.name}</Text>
                        {goal.description && (
                          <Text style={styles.goalDescription}>{goal.description}</Text>
                        )}
                      </View>
                      {isCompleted && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={30}
                          color={colors.success}
                        />
                      )}
                    </View>

                    <View style={styles.progressContainer}>
                      <ProgressBar
                        progress={progress / 100}
                        color={isCompleted ? colors.success : colors.primary}
                        style={styles.progressBar}
                      />
                      <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
                    </View>

                    <View style={styles.amountContainer}>
                      <View>
                        <Text style={styles.amountLabel}>Atual</Text>
                        <Text style={styles.currentAmount}>
                          {formatCurrency(goal.currentAmount)}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.amountLabel}>Meta</Text>
                        <Text style={styles.targetAmount}>
                          {formatCurrency(goal.targetAmount)}
                        </Text>
                      </View>
                    </View>

                    {goal.deadline && (
                      <View style={styles.deadlineContainer}>
                        <MaterialCommunityIcons
                          name="calendar"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.deadline}>
                          Prazo: {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </Text>
                      </View>
                    )}

                    {!isCompleted && (
                      <Text style={styles.remainingText}>
                        Faltam {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </Text>
                    )}
                  </Card.Content>
                </TouchableOpacity>
              </Card>
            );
          })
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddGoal')}
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
  chip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  goalCard: {
    marginBottom: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    minWidth: 45,
    textAlign: 'right',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  currentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  targetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deadline: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  remainingText: {
    fontSize: 14,
    color: colors.warning,
    marginTop: 10,
    fontWeight: '500',
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

export default GoalsScreen;
