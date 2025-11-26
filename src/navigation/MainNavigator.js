import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/theme';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import AddTransactionScreen from '../screens/Transactions/AddTransactionScreen';
import GoalsScreen from '../screens/Goals/GoalsScreen';
import AddGoalScreen from '../screens/Goals/AddGoalScreen';
import GoalDetailScreen from '../screens/Goals/GoalDetailScreen';
import SavingsScreen from '../screens/Savings/SavingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para Transações
const TransactionsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TransactionsList" 
        component={TransactionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{ 
          title: 'Nova Transação',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator para Metas
const GoalsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="GoalsList" 
        component={GoalsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddGoal" 
        component={AddGoalScreen}
        options={{ 
          title: 'Nova Meta',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="GoalDetail" 
        component={GoalDetailScreen}
        options={{ 
          title: 'Detalhes da Meta',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'target' : 'target';
          } else if (route.name === 'Savings') {
            iconName = focused ? 'piggy-bank' : 'piggy-bank-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsStack}
        options={{ title: 'Transações' }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsStack}
        options={{ title: 'Metas' }}
      />
      <Tab.Screen 
        name="Savings" 
        component={SavingsScreen}
        options={{ title: 'Poupança' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
