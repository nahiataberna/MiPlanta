import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Campobase from './componentes/CampobaseComponent';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PantallaLogin from './componentes/LoginComponent';
import Publicaciones from './componentes/Publicaciones';
import AnadirPost from './componentes/AnadirPostComponent';
import BotonAnadirPost from './componentes/BotonAnadirPostComponent.js';
import './config/firebase';

const store = ConfigureStore();

// Guardar datos
const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('Datos guardados');
  } catch (error) {
    console.log('Error al guardar datos: ', error);
  }
};

// Obtener datos
/*const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('Datos obtenidos: ', value);
      return value;
    } else {
      console.log('No se encontraron datos para la clave: ', key);
    }
  } catch (error) {
    console.log('Error al obtener datos: ', error);
  }
};*/


export default function App() {

  const estaLogin = false;
  const [mostrarAnadirPost, setMostrarAnadirPost] = useState(false);
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {
          estaLogin ?

            <View style={styles.container}>
              {mostrarAnadirPost ?
                <AnadirPost /> :
                <View style={styles.container}>
                  <Campobase />
                  <StatusBar style="auto" />
                  < BotonAnadirPost onPress={() => setMostrarAnadirPost(true)} />
                </View>
              }

            </View>
            :
            <View style={styles.container}>
              <PantallaLogin />
              <Publicaciones />
            </View>

        }
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});