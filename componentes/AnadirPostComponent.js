import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from '@rneui/themed';
import { Image, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { storage, db } from '../config/firebase.js';
import { collection, addDoc } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { Camera } from "expo-camera";

let url = '';

const Separator = () => <View style={styles.separator} />;

function AnadirPost(props) {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [foto, setFoto] = useState(null);

    function handleTituloChange(event) {
        setTitulo(event);
    }

    function handleDescripcionChange(event) {
        setDescripcion(event);
    }

    function handleSubmit() {
        subirPostBBDD(titulo, descripcion, props.setMostrarAnadirPost).then(() => {
            setTitulo('');
            setDescripcion('');
            setFoto('');
        });
    }

    async function handleTakePhoto() {
        await Camera.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [300, 200],
            quality: 1,
        });
        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    }
    useEffect(() => {
        if (foto) {
            subirFotoBBDD(foto, props);
        }
    }, [foto]);


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

async function subirFotoBBDD(foto) {

    try {
        const fecha = (new Date()).toString();

        const response = await fetch(foto, {
            responseType: 'blob',
        });
        const blob = await response.blob();

        const storageRef = ref(storage, user + "/" + fecha);

        uploadBytes(storageRef, blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log('La imagen se encuentra en ', downloadURL);
                url = downloadURL;
            });
        });
    } catch (error) {
        console.log("Error en subirFotoBBDD: " + error);
    }

};

async function subirPostBBDD(titulo, descripcion, setMostrarAnadirPost) {
    const docRef = await addDoc(collection(db, "posts"), {
        user: "nahiataberna@gmail.com",
        fecha: new Date(),
        descripcion: descripcion,
        titulo: titulo,
        img: url
    }).then((docRef) => {
        if (docRef) {
            alert("Se ha añadido el post");
            setMostrarAnadirPost(false);
        }
    });
}


export default AnadirPost;
