import { useState } from "react";
import { Button, View, Text, TextInput, StyleSheet } from "react-native";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { firestore } from "../firebase"
import bcrypt from 'bcryptjs';
import { useNavigation } from '@react-navigation/native';


export default function RegisterScreen (){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handle = async () => {

    if (name === '' || email  === "" || password === "") {
      alert("Erro! Campos em branco.");
    }else{
      try {
        const q = query(collection(firestore, "Users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          alert("Email já cadastrado!");
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const Usuario = await addDoc(collection(firestore, "Users"), {
          nome: name,
          email: email,
          senha: hashedPassword,
        });

        alert(`Usuário cadastrado! Bem vindo ${name}`);
        setPassword('');
        setEmail('')
        setName('')
        navigation.navigate('LoginScreen')
      } catch (error) {
        console.error("Erro ao cadastrar usuário: ", error);
        alert("Erro ao cadastrar usuário");
      }
    };
  }
    
    
  return (
    <View style={styles.divView}>
      <Text>Nome:</Text>
      <TextInput
        style={styles.inputs}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

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
      onPress={handle}
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