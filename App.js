import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Campobase from './componentes/CampobaseComponent';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PantallaLogin from './componentes/LoginComponent';
import AnadirPost from './componentes/AnadirPostComponent';
import BotonAnadirPost from './componentes/BotonAnadirPostComponent.js';
import './config/firebase';

const store = ConfigureStore();


export default function App() {

  //const estaLogin = false;

  const [estaLogin, setEstaLogin] = useState(false);

  // Function to update the estaLogin value
  const updateLoginStatus = (isLoggedIn) => {
    setEstaLogin(isLoggedIn);
  };
  const [mostrarAnadirPost, setMostrarAnadirPost] = useState(false);
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {
          estaLogin ?

            <View style={styles.container}>
              {mostrarAnadirPost ?
                <AnadirPost setMostrarAnadirPost={setMostrarAnadirPost} /> :
                <View style={styles.container}>
                  <Campobase estaLogin={estaLogin} updateLoginStatus={updateLoginStatus}/>
                  <StatusBar style="auto" />
                  < BotonAnadirPost onPress={() => setMostrarAnadirPost(true)}  />
                </View>
              }

            </View>
            :
            <View style={styles.container}>
              <PantallaLogin estaLogin={estaLogin} updateLoginStatus={updateLoginStatus} />
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