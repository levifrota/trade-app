import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import { signUp, signIn, logOut } from '../services/authService';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';
import { createTable, saveProfileImage, getProfileImage } from '../db';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [photoUri, setPhotoUri] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    createTable();
    if (isLoggedIn) {
      loadUserProfile();
      loadProfileImage();
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
      } else {
        // Se não houver perfil, crie um perfil básico
        await setDoc(userProfileDoc, {
          name: user.displayName || '',
          email: user.email,
        });
      }
    }
  };

  const loadProfileImage = () => {
    if (user) {
      getProfileImage(user.uid, (photo: any) => {
        if (photo) {
          setPhotoUri(photo);
        }
      });
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
      console.error(error);
      if (Boolean(error.message.includes('email-already-in-use'))) {
        Alert.alert('Erro no cadastro', 'Email já cadastrado');
      } else {
        Alert.alert('Erro no cadastro', error.message);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      // const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      // if (signInMethods.length === 0) {
      //   Alert.alert('Erro no login', 'Este email não está cadastrado.');
      //   return;
      // }
      const signedInUser = await signIn(email, password);
      setUser(signedInUser);
      setIsLoggedIn(true);
    } catch (error:any) {
      console.error(error);
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
    setPassword('');
  };

  const handleSaveProfile = async () => {
    if (user) {
      const userProfileDoc = doc(db, 'users', user.uid);
      await setDoc(userProfileDoc, {
        name,
        email,
      }, { merge: true });
      saveProfileImage(user.uid, photoUri);
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
      setPhotoUri(result.assets[0].uri);
    }
  };

  if (isLoggedIn) {
    return (
      <View>
        <TextInput
          placeholder='Nome'
          value={name}
          onChangeText={setName}
          style={styles.textfield}
        />
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          editable={false}
        />
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={{ width: 100, height: 100 }}
          />
        ) : null}
        <Button title='Selecionar Foto' onPress={pickImage} />
        <Button title='Salvar Perfil' onPress={handleSaveProfile} />
        <Button title='Sair' onPress={handleLogout} />
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