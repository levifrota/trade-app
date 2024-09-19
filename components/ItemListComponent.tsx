import { View, Image, Text, StyleSheet } from 'react-native';

interface ItemsProps {
  name: string;
  image: string;
  visibility: boolean;
  category: string;
}

export const ItemListComponent: React.FC<ItemsProps> = ({
  name,
  image,
  visibility,
  category,
}) => {
  if (!visibility) {
    return null;
  }

  return (
    <View style={styles.itemContainer}>
      {image === '' ? (
        <Image
          source={require('../assets/images/no-image-icon.png')}
          style={styles.image}
        />
      ) : (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
    </View>
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
