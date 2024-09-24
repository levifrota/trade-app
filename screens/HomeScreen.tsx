import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import ItemListScreen from './ItemListScreen';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  useEffect(() => {
    let timeoutId: any;

    if (loading) {
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#4CAF50' />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={isLoggedIn ? styles.containerLogged : styles.container}>
      {isLoggedIn ? (
        <>
          <ItemListScreen/>
        </>
      ) : (
        <>
          <Text style={styles.title}>Bem-vindo ao TradeApp!</Text>
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
  containerLogged: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
