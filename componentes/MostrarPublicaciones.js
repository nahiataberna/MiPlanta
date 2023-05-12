import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { color1, color2} from "../comun/comun";

const MostrarPublicaciones = ({ publicaciones }) => {
  return (
    <View >
      {publicaciones.map(publicacion => (
        <View key={publicacion.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={styles.user}>{publicacion.user}</Text>
            <Text style={styles.date}>{publicacion.fecha}</Text>
          </View>
          <Text style={styles.title}>{publicacion.titulo}</Text>
          <Image source={{ uri: publicacion.imagen }}  style={styles.image}/>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  user: {
    alignSelf: "flex-start",
    marginLeft: 40,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#000",
    fontSize: 12,
  },
  date: {
    alignSelf: "flex-end",
    marginRight: 40,
    marginBottom: 10,
    color: "#000",
    fontSize: 12,
  },
  title: {
    marginBottom: 10,
    marginLeft: 40,
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
  image: {
    width: 300,
    aspectRatio: 1,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});

export default MostrarPublicaciones;