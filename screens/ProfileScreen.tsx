import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { signUp, signIn, logOut } from '../services/authService';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { ProfileForm } from '../components/ProfileForm';
import { AuthForm } from '../components/AuthForm';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  if (email === null) {
    return;
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadUserProfile();
    }
  }, [isLoggedIn]);

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
        await setDoc(userProfileDoc, {
          name: user.displayName || '',
          email: user.email,
          photoUrl: user.photoUrl || '',
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
    } catch (error: any) {
      console.error(error);
      if (error.message.includes('email-already-in-use')) {
        Alert.alert('Erro no cadastro', 'Email já cadastrado');
      } else {
        Alert.alert('Erro no cadastro', error.message);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const signedInUser = await signIn(email, password);
      setUser(signedInUser);
      setIsLoggedIn(true);
    } catch (error: any) {
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
    setPhotoUrl('');
  };

  const handleSaveProfile = async () => {
    if (user) {
      const userProfileDoc = doc(db, 'users', user.uid);
      await setDoc(
        userProfileDoc,
        {
          name,
          email,
          photoUrl,
        },
        { merge: true }
      );
      Alert.alert(
        'Perfil atualizado',
        'Suas informações foram salvas com sucesso.'
      );
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

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        const userProfileDoc = doc(db, 'users', user.uid);
        await deleteDoc(userProfileDoc);
        await deleteUser(user);
        Alert.alert('Conta deletada', 'Sua conta foi deletada com sucesso.');
        setIsLoggedIn(false);
        setUser(null);
        setName('');
        setEmail('');
        setPassword('');
        setPhotoUrl('');
      } catch (error: any) {
        console.error('Erro ao deletar conta: ', error);
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao deletar sua conta. Por favor, tente novamente.'
        );
      }
    } else {
      Alert.alert('Erro', 'Nenhum usuário autenticado para deletar.');
    }
  };

  if (isLoggedIn) {
    return (
      <ProfileForm
        name={name}
        email={email}
        photoUrl={photoUrl}
        onNameChange={setName}
        onPickImage={pickImage}
        onSaveProfile={handleSaveProfile}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
    );
  }

  return (
    <AuthForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSignUp={handleSignUp}
      onSignIn={handleSignIn}
      onPasswordReset={() => handlePasswordReset(email)}
    />
  );
}

const handlePasswordReset = async (email: string) => {
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
  } catch (error: any) {
    console.error('Erro ao enviar email de recuperação: ', error);
    Alert.alert('Erro ao enviar email de recuperação', error.message);
  }
};
