import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import { signUp, signIn, logOut } from '../services/authService';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserProfile();
    }
  }, [isLoggedIn]);

  if (email === null) {
    // Trate o caso onde email é null, talvez exiba uma mensagem de erro ou solicite que o usuário insira um email válido.
    Alert.alert('Erro', 'O email não pode ser nulo.');
    return;
  }

  const loadUserProfile = async () => {
    if (user) {
      const userProfileDoc = doc(db, 'users', user.uid);
      const userProfile = await getDoc(userProfileDoc);

      if (userProfile.exists()) {
        const data = userProfile.data();
        setName(data.name);
        setEmail(data.email);
        setPhotoUrl(data.photoUrl);
      } else {
        // Se não houver perfil, crie um perfil básico
        await setDoc(userProfileDoc, {
          name: user.displayName || '',
          email: user.email,
          photoUrl: user.photoURL || '',
        });
      }
    }
  };

  const handleSignUp = async () => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        Alert.alert('Erro no cadastro', 'Este email já está cadastrado.');
        return;
      }
      const newUser = await signUp(email, password);
      setUser(newUser);
      setIsLoggedIn(true);
    } catch (error:any) {
      if (Boolean(error.message.includes('email-already-in-use'))) {
        Alert.alert('Erro no cadastro', 'Email já cadastrado');
      } else {
        Alert.alert('Erro no cadastro', error.message);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        Alert.alert('Erro no login', 'Este email não está cadastrado.');
        return;
      }
      const signedInUser = await signIn(email, password);
      setUser(signedInUser);
      setIsLoggedIn(true);
    } catch (error:any) {
      console.error('Erro no login: ', error);
      Alert.alert('Erro no login', error.message);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setIsLoggedIn(false);
    setUser(null);
    setName('');
    setEmail('');
    setPhotoUrl('');
  };

  const handleSaveProfile = async () => {
    if (user) {
      const userProfileDoc = doc(db, 'users', user.uid);
      await setDoc(userProfileDoc, {
        name,
        email,
        photoUrl,
      }, { merge: true });
      Alert.alert('Perfil atualizado', 'Suas informações foram salvas com sucesso.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  if (isLoggedIn) {
    return (
      <View>
        <TextInput placeholder="Nome" value={name} onChangeText={setName} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} editable={false} />
        {photoUrl ? <Image source={{ uri: photoUrl }} style={{ width: 100, height: 100 }} /> : null}
        <Button title="Selecionar Foto" onPress={pickImage} />
        <Button title="Salvar Perfil" onPress={handleSaveProfile} />
        <Button title="Sair" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        keyboardType='email-address'
        style={styles.textfield}
      />
      <TextInput
        placeholder='Senha'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textfield}
      />
      <Button title='Cadastrar' onPress={handleSignUp} />
      <Button title='Entrar' onPress={handleSignIn} />
      <Button
        title='Recuperar Senha'
        onPress={() => handlePasswordReset(email)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textfield: {
    backgroundColor: '#ffffff',
  }
});

const handlePasswordReset = async (email: string | null) => {
  // Supondo que 'email' possa ser 'null'
  if (!email) {
    Alert.alert(
      'Erro',
      'Por favor, insira um email válido para recuperação de senha.'
    );
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert(
      'Recuperação de senha',
      'Um email para redefinição de senha foi enviado.'
    );
  } catch (error:any) {
    console.error('Erro ao enviar email de recuperação: ', error);
    Alert.alert('Erro ao enviar email de recuperação', error.message);
  }
};