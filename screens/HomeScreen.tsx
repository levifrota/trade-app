import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  console.log('logged?', isLoggedIn);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao TradeApp!</Text>
      {isLoggedIn ? (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Lista de itens')}
          >
            <Text style={styles.buttonText}>Ver Itens</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Cadastrar/Entrar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    backgroundColor: '#f5f5f5', // Cor de fundo suave
    padding: 20, // Para adicionar algum espaço em volta
  },
  title: {
    fontSize: 28, // Maior para dar destaque ao título
    fontWeight: 'bold',
    color: '#333', // Cor escura para contraste
    marginBottom: 40, // Espaço maior abaixo do título
    textAlign: 'center', // Centraliza o texto
  },
  button: {
    backgroundColor: '#4CAF50', // Cor verde para o botão
    paddingVertical: 12, // Espaçamento vertical no botão
    paddingHorizontal: 30, // Espaçamento horizontal no botão
    borderRadius: 8, // Bordas arredondadas
    marginBottom: 20, // Espaço entre os botões
  },
  buttonText: {
    color: '#fff', // Texto branco para contraste com o fundo
    fontSize: 16, // Tamanho de fonte legível
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
