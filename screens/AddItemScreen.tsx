import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { uploadImage } from '@/services/storageService';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [visibility, setVisibility] = useState(true);
  const navigation = useNavigation();
  const [latitude, setLatitude] = useState(null); // Inicialize como null
  const [longitude, setLongitude] = useState(null); // Inicialize como null

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para acessar a localização negada');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    Alert.alert('Localização capturada', `Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddItem = async () => {
    // Verifique se a localização já foi coletada
    if (latitude === null || longitude === null) {
      Alert.alert('Erro', 'A localização ainda não foi obtida. Por favor, tente novamente.');
      return;
    }

    if (category === '' || name === '') {
      Alert.alert('Erro! Campo(s) em branco', 'Preencha os campos corretamente');
    } else {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          Alert.alert('Erro', 'Nenhum usuário logado.');
          return;
        }

        const userId = user.uid;
        const userRef = doc(db, 'users', userId);

        let imageUrl = '';
        if (imageUri) {
          imageUrl = await uploadImage(imageUri, `item_${Date.now()}`);
        }

        const newItemId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`; // Gera um UUID único para o item

        await updateDoc(userRef, {
          items: arrayUnion({
            id: newItemId,
            name,
            category,
            imageUrl: imageUrl,
            visibility,
            createdAt: new Date(),
            userEmail: user.email,
            latitude: latitude,  // Agora usa o valor correto
            longitude: longitude, // Agora usa o valor correto
          }),
        });

        Alert.alert('Item Adicionado', 'O item foi salvo com sucesso.');
        setName('');
        setCategory('');
        setImageUri('');
        setVisibility(true);
        // navigation.navigate('Meus itens');
      } catch (error) {
        console.error('Erro ao adicionar item: ', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o item.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Item</Text>
      <TextInput
        placeholder='Nome do item'
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <View style={styles.categoryStyle}>
        <Text>Categoria: </Text>
        <Picker
          selectedValue={category}
          style={{ height: 50, width: 250 }}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="--- Categoria" value={null} />
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
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Visível</Text>
        <Switch
          value={visibility}
          onValueChange={setVisibility}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={visibility ? '#ffffff' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Selecionar Imagem</Text>
      </TouchableOpacity>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : null}

      {/* Botão para capturar localização */}
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Capturar Localização</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Salvar Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryStyle:{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
