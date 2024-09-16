import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signIn, signUp } from '../services/authService';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Função para validar email usando regex
const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    // Valida se o email está no formato correto
    if (!validateEmail(email)) {
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return;
    }

    // Valida se a senha tem o comprimento mínimo
    if (password.length < 6) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter pelo menos 6 caracteres.'
      );
      return;
    }

    try {
      const user = await signUp(email, password);
      console.log('Usuário cadastrado: ', user);
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
      // Verifica se o email está cadastrado
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        Alert.alert('Erro no login', 'Este email não está cadastrado.');
        return;
      }

      // Se o email estiver cadastrado, tenta autenticar
      const user = await signIn(email, password);
      console.log('Usuário autenticado: ', user);
    } catch (error) {
      console.error('Erro no login: ', error);
    }
  };

  return (
    <View>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} style={styles.textfield} />
      <TextInput
        placeholder='Senha'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textfield}
      />
      <Button title='Cadastrar' onPress={handleSignUp} />
      <Button title='Entrar' onPress={handleSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  textfield: {
    backgroundColor: '#ffffff',
  }
});