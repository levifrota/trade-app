import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.buttonOptions}>
        <Button
        title='Login'
        onPress={() => navigation.navigate('LoginScreen')}
        />
        <View style={styles.divideButtons}/>
        <Button
        title='Register'
        onPress={() => navigation.navigate('RegisterScreen')}/>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },

  buttonOptions :{
    marginTop: "50%",
  },

  divideButtons:{
    marginTop: 50,
  }
});