import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import AddItemScreen from '../../screens/AddItemScreen';
import ItemListScreen from '../../screens/ItemListScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import LoginScreen from '../../screens/LoginScreen';
import { createTable } from '../../services/itemService';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import ItemScreen from '../../screens/ItemScreen';
import MyItemsScreen from '@/screens/MyItemsScreen';

// Criando o Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function Layout() {
  useEffect(() => {
    createTable();
  }, []);

  return (
    <AuthProvider>
      <AuthenticatedStack />
    </AuthProvider>
  );
}

function AuthenticatedStack() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AuthenticatedLayout} />
      <Stack.Screen name="ItemDetails" component={ItemScreen} />
    </Stack.Navigator>
  );
}

// Definindo o Tab Navigator
function AuthenticatedLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Página inicial'
              ? 'home'
              : route.name === 'Perfil' || route.name === 'Login'
              ? 'person'
              : route.name === 'Adicionar item'
              ? 'add-circle'
              : route.name === 'Meus itens'
              ? 'list'
              : 'home';

          return <TabBarIcon name={iconName} color={color} size={size} />;
        },
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {isLoggedIn ? (
        <>
          <Tab.Screen name='Página inicial' component={HomeScreen} />
          <Tab.Screen name='Perfil' component={ProfileScreen} />
          <Tab.Screen name='Adicionar item' component={AddItemScreen} />
          <Tab.Screen name='Meus itens' component={MyItemsScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name='Página inicial' component={HomeScreen} />
          <Tab.Screen name='Login' component={LoginScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}
