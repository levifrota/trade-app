import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ItemListComponent } from '@/components/ItemListComponent';
import { useNavigation } from 'expo-router';

export default function ItemListScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (querySnapshot) => {
        const userItems = querySnapshot.docs.flatMap((doc) => {
          const data = doc.data();
          return data.items || [];
        });

        setItems(userItems);
        setLoading(false);
      },
      (error) => {
        setError('Erro ao carregar itens.');
        console.error('Erro ao buscar itens: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#4CAF50' />
        <Text style={styles.loadingText}>Carregando itens...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Itens</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemListComponent
            name={item.name}
            imageUrl={item.imageUrl}
            visibility={item.visibility}
            category={item.category}
            userEmail={item.userEmail}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8d7da',
  },
  errorText: {
    fontSize: 18,
    color: '#721c24',
  },
});
