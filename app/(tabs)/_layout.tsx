import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import AddItemScreen from '../../screens/AddItemScreen';
import ItemListScreen from '../../screens/ItemListScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import LoginScreen from '../../screens/LoginScreen';
import { createTable } from '../../services/itemService';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const Tab = createBottomTabNavigator();

export default function Layout() {
  useEffect(() => {
    createTable();
  }, []);

  return (
    <AuthProvider>
      <AuthenticatedLayout />
    </AuthProvider>
  );
}

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
              : route.name === 'Lista de itens'
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
          <Tab.Screen name='Lista de itens' component={ItemListScreen} />
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
