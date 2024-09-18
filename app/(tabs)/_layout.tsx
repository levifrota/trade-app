import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import AddItemScreen from '../../screens/AddItemScreen';
import ItemListScreen from '../../screens/ItemListScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import { createTable } from '../../services/itemService';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { AuthProvider } from '@/context/AuthContext';

const Tab = createBottomTabNavigator();

export default function Layout() {
  useEffect(() => {
    createTable();
  }, []);

  return (
    <AuthProvider>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = route.name === 'Página inicial'
              ? 'home'
              : route.name === 'Perfil'
              ? 'person'
              : route.name === 'Adicionar item'
              ? 'add-circle'
              : route.name === 'Lista de itens'
              ? 'list'
              : 'home';

            // Retorne o componente TabBarIcon com o nome do ícone correto
            return <TabBarIcon name={iconName} color={color} size={size} />;
          },
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name='Página inicial' component={HomeScreen} />
        <Tab.Screen name='Perfil' component={ProfileScreen} />
        <Tab.Screen name='Adicionar item' component={AddItemScreen} />
        <Tab.Screen name='Lista de itens' component={ItemListScreen} />
      </Tab.Navigator>
    </AuthProvider>
  );
}
