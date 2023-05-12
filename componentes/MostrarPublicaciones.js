import React from 'react';
import { StyleSheet,View, Text, Image } from 'react-native';
import { color1, color2} from "../comun/comun";

const MostrarPublicaciones = ({ publicaciones }) => {
  return (
    <View >
      {publicaciones.map(publicacion => (
        <View key={publicacion.id}>
          <Text >{publicacion.user}</Text>
          <Text >{publicacion.titulo}</Text>
          <Text >{publicacion.fecha}</Text>
          <Image source={{ uri: publicacion.imagen }}  style={{ width: 200, height: 200 }}/>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
  },
  image: {
      marginBottom: 40,
      width: 220,
      height: 220,
  },
  user: {
      height: 30,
      marginBottom: 30,
      color: color2,
  },
  title: {
      height: 30,
      marginBottom: 30,
      color: color2,
  }
});

export default MostrarPublicaciones;