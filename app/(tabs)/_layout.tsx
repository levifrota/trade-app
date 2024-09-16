import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import AddItemScreen from '../../screens/AddItemScreen';
import ItemListScreen from '../../screens/ItemListScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import { createTable } from '../../services/itemService';
import OptionsScreen from '@/screens/OptionsScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';

const Tab = createBottomTabNavigator();

export default function Layout() {
  useEffect(() => {
    createTable(); // Inicializa a tabela do SQLite
  }, []);

  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='AddItem' component={AddItemScreen} />
      <Tab.Screen name='ItemList' component={ItemListScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
      <Tab.Screen name='OptionsList' component={OptionsScreen} />
      <Tab.Screen name='LoginScreen' component={LoginScreen} />
      <Tab.Screen name='RegisterScreen' component={RegisterScreen} />
    </Tab.Navigator>
  );
}
