import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';


export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [visibility, setVisibility] = useState(true)

  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleAddItem = async () => {
    if (category === "" || name === "") {
      Alert.alert("Erro! Campo(s) em branco", "Preencha os campos corretamente");
    }else{
      try {
        const auth = getAuth();  
        const user = auth.currentUser;  

        if (!user) {
          Alert.alert('Erro', 'Nenhum usuário logado.');
          return;
        }

        const userId = user.uid;  

        const userRef = doc(db, 'users', userId);

        const finalImageUri = imageUri || ''; 

        await updateDoc(userRef, {
          items: arrayUnion({
            name,
            category,
            imageUri: finalImageUri,
            visibility,
            createdAt: new Date(),
          }),
        });

        Alert.alert('Item Adicionado', 'O item foi salvo com sucesso dentro do perfil do usuário.');
        setName('')
        setCategory('')
        setImageUri('')
        setVisibility(true)
        navigation.navigate('Lista de itens')
      } catch (error) {
        console.error('Erro ao adicionar item: ', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o item.');
      }
    }
    
  };


  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Nome do item'
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder='Categoria'
        value={category}
        onChangeText={setCategory}
      />
      <Button
      title='Visibilidade'
      color={visibility?"green":"red"}
      onPress={()=>setVisibility(visibility? false : true)}
      />
      <Button title='Tirar Foto' onPress={pickImage} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      ) : null}
      <Button title='Salvar Item' onPress={()=>handleAddItem()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  }
});