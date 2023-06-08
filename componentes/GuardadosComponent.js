import React, { useEffect, useState } from 'react';
import { Text, ScrollView, View, Modal, TextInput } from 'react-native';
import { Card, Image } from '@rneui/themed';


import { db } from '../config/firebase.js';
import { collection, getDoc, doc as docFB, orderBy, query, where, getDocs } from "firebase/firestore";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    RenderPost,
    RenderComentarios,
    obtenerComentariosBBDD,
    subirComentarioBBDD,
    eliminarPostGuardadoBBDD,
    comprobarPostGuardado,
    stylesHomeGuardados
} from './funcionesPosts';

async function obtenerGuardadosBBDD() {
    const postsRef = collection(db, "guardados");
    const user = await AsyncStorage.getItem('user');
    const q = query(postsRef, where("user", "==", user), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);

    let guardadosBBDD = [];
    try {
        querySnapshot.forEach((doc) => {
            guardadosBBDD.push(doc.data().post);
        });
        return guardadosBBDD;
    } catch (e) {
        setError("Ha habido un error");
        console.log("Error en obtenerGuardadosBBDD: " + e);
    }
};

async function obtenerPostsBBDD(setIsLoading, setPosts, listaIDSGuardados) {
    let postsBBDD = [];
    for (var idDocGuardado of listaIDSGuardados) {
        const docRef = docFB(db, "posts", idDocGuardado);
        const doc = await getDoc(docRef);

        if (doc.exists()) {
            const fecha = new Date(doc.data().fecha.seconds * 1000 + Math.floor(doc.data().fecha.nanoseconds / 1000000));
            const dia = fecha.getDate();
            const mes = fecha.toLocaleString('es-ES', { month: 'long' });
            const anio = fecha.getFullYear();
            const hora = fecha.getHours();
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            const fechaString = `${dia} de ${mes} de ${anio}, ${hora}:${minutos}`;
            postsBBDD.push({
                user: doc.data().user,
                fecha: fechaString,
                titulo: doc.data().titulo,
                descripcion: doc.data().descripcion,
                img: doc.data().img,
                id: doc.id,
            });
        } else {
            console.log("Error en obtenerPostsBBDD: " + e);
        }
    };
    setPosts(postsBBDD);
    setIsLoading(false);
};

function Guardados(props) {
    const [posts, setPosts] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [comentarios, setComentarios] = useState('');
    const [errorComentarios, setErrorComentarios] = useState('');
    const [isLoadingComentarios, setIsLoadingComentarios] = useState(true);

    const [mostrarPost, setMostrarPost] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [comentario, setComentario] = useState('');

    const [guardado, setGuardado] = useState(false);
    const [listaIDSGuardados, setlistaIDSGuardados] = useState('');

    useEffect(() => {
        obtenerGuardadosBBDD().then((listaGuardados) => {
            obtenerPostsBBDD(setIsLoading, setPosts, listaGuardados);
        });
    }, []);

    useEffect(() => {
        obtenerGuardadosBBDD().then((listaGuardados) => {
            obtenerPostsBBDD(setIsLoading, setPosts, listaGuardados);
        });
    }, [props]);

    useEffect(() => {
        props.setHaEntradoInicio(false);
        obtenerGuardadosBBDD().then((listaGuardados) => {
            obtenerPostsBBDD(setIsLoading, setPosts, listaGuardados);
        });
    }, [props.haEntradoInicio]);

    useEffect(() => {
        setGuardado(false);
        if (mostrarPost != '') {
            obtenerComentariosBBDD(setIsLoadingComentarios, setErrorComentarios, setComentarios, mostrarPost.id);
            comprobarPostGuardado(mostrarPost.id, setGuardado);
        }
    }, [mostrarPost]);

    const handleAgregarComentario = () => {
        subirComentarioBBDD(comentario, mostrarPost.id).then(() => {
            setModalVisible(false);
            setComentario('');
            obtenerComentariosBBDD(setIsLoadingComentarios, setErrorComentarios, setComentarios, mostrarPost.id);
        });
    };

    const eliminarPost = (idPost) => {
        eliminarPostGuardadoBBDD(idPost, setGuardado).then(() => {
            setMostrarPost('');
            setPosts(posts.filter(post => post.id !== idPost));
        });
    };

    return (
        <ScrollView>
            {mostrarPost === '' ? (
                <RenderPost posts={posts} isLoading={isLoading} errMess={error} setMostrarPost={setMostrarPost} />
            ) : (
                <View style={stylesHomeGuardados.container}>
                    <View style={stylesHomeGuardados.goBack}>
                        <Icon
                            name="arrow-left"
                            type="font-awesome"
                            size={24}
                            onPress={() => setMostrarPost('')}
                        />
                    </View>
                    <Card>
                        <Text style={stylesHomeGuardados.titulo}>{mostrarPost.titulo}</Text>
                        <Text style={stylesHomeGuardados.info}>{mostrarPost.user} - {mostrarPost.fecha}</Text>
                        <Text style={stylesHomeGuardados.descripcion}>{mostrarPost.descripcion}</Text>
                        <Image source={{ uri: mostrarPost.img }} style={stylesHomeGuardados.imagen} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Icon
                                    name="comment"
                                    type="font-awesome"
                                    size={24}
                                />
                            </TouchableOpacity>
                            {guardado ?
                                <TouchableOpacity onPress={() => eliminarPost(mostrarPost.id)}>
                                    <Icon
                                        name="bookmark"
                                        type="font-awesome"
                                        size={24}
                                    />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => guardarPost(mostrarPost.id)}>
                                    <Icon
                                        name="bookmark-o"
                                        type="font-awesome"
                                        size={24}
                                    />
                                </TouchableOpacity>
                            }
                        </View>
                    </Card>
                    <Card.Divider></Card.Divider>
                    <Text style={stylesHomeGuardados.comentarioTitulo}>Comentarios: </Text>


                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={stylesHomeGuardados.modalContainer}>
                            <Text style={stylesHomeGuardados.modalTitulo}>Añadir comentario</Text>
                            <TextInput
                                style={stylesHomeGuardados.comentarioInput}
                                value={comentario}
                                onChangeText={text => setComentario(text)}
                                placeholder="Escribe tu comentario aquí"
                                multiline={true}
                            />
                            <TouchableOpacity style={stylesHomeGuardados.boton_enviar} onPress={handleAgregarComentario}>
                                <Text style={stylesHomeGuardados.botonText}>Añadir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesHomeGuardados.boton_cancelar} onPress={() => setModalVisible(false)}>
                                <Text style={stylesHomeGuardados.botonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <RenderComentarios comentarios={comentarios} isLoading={isLoadingComentarios} errMess={errorComentarios} />
                </View>
            )}
        </ScrollView>
    );
};

export default Guardados;