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
  SegmentedButtons,
  Text,
  Card,
  HelperText,
} from 'react-native-paper';
import { transactionService } from '../../services/apiServices';
import { colors } from '../../styles/theme';

const AddTransactionScreen = ({ navigation }) => {
  const [type, setType] = useState('pix');
  const [category, setCategory] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryTag, setCategoryTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !description) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const amountValue = parseFloat(amount.replace(',', '.'));
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    setLoading(true);

    try {
      await transactionService.create({
        type,
        category,
        amount: amountValue,
        description,
        categoryTag: categoryTag || (category === 'income' ? 'Receita' : 'Despesa'),
        isAutomatic: false,
        balanceType: 'main',
      });

      Alert.alert('Sucesso', 'Transação adicionada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      console.error('Detalhes do erro:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Não foi possível adicionar a transação';
      Alert.alert('Erro', errorMessage);
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
            <Text style={styles.label}>Tipo de Transação *</Text>
            <SegmentedButtons
              value={category}
              onValueChange={setCategory}
              buttons={[
                {
                  value: 'income',
                  label: 'Receita',
                  icon: 'arrow-up',
                  style: category === 'income' ? { backgroundColor: colors.income } : {},
                },
                {
                  value: 'expense',
                  label: 'Despesa',
                  icon: 'arrow-down',
                  style: category === 'expense' ? { backgroundColor: colors.expense } : {},
                },
              ]}
              style={styles.segmented}
            />

            <Text style={styles.label}>Método de Pagamento *</Text>
            <SegmentedButtons
              value={type}
              onValueChange={setType}
              buttons={[
                { value: 'pix', label: 'PIX' },
                { value: 'debit', label: 'Débito' },
                { value: 'credit', label: 'Crédito' },
                { value: 'cash', label: 'Dinheiro' },
              ]}
              style={styles.segmented}
            />

            <TextInput
              label="Valor *"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              left={<TextInput.Affix text="R$" />}
              placeholder="0,00"
            />
            <HelperText type="info">
              Use vírgula para separar os centavos (ex: 100,50)
            </HelperText>

            <TextInput
              label="Descrição *"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: Supermercado, Salário, etc."
            />

            <TextInput
              label="Categoria (opcional)"
              value={categoryTag}
              onChangeText={setCategoryTag}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: Alimentação, Transporte, etc."
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor={category === 'income' ? colors.income : colors.expense}
            >
              {category === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa'}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>💡 Dica</Text>
            <Text style={styles.infoText}>
              Você também pode deixar o processamento automático ativado para que
              transações sejam registradas automaticamente a partir de notificações
              bancárias de PIX, crédito e débito!
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 15,
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
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

export default AddTransactionScreen;
