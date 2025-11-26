import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  ProgressBar,
  Button,
  TextInput,
  Portal,
  Modal,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { goalService } from '../../services/apiServices';
import { colors } from '../../styles/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const GoalDetailScreen = ({ route, navigation }) => {
  const { goalId } = route.params;
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [addingAmount, setAddingAmount] = useState(false);

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      const data = await goalService.getById(goalId);
      setGoal(data);
    } catch (error) {
      console.error('Erro ao carregar meta:', error);
      Alert.alert('Erro', 'Não foi possível carregar a meta');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddAmount = async () => {
    const amount = parseFloat(addAmount.replace(',', '.'));

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    setAddingAmount(true);

    try {
      await goalService.addAmount(goalId, amount);
      setModalVisible(false);
      setAddAmount('');
      await loadGoal();

      const newTotal = goal.currentAmount + amount;
      if (newTotal >= goal.targetAmount) {
        Alert.alert(
          '🎉 Parabéns!',
          'Você atingiu sua meta! Continue assim!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao adicionar valor:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o valor');
    } finally {
      setAddingAmount(false);
    }
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}`;
  };

  const calculateProgress = () => {
    if (!goal) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  if (loading || !goal) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const progress = calculateProgress();
  const isCompleted = goal.completed || progress >= 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={isCompleted ? 'check-circle' : 'target'}
                  size={60}
                  color={isCompleted ? colors.success : colors.primary}
                />
              </View>
              <Title style={styles.goalName}>{goal.name}</Title>
              {goal.description && (
                <Text style={styles.description}>{goal.description}</Text>
              )}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.progressCard}>
          <Card.Content>
            <Text style={styles.progressTitle}>Progresso</Text>
            <ProgressBar
              progress={progress / 100}
              color={isCompleted ? colors.success : colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>

            <View style={styles.amountsContainer}>
              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Atual</Text>
                <Text style={styles.currentAmount}>
                  {formatCurrency(goal.currentAmount)}
                </Text>
              </View>
              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Meta</Text>
                <Text style={styles.targetAmount}>
                  {formatCurrency(goal.targetAmount)}
                </Text>
              </View>
            </View>

            {!isCompleted && (
              <Card style={styles.remainingCard}>
                <Card.Content>
                  <Text style={styles.remainingLabel}>Falta</Text>
                  <Text style={styles.remainingAmount}>
                    {formatCurrency(remaining)}
                  </Text>
                </Card.Content>
              </Card>
            )}

            {isCompleted && (
              <Card style={styles.completedCard}>
                <Card.Content>
                  <Text style={styles.completedText}>
                    🎉 Meta atingida! Parabéns!
                  </Text>
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>

        {goal.deadline && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Prazo</Text>
                  <Text style={styles.infoValue}>
                    {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={colors.primary}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Criada em</Text>
                <Text style={styles.infoValue}>
                  {format(new Date(goal.createdAt), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {!isCompleted && (
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
            icon="plus"
            buttonColor={colors.success}
          >
            Adicionar Valor
          </Button>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Adicionar Valor</Title>
          <TextInput
            label="Valor"
            value={addAmount}
            onChangeText={setAddAmount}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.modalInput}
            left={<TextInput.Affix text="R$" />}
            placeholder="0,00"
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleAddAmount}
              loading={addingAmount}
              disabled={addingAmount}
              style={styles.modalButton}
              buttonColor={colors.success}
            >
              Adicionar
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
  content: {
    flex: 1,
    padding: 15,
  },
  headerCard: {
    marginBottom: 15,
  },
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  goalName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressCard: {
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  amountBox: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  targetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  remainingCard: {
    backgroundColor: colors.surface,
    marginTop: 10,
  },
  remainingLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  remainingAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.warning,
    textAlign: 'center',
  },
  completedCard: {
    backgroundColor: '#E8F5E9',
    marginTop: 10,
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  addButton: {
    marginVertical: 20,
    paddingVertical: 6,
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
    marginBottom: 20,
    textAlign: 'center',
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

export default GoalDetailScreen;
