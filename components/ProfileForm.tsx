import React from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Seu Perfil</Text>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.profileImage} />
      ) : (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.initials}>
            {name ? name[0].toUpperCase() : '?'}
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={onPickImage}>
        <Text style={styles.buttonText}>Selecionar Foto</Text>
      </TouchableOpacity>

      <TextInput
        placeholder='Nome'
        value={name}
        onChangeText={onNameChange}
        style={styles.textField}
      />
      <TextInput
        placeholder='Email'
        value={email}
        editable={false}
        style={[styles.textField, styles.disabledField]}
      />

      <TouchableOpacity style={styles.button} onPress={onSaveProfile}>
        <Text style={styles.buttonText}>Salvar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={onLogout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={onDeleteAccount}
      >
        <Text style={styles.buttonText}>Deletar Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  initials: {
    fontSize: 36,
    color: '#888',
  },
  textField: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  disabledField: {
    backgroundColor: '#eee',
    color: '#aaa',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
  },
  title: {
    fontSize: 28, // Maior para dar destaque ao título
    fontWeight: 'bold',
    color: '#333', // Cor escura para contraste
    marginBottom: 40, // Espaço maior abaixo do título
    textAlign: 'center', // Centraliza o texto
  },
});
