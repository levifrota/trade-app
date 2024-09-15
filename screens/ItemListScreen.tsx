import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getItems } from '../services/itemService';

interface Item {
  id: number;
  name: string;
  category: string;
  imageUri: string;
}

export default function ItemListScreen() {
  const [items, setItems] = useState<Item[]>([]); // Defina o tipo correto para o estado

  useEffect(() => {
    const fetchItems = async () => {
      const fetchedItems: Item[] = await getItems(); // Defina o tipo aqui também
      setItems(fetchedItems);
    };
    fetchItems();
  }, []);

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.name} - {item.category}
          </Text>
        )}
      />
    </View>
  );
}
