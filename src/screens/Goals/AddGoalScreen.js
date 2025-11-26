import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  HelperText,
  Switch,
} from 'react-native-paper';
import { goalService } from '../../services/apiServices';
import { colors } from '../../styles/theme';

const AddGoalScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !targetAmount) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    const targetValue = parseFloat(targetAmount.replace(',', '.'));
    const currentValue = parseFloat(currentAmount.replace(',', '.') || '0');

    if (isNaN(targetValue) || targetValue <= 0) {
      Alert.alert('Erro', 'Digite um valor de meta válido');
      return;
    }

    if (isNaN(currentValue) || currentValue < 0) {
      Alert.alert('Erro', 'Digite um valor inicial válido');
      return;
    }

    if (currentValue > targetValue) {
      Alert.alert('Erro', 'O valor inicial não pode ser maior que a meta');
      return;
    }

    setLoading(true);

    try {
      const goalData = {
        name,
        description,
        targetAmount: targetValue,
        currentAmount: currentValue,
      };

      if (hasDeadline && deadline) {
        // Converte data dd/mm/yyyy para ISO
        const parts = deadline.split('/');
        if (parts.length === 3) {
          const isoDate = new Date(parts[2], parts[1] - 1, parts[0]);
          goalData.deadline = isoDate.toISOString();
        }
      }

      await goalService.create(goalData);

      Alert.alert('Sucesso', 'Meta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      Alert.alert('Erro', 'Não foi possível criar a meta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Nome da Meta *"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: Notebook Novo, Viagem, etc."
            />

            <TextInput
              label="Descrição (opcional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Descreva sua meta..."
            />

            <TextInput
              label="Valor da Meta *"
              value={targetAmount}
              onChangeText={setTargetAmount}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              left={<TextInput.Affix text="R$" />}
              placeholder="0,00"
            />
            <HelperText type="info">
              Quanto você quer juntar?
            </HelperText>

            <TextInput
              label="Valor Inicial (opcional)"
              value={currentAmount}
              onChangeText={setCurrentAmount}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              left={<TextInput.Affix text="R$" />}
              placeholder="0,00"
            />
            <HelperText type="info">
              Se você já tem algo guardado para esta meta
            </HelperText>

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Definir prazo?</Text>
              <Switch
                value={hasDeadline}
                onValueChange={setHasDeadline}
                color={colors.primary}
              />
            </View>

            {hasDeadline && (
              <>
                <TextInput
                  label="Data Limite"
                  value={deadline}
                  onChangeText={setDeadline}
                  mode="outlined"
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                />
                <HelperText type="info">
                  Formato: DD/MM/AAAA (ex: 31/12/2025)
                </HelperText>
              </>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor={colors.primary}
            >
              Criar Meta
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>🎯 Dica</Text>
            <Text style={styles.infoText}>
              Defina metas realistas e acompanhe seu progresso! Você pode adicionar
              valores às suas metas sempre que quiser na tela de detalhes.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  card: {
    marginBottom: 15,
  },
  input: {
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text,
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
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
});

export default AddGoalScreen;
