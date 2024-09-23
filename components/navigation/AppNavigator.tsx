import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import AddItemScreen from '@/screens/AddItemScreen';
import ItemListScreen from '@/screens/ItemListScreen';
import LoginScreen from '@/screens/LoginScreen';
import ItemScreen from '@/screens/ItemScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}
      > 
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Perfil' component={ProfileScreen} />
        <Stack.Screen name='AddItem' component={AddItemScreen} />
        <Stack.Screen name='ItemList' component={ItemListScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='ItemDetails' component={ItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '##f5f5f5',
  },
});
