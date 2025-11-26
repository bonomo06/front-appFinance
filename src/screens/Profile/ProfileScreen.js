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
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { historyService } from '../../services/apiServices';
import { colors } from '../../styles/theme';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { autoProcessEnabled, toggleAutoProcess } = useNotifications();
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
              Quando ativado, o app monitora suas notificações bancárias e registra
              automaticamente transações de PIX, crédito e débito. Os valores e
              descrições são extraídos das notificações para facilitar seu controle
              financeiro!
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
