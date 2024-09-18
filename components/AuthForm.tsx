import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface AuthFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSignUp: () => void;
  onSignIn: () => void;
  onPasswordReset: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSignUp,
  onSignIn,
  onPasswordReset,
}) => {
  return (
    <View>
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize='none'
        keyboardType='email-address'
        style={styles.textfield}
      />
      <TextInput
        placeholder='Senha'
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        style={styles.textfield}
      />
      <Button title='Cadastrar' onPress={onSignUp} />
      <Button title='Entrar' onPress={onSignIn} />
      <Button title='Recuperar Senha' onPress={onPasswordReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  textfield: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
  },
});
