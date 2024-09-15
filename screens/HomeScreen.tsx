import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Bem-vindo ao TradeApp!</Text>
      <Button
        title='Ver Perfil'
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        title='Adicionar Item'
        onPress={() => navigation.navigate('AddItem')}
      />
      <Button
        title='Ver Itens'
        onPress={() => navigation.navigate('ItemList')}
      />
    </View>
  );
}
