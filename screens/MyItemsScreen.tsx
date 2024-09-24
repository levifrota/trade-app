import { ItemListComponent } from "@/components/ItemListComponent";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { UserListComponent } from "@/components/UserListComponent";


export default function MyItemsScreen () {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('Nenhum usuário logado.');
      setLoading(false);
      return;
    }

    const userId = user.uid;

    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        const data = doc.data();
        const userItems = data?.items || [];

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Itens</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserListComponent
            name={item.name}
            imageUrl={item.imageUrl}
            visibility={item.visibility}
            category={item.category}
            itemId={item.id}
          />
        )}
      />
    </View>
  );
};

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
})