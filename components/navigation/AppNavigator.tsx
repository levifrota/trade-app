import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import AddItemScreen from '../../screens/AddItemScreen';
import ItemListScreen from '../../screens/ItemListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Perfil' component={ProfileScreen} />
        <Stack.Screen name='AddItem' component={AddItemScreen} />
        <Stack.Screen name='ItemList' component={ItemListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
