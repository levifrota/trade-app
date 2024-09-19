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

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [visibility, setVisibility] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
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
    if (category === '' || name === '') {
      Alert.alert(
        'Erro! Campo(s) em branco',
        'Preencha os campos corretamente'
      );
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

        await updateDoc(userRef, {
          items: arrayUnion({
            name,
            category,
            imageUri: imageUri || '',
            visibility,
            createdAt: new Date(),
          }),
        });

        Alert.alert('Item Adicionado', 'O item foi salvo com sucesso.');
        setName('');
        setCategory('');
        setImageUri('');
        setVisibility(true);
        navigation.navigate('Lista de itens');
      } catch (error) {
        console.error('Erro ao adicionar item: ', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o item.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Adicionar Item
      </Text>
      <TextInput
        placeholder='Nome do item'
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder='Categoria'
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

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

      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Salvar Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28, // Maior para dar destaque ao título
    fontWeight: 'bold',
    color: '#333', // Cor escura para contraste
    marginBottom: 40, // Espaço maior abaixo do título
    textAlign: 'center', // Centraliza o texto
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
