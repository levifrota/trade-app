import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { ItemListComponent } from '@/components/ItemListComponent';

export default function ItemListScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (querySnapshot) => {
        const userItems = querySnapshot.docs.flatMap(doc => {
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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemListComponent
            name={item.name}
            image={item.imageUri}
            visibility={item.visibility}
            category={item.category}
          />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
  },
})