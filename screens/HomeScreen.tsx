import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();

  return (
    <View>
      <Text style={styles.title}>Bem-vindo ao TradeApp!</Text>
      {isLoggedIn ? (
        <>
          <Button
            title='Ver Itens'
            onPress={() => navigation.navigate('Lista de itens')}
          />
        </>
      ) : (
        <>
          <Button
            title='Cadastrar/Entrar'
            onPress={() => navigation.navigate('Perfil')}
          />
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
});
