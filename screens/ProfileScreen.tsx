import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { signUp, signIn, logOut } from '../services/authService';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import {
  deleteUser,
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { ProfileForm } from '../components/ProfileForm';
import * as Location from 'expo-location';
import { Linking } from 'react-native';


export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [userLocation, setUserLocation] = useState(null);

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
        setUserLocation(data.userLocation);
      } else {
        await setDoc(userProfileDoc, {
          name: user.displayName || '',
          email: user.email,
          photoUrl: user.photoUrl || '',
          userLocation: user.userLocation || null,
        });
      }
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
          userLocation,
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
      Alert.alert(
        'Confirmação',
        'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Cancelado'),
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: async () => {
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
                handleLogout();
              } catch (error: any) {
                console.error('Erro ao deletar conta: ', error);
                Alert.alert(
                  'Erro',
                  'Ocorreu um erro ao deletar sua conta. Por favor, tente novamente.'
                );
              }
            },
          },
        ],
        { cancelable: false } // Impede que o alerta seja fechado ao clicar fora dele
      );
    } else {
      Alert.alert('Erro', 'Nenhum usuário autenticado para deletar.');
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para acessar a localização negada');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
    Alert.alert('Localização capturada', `Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`);
  };

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
      onButtonLocation={getLocation}
    />
  );
};
