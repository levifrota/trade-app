import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ItemListComponent } from '@/components/ItemListComponent';
import { useNavigation } from 'expo-router';
import { getAuth } from 'firebase/auth';
import * as Location from 'expo-location'; // API para localização do dispositivo
import { Picker } from '@react-native-picker/picker';

export default function ItemListScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState(''); // Para pesquisa de nome
  const [selectedCategory, setSelectedCategory] = useState(''); // Para pesquisa de categoria
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null); // Localização atual do usuário
  
  const auth = getAuth(); 
  const currentUser = auth.currentUser; 
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchUserLocation();
  }, [navigation]);

  // Função para buscar a localização atual do usuário
  const fetchUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permissão de localização negada.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  useEffect(() => {
    if (!currentUser) return; 

    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (querySnapshot) => {
        const otherUsersItems = querySnapshot.docs.flatMap((doc) => {
          const data = doc.data();
          return data.items?.filter((item: any) => item.userEmail !== currentUser.email) || [];
        });

        setItems(otherUsersItems);
        setFilteredItems(otherUsersItems); // Inicialmente, todos os itens são exibidos
        setLoading(false);
      },
      (error) => {
        setError('Erro ao carregar itens.');
        console.error('Erro ao buscar itens: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Filtro dinâmico ao digitar ou selecionar categoria
  useEffect(() => {
    const filtered = items.filter((item) => {
      const nameMatch = searchName ? item.name.toLowerCase().includes(searchName.toLowerCase()) : true;
      const categoryMatch = selectedCategory ? item.category === selectedCategory : true;
      return nameMatch && categoryMatch;
    });
    setFilteredItems(filtered);
  }, [searchName, selectedCategory, items]); // Filtro é recalculado sempre que um desses estados mudar

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#4CAF50' />
        <Text style={styles.loadingText}>Carregando itens...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textInput}>Nome do Item: </Text>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar por nome"
        value={searchName}
        onChangeText={setSearchName}
      />

      <Text style={styles.textInput}>Categoria: </Text>
      <Picker
        selectedValue={selectedCategory}
        style={{ height: 50, width: "100%" }}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="--- Categoria" value="" />
        <Picker.Item label="Casa e Decoração" value="Casa e Decoração" />
        <Picker.Item label="Móveis" value="Móveis" />
        <Picker.Item label="Eletro" value="Eletro" />
        <Picker.Item label="Materiais de Construção" value="Materiais de Construção" />
        <Picker.Item label="Informática" value="Informática" />
        <Picker.Item label="Games" value="Games" />
        <Picker.Item label="Tvs e Video" value="Tvs e Video" />
        <Picker.Item label="Áudio" value="áudio" />
        <Picker.Item label="Câmeras e Drones" value="Câmeras e Drones"/>
        <Picker.Item label="Moda e Beleza" value="Moda e Beleza" />
        <Picker.Item label="Escritório e Home Office" value="Escritório e Home Office" />
        <Picker.Item label="Musica e Hobbies" value="Música e Hobbies" />
        <Picker.Item label="Esportes e Fitness" value="Esportes e Fitness" />
        <Picker.Item label="Artigos Infantis" value="Artigos Infantis" />
        <Picker.Item label="Animais de Estimação" value="Animais de Estimação" />
        <Picker.Item label="Agro e Indústria" value="Agro e Indútria" />
        <Picker.Item label="Serviços" value="Serviços" />
        <Picker.Item label="Vagas de Emprego" value="Vagas de Emprego" />
      </Picker>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemListComponent
            name={item.name}
            imageUrl={item.imageUrl}
            visibility={item.visibility}
            category={item.category}
            userEmail={item.userEmail}
            latitude={item.latitude}   // Passa diretamente latitude
            longitude={item.longitude} // Passa diretamente longitude
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 10,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8d7da',
  },
  errorText: {
    fontSize: 18,
    color: '#721c24',
  },
  textInput: {
    paddingLeft: 10,
  }
});
