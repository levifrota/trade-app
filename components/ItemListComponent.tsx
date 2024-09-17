import { View, Image, Text, StyleSheet } from 'react-native';

interface ItemsProps{
  name:string;
  image:string;
  visibility:boolean;
  category:string;
}

export const ItemListComponent:React.FC <ItemsProps>=({
  name,
  image,
  visibility,
  category
}) => {
  return (
    <View style={visibility?styles.visibilityTrue:styles.visibilityFalse}>
      <Image
        source={{uri:image}}
        style={{ width: 100, height: 100 }}
      />
      <Text style={styles.textItem}>{name}</Text>
      <Text style={styles.textItem}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  visibilityFalse:{
    display: "flex",
  },
  visibilityTrue:{
    display: "flex",
    flexDirection: "row",
    backgroundColor:"white",
  },
  textItem:{
    marginRight: 25,
    marginLeft: 25,
  }
})