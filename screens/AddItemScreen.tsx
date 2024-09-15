import React, { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { insertItem } from '../services/itemService';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleSaveItem = () => {
    insertItem({ name, category, imageUri });
  };

  return (
    <View>
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
      <Button title='Tirar Foto' onPress={pickImage} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      ) : null}
      <Button title='Salvar Item' onPress={handleSaveItem} />
    </View>
  );
}
