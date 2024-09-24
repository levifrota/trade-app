import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ItemsProps {
  name: string;
  imageUrl: string;
  visibility: boolean;
  category: string;
  itemId: string;
}

export const UserListComponent: React.FC<ItemsProps> = ({
  name,
  imageUrl,
  visibility,
  category,
  itemId,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={
        visibility
          ? styles.itemContainerVisibilityTrue
          : styles.itemContainerVisivilityFalse
      }
      onPress={() =>
        navigation.navigate('ItemDetails', {
          name: name,
          category: category,
          imageUrl: imageUrl,
          itemId: itemId,
          visibility: visibility,
        })
      }
    >
      {imageUrl === '' ? (
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
      <View>
        <Text>Visibilidade: {visibility ? 'Pública' : 'Privada'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainerVisibilityTrue: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#d0fdd7',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemContainerVisivilityFalse: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FF8992',
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
