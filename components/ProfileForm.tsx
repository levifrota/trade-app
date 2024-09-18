import React from 'react';
import { View, TextInput, Image, Button, StyleSheet } from 'react-native';

interface ProfileFormProps {
  name: string;
  email: string;
  photoUrl: string;
  onNameChange: (name: string) => void;
  onPickImage: () => void;
  onSaveProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  name,
  email,
  photoUrl,
  onNameChange,
  onPickImage,
  onSaveProfile,
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <View>
      <TextInput
        placeholder='Nome'
        value={name}
        onChangeText={onNameChange}
        style={styles.textfield}
      />
      <TextInput
        placeholder='Email'
        value={email}
        editable={false}
        style={styles.textfield}
      />
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={{ width: 100, height: 100 }} />
      ) : null}
      <Button title='Selecionar Foto' onPress={onPickImage} />
      <Button title='Salvar Perfil' onPress={onSaveProfile} />
      <Button title='Sair' onPress={onLogout} />
      <Button title='Deletar Conta' onPress={onDeleteAccount} color='red' />
    </View>
  );
};

const styles = StyleSheet.create({
  textfield: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
  },
  profile: {
    padding: 10,
  }
});
