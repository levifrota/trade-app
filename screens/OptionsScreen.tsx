import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OptionsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao TradeApp!</Text>
      <View style={styles.buttonDiv}>
        <Button
          title='Ver Perfil'
          onPress={() => navigation.navigate('Profile')}
        />
        <View style={styles.spaceButton}/>
        <Button
          title='Adicionar Item'
          onPress={() => navigation.navigate('AddItem')}
        />
        <View style={styles.spaceButton}/>
        <Button
          title='Ver Itens'
          onPress={() => navigation.navigate('ItemList')}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  buttonDiv: {
    width: "100%",
    height: "80%"
  },

  title: {
    marginBottom: "20%",
    marginTop: "20%",
  },

  spaceButton: {
    marginBottom: "5%",
  }
});