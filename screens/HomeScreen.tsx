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
        onPress={() => navigation.navigate('Perfil')}
      />
      <Button
        title='Adicionar Item'
        onPress={() => navigation.navigate('Adicionar item')}
      />
      <Button
        title='Ver Itens'
        onPress={() => navigation.navigate('Lista de itens')}
      />
    </View>
  );
}
