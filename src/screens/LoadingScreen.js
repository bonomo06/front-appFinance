import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingScreen = () => {
  return (
    <LinearGradient
      colors={['#6200ee', '#3700B3']}
      style={styles.container}
    >
      <Text style={styles.logo}>💰</Text>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.text}>Carregando...</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
});

export default LoadingScreen;
