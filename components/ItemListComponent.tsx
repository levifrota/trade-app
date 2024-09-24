import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ItemsProps {
  name: string;
  imageUrl: string;
  visibility: boolean;
  category: string;
  userEmail: string;
  itemId: string;
  latitude?: number; // Latitude do item (opcional)
  longitude?: number; // Longitude do item (opcional)
}

export const ItemListComponent: React.FC<ItemsProps> = ({
  name,
  imageUrl,
  visibility,
  category,
  userEmail,
  itemId,
  latitude, // Latitude do item
  longitude, // Longitude do item
}) => {
  const navigation = useNavigation();

  if (!visibility) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('ItemDetails', {
          name: name,
          category: category,
          imageUrl: imageUrl,
          userEmail: userEmail,
          itemId: itemId,
          latitude: latitude,
          longitude: longitude,
        })
      }
    >
      {imageUrl === '' || imageUrl === undefined ? (
        <Image
          source={require('../assets/images/no-image-icon.png')}
          style={styles.image}
        />
      ) : (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
