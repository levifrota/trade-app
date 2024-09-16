import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View>
      <Text style={styles.divImage}>Perfil do Usuário</Text>
      <View style={styles.divImage}>
        <Image
          style={styles.imageUser}
        />
      </View>
      <View style={styles.divImage}>
        <Text>UserName</Text>
        <Text>Email</Text>
        <Text></Text>
      </View>
      <Button title='Editar Perfil' onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageUser:{
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "yellow",
  },

  divImage:{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  }

})