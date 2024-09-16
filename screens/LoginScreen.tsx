import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { TextInput, View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import bcrypt from 'bcryptjs';
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase";

export default function LoginScreen (){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Erro! Campos em branco.");
      return;
    }

    try {
      const q = query(collection(firestore, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Usuário não encontrado!");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      const passwordMatch = await bcrypt.compare(password, userData.senha);

      if (passwordMatch) {
        alert(`Login bem-sucedido! Bem-vindo(a), ${userData.nome}`);
        setEmail('')
        setPassword('')
        navigation.navigate('AddItem');
      } else {
        alert("Senha incorreta!");
      }
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      alert("Erro ao fazer login.");
    }
  };

  return (
    <View style={styles.divView}>
      <Text>Email:</Text>
      <TextInput
        style={styles.inputs}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Text>Senha:</Text>
      <TextInput
        style={styles.inputs}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />

      <Button
      title="Submit"
      onPress={handleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputs: {
    borderBottomWidth: 1,	
    marginBottom: 20,
    height: 40,
    padding: 10,
  },

  divView: {
    padding: 10,
  }
})