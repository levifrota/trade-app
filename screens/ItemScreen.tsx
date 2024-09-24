import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Switch,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

type ItemScreenRouteProp = RouteProp<
  {
    params: {
      name: string;
      imageUrl: string;
      category: string;
      userEmail: string;
      items: Array<any>;
      itemId: string;
      visibility: boolean;
    };
  },
  'params'
>;

export default function ItemScreen() {
  const route = useRoute<ItemScreenRouteProp>();
  const navigation = useNavigation();

  const {
    name,
    imageUrl,
    category,
    userEmail,
    itemId,
    visibility: initialVisibility,
  } = route.params;

  const [visibility, setVisibility] = useState(initialVisibility);

  const handleEmailPress = () => {
    const emailUrl = `mailto:${userEmail}`;
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o cliente de e-mail.');
        }
      })
      .catch((err) => console.error('Erro ao tentar enviar e-mail:', err));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleVisibility = async (newVisibility: boolean) => {
   try {
     const auth = getAuth();
     const user = auth.currentUser;

     if (!user) {
       Alert.alert('Erro', 'Nenhum usuário logado.');
       return;
     }

     const userId = user.uid;
     const userRef = doc(db, 'users', userId);

     // Buscar o documento do usuário
     const userDoc = await getDoc(userRef);
     const userData = userDoc.data();

     if (!userData || !userData.items) {
       Alert.alert('Erro', 'Nenhum item encontrado para este usuário.');
       return;
     }

     // Atualizar o item correto dentro do array
     const updatedItems = userData.items.map((item: any) =>
       item.id === itemId ? { ...item, visibility: newVisibility } : item
     );

     // Atualizar o documento com a nova visibilidade
     await updateDoc(userRef, {
       items: updatedItems,
     });

     // Atualiza o estado local
     setVisibility(newVisibility);

     Alert.alert('Sucesso', 'A visibilidade foi atualizada.');
   } catch (error) {
     console.error('Erro ao atualizar a visibilidade: ', error);
     Alert.alert('Erro', 'Ocorreu um erro ao atualizar a visibilidade.');
   }
 };

  const handleDeleteItem = async () => {
    Alert.alert(
      'Confirmação',
      `Tem certeza que deseja apagar o item: ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const auth = getAuth();
              const user = auth.currentUser;

              if (!user) {
                Alert.alert('Erro', 'Nenhum usuário logado.');
                return;
              }

              const userId = user.uid;
              const userRef = doc(db, 'users', userId);

              const userDoc = await getDoc(userRef);
              const userData = userDoc.data();

              if (!userData || !userData.items) {
                Alert.alert(
                  'Erro',
                  'Nenhum item encontrado para este usuário.'
                );
                return;
              }

              const updatedItems = userData.items.filter(
                (item: any) => item.id !== itemId
              );

              await updateDoc(userRef, {
                items: updatedItems,
              });

              Alert.alert('Sucesso', 'O item foi apagado com sucesso.');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao apagar item: ', error);
              Alert.alert('Erro', 'Ocorreu um erro ao apagar o item.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <AntDesign name='arrowleft' size={30} color='black' />
      </TouchableOpacity>

      <Text style={styles.title}>Detalhes do Item</Text>

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image
          source={require('../assets/images/no-image-icon.png')}
          style={styles.image}
        />
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Nome do Item:</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Categoria:</Text>
        <Text style={styles.value}>{category}</Text>

        {userEmail ? (
          <>
            <Text style={styles.label}>Adicionado por:</Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={[styles.value, styles.email]}>{userEmail}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Visibilidade:</Text>
            <Switch
              value={visibility}
              onValueChange={toggleVisibility}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={visibility ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleDeleteItem}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Apagar Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  email: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#ff3333',
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
