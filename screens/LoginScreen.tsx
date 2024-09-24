import React, { useState, useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import { signUp, signIn } from '../services/authService';
import { auth } from '../firebaseConfig';
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  if (email === null) {
    return;
  }

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

  return (
    <View style={styles.screen}>
      <AuthForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
        onPasswordReset={() => handlePasswordReset(email)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
});