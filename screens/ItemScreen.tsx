import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Switch,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { doc, updateDoc, arrayUnion, getDoc, arrayRemove } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';

type ItemScreenRouteProp = RouteProp<
  {
    params: {
      name: string;
      imageUrl: string;
      category: string;
      userEmail: string;
      items: Array<any>;
      itemId: string;
      visibility: boolean;
      latitude: number; // Latitude do item
      longitude: number; // Longitude do item
    };
  },
  'params'
>;

export default function ItemScreen() {
  const [isSaved, setIsSaved] = useState(false); // Verificar se o item está salvo
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null); // Localização do usuário
  const [distance, setDistance] = useState<string | null>(null); // Distância calculada
  const [userLoaded, setUserLoaded] = useState(false); // Indica quando as informações do Firestore estão prontas

  const route = useRoute<ItemScreenRouteProp>(); // Use useRoute para capturar os parâmetros
  const navigation = useNavigation(); // Hook para navegação

  const {
    name,
    imageUrl,
    category,
    userEmail,
    itemId,
    visibility: initialVisibility,
    latitude,
    longitude,
  } = route.params;

  const [visibility, setVisibility] = useState(initialVisibility);

  // Função para calcular a distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna a distância em km
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Função para carregar a localização do usuário e verificar se o item já está salvo
  const loadUserDataAndLocation = async () => {
    try {
      // Carregar localização do usuário
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para acessar localização foi negada.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Verificar se o item já está salvo na lista de interesses
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const interestList = data.interestList || [];

        // Verifica se o item já está salvo na lista de interesses
        const itemExists = interestList.some((item: any) => item.name === name);
        setIsSaved(itemExists);
      }

      setUserLoaded(true); // Marcar que as informações do usuário estão carregadas
    } catch (error) {
      console.error('Erro ao carregar localização ou dados do usuário:', error);
    } finally {
      setLoading(false); // Concluir carregamento
    }
  };

  useEffect(() => {
    loadUserDataAndLocation(); // Carregar dados do usuário e localização ao montar o componente
  }, []);

  // Calcular a distância apenas quando a localização do usuário e os dados do Firestore estiverem carregados
  useEffect(() => {
    if (userLocation && userLoaded) {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        latitude,
        longitude
      );
      setDistance(dist.toFixed(2)); // Armazena a distância com 2 casas decimais
    }
  }, [userLocation, userLoaded]);

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
    navigation.goBack();
  };

  const handleToggleInterestList = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para salvar itens.');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);

      if (isSaved) {
        // Remove o item da lista de interesses se ele já estiver salvo
        await updateDoc(userRef, {
          interestList: arrayRemove({
            name,
            imageUrl,
            category,
            userEmail,
          }),
        });
        setIsSaved(false);
        Alert.alert('Item removido', 'Item removido da sua lista de interesses.');
      } else {
        // Adiciona o item na lista de interesses se não estiver salvo
        await updateDoc(userRef, {
          interestList: arrayUnion({
            name,
            imageUrl,
            category,
            userEmail,
          }),
        });
        setIsSaved(true);
        Alert.alert('Item salvo', 'Item adicionado à sua lista de interesses.');
      }
    } catch (error) {
      console.error('Erro ao atualizar a lista de interesses:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o item. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const toggleVisibility = async (newVisibility: boolean) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Erro', 'Nenhum usuário logado.');
        return;
      }

      const userId = user.uid;
      const userRef = doc(db, 'users', userId);

      // Buscar o documento do usuário
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (!userData || !userData.items) {
        Alert.alert('Erro', 'Nenhum item encontrado para este usuário.');
        return;
      }

      // Atualizar o item correto dentro do array
      const updatedItems = userData.items.map((item: any) =>
        item.id === itemId ? { ...item, visibility: newVisibility } : item
      );

      // Atualizar o documento com a nova visibilidade
      await updateDoc(userRef, {
        items: updatedItems,
      });

      // Atualiza o estado local
      setVisibility(newVisibility);

      Alert.alert('Sucesso', 'A visibilidade foi atualizada.');
    } catch (error) {
      console.error('Erro ao atualizar a visibilidade: ', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar a visibilidade.');
    }
  };

  const handleDeleteItem = async () => {
    Alert.alert(
      'Confirmação',
      `Tem certeza que deseja apagar o item: ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const auth = getAuth();
              const user = auth.currentUser;

              if (!user) {
                Alert.alert('Erro', 'Nenhum usuário logado.');
                return;
              }

              const userId = user.uid;
              const userRef = doc(db, 'users', userId);

              const userDoc = await getDoc(userRef);
              const userData = userDoc.data();

              if (!userData || !userData.items) {
                Alert.alert(
                  'Erro',
                  'Nenhum item encontrado para este usuário.'
                );
                return;
              }

              const updatedItems = userData.items.filter(
                (item: any) => item.id !== itemId
              );

              await updateDoc(userRef, {
                items: updatedItems,
              });

              Alert.alert('Sucesso', 'O item foi apagado com sucesso.');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao apagar item: ', error);
              Alert.alert('Erro', 'Ocorreu um erro ao apagar o item.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <AntDesign name='leftcircleo' size={30} color='black' />
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

        {userEmail ? (
          <>
            <Text style={styles.label}>Adicionado por:</Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={[styles.value, styles.email]}>{userEmail}</Text>
            </TouchableOpacity>

            {distance && !isNaN(Number(distance)) ? (
              <>
                <Text style={styles.label}>Distância:</Text>
                <Text style={styles.value}>{distance} km</Text>
              </>
            ) : (
              <Text style={styles.value}>Distância não disponível</Text>
            )}
            {/* Botão para salvar/remover da lista de interesses */}
            <TouchableOpacity
              style={[
                styles.saveItem,
                isSaved ? styles.itemSaved : styles.itemNotSaved,
              ]}
              onPress={handleToggleInterestList}
            >
              <Text style={styles.labelButton}>
                {isSaved
                  ? 'Remover da lista de interesses'
                  : 'Salvar na lista de interesses'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Visibilidade:</Text>
              <Switch
                value={visibility}
                onValueChange={toggleVisibility}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={visibility ? '#ffffff' : '#f4f3f4'}
              />
            </View>
            <TouchableOpacity
              onPress={handleDeleteItem}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Apagar Item</Text>
            </TouchableOpacity>
          </>
        )}
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#ff3333',
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveItem: {
    width: '100%',
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  itemSaved: {
    backgroundColor: 'red',
  },
  itemNotSaved: {
    backgroundColor: 'green',
  },
  labelButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
