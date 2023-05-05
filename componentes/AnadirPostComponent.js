import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from '@rneui/themed';
import { Image, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import color_botones from '../comun/comun.js';

import * as Permissions from 'expo-permissions';

async function requestCameraPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
        alert('Lo siento, necesitamos los permisos de la cámara para tomar una foto');
    }
}

async function requestCameraRollPermission() {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status !== 'granted') {
        alert('Lo siento, necesitamos los permisos de la biblioteca de imágenes para seleccionar una foto');
    }
}

const Separator = () => <View style={styles.separator} />;

function AnadirPost() {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [foto, setFoto] = useState(null);

    function handleTituloChange(event) {
        setTitulo(event.target.value);
    }

    function handleDescripcionChange(event) {
        setDescripcion(event.target.value);
    }

    function handleSubmit(event) {

    }

    async function handleTakePhoto() {
        await requestCameraPermission();
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [300, 200],
            quality: 1,
        });
        if (!result.cancelled) {
            // Aquí puedes guardar la imagen en tu estado o subirla a un servidor
            setFoto(result.uri);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título:</Text>
            <TextInput
                style={styles.input}
                id="titulo"
                type="text"
                value={titulo}
                onChangeText={handleTituloChange}
            />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={styles.descripcion}
                id="descripcion"
                value={descripcion}
                onChangeText={handleDescripcionChange}
                multiline
            />
            <Text style={styles.label}>Foto:</Text>

            {foto ? (<View>
                <Image style={styles.image} source={{ uri: foto }} />
                <TouchableOpacity>

                    <Text onPress={handleTakePhoto} >Volver a sacar foto</Text>

                </TouchableOpacity>
            </View>
            ) : <Icon
                style={styles.icon}
                name="camera"
                type="font-awesome"
                size={34}
                onPress={handleTakePhoto}
            />}
            <Separator />
            <View style={styles.boton_enviar} >
                <Button title="Enviar"
                    onPress={handleSubmit}
                />
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        width: '80%',
    },
    descripcion: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        width: '80%',
        height: 200,
    },
    label: {
        fontWeight: 'bold',
        marginVertical: 5,
        width: '80%',
    },
    icon: {
        marginTop: 10,
    },
    image: {
        width: 300,
        height: 200,
        marginVertical: 10,
    },
    boton_enviar: {
        borderRadius: 20,
        width: 100,
        height: 40,
        backgroundColor: '#7373',
        color: 'black',
        position: 'absolute',
        bottom: 50,
        left: 40,
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#73783',
        borderBottomWidth: 3,

    },
});

export default AnadirPost;
