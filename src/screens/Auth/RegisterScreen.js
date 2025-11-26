import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);

  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erro no Cadastro', result.error);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0a0a0a']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Title style={styles.logo}>💰</Title>
            <Title style={styles.title}>Criar Conta</Title>
            <Text style={styles.subtitle}>Comece a controlar suas finanças hoje</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Nome completo"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineColor="#fff"
              activeOutlineColor="#03dac6"
              textColor="#000"
              theme={{ colors: { background: '#fff' } }}
            />

            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineColor="#fff"
              activeOutlineColor="#03dac6"
              textColor="#000"
              theme={{ colors: { background: '#fff' } }}
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={secureTextEntry}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              style={styles.input}
              outlineColor="#fff"
              activeOutlineColor="#03dac6"
              textColor="#000"
              theme={{ colors: { background: '#fff' } }}
            />

            <TextInput
              label="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={secureConfirmEntry}
              right={
                <TextInput.Icon
                  icon={secureConfirmEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureConfirmEntry(!secureConfirmEntry)}
                />
              }
              style={styles.input}
              outlineColor="#fff"
              activeOutlineColor="#03dac6"
              textColor="#000"
              theme={{ colors: { background: '#fff' } }}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor="#03dac6"
              textColor="#000"
            >
              Cadastrar
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              style={styles.loginButton}
              textColor="#fff"
            >
              Já tem uma conta? Faça login
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  loginButton: {
    marginTop: 15,
  },
});

export default RegisterScreen;
