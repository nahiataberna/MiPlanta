import React from 'react';
import { View, Text, Image } from 'react-native';

const MostrarPublicaciones = ({ publicaciones }) => {
  return (
    <View>
      {publicaciones.map(publicacion => (
        <View key={publicacion.id}>
          <Text>{publicacion.user}</Text>
          <Text>{publicacion.titulo}</Text>
          <Image source={{ uri: publicacion.imagen }} style={{ width: 100, height: 100 }} />
        </View>
      ))}
    </View>
  );
};

export default MostrarPublicaciones;