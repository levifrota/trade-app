import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'; // useNavigation adicionado
import AntDesign from '@expo/vector-icons/AntDesign';

type ItemScreenRouteProp = RouteProp<
  {
    params: {
      name: string;
      imageUrl: string;
      category: string;
      userEmail: string;
    };
  },
  'params'
>;

export default function ItemScreen() {
  const route = useRoute<ItemScreenRouteProp>(); // Use useRoute para capturar os parâmetros
  const navigation = useNavigation(); // Hook para navegação

  const { name, imageUrl, category, userEmail } = route.params;

  const handleEmailPress = () => {
    const emailUrl = `mailto:${userEmail}`;
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o cliente de e-mail.');
        }
      })
      .catch((err) => console.error('Erro ao tentar enviar e-mail:', err));
  };

  const handleGoBack = () => {
    navigation.navigate('Lista de itens'); // Navega para a tela de ItemListScreen
  };

  return (
    <View style={styles.container}>
      {/* Botão de Voltar */}
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <AntDesign name='leftcircle' size={24} color='black' />
      </TouchableOpacity>

      <Text style={styles.title}>Detalhes do Item</Text>

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image
          source={require('../assets/images/no-image-icon.png')}
          style={styles.image}
        />
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Nome do Item:</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Categoria:</Text>
        <Text style={styles.value}>{category}</Text>

        <Text style={styles.label}>Adicionado por:</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={[styles.value, styles.email]}>{userEmail}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  email: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
});
