import React, { useEffect, useState } from 'react';
import { Text, ScrollView, View, Modal, TextInput, Button } from 'react-native';
import { Card, Image } from '@rneui/themed';
import { StyleSheet, Dimensions } from 'react-native';
import { IndicadorActividad } from './IndicadorActividadComponent';

import { db } from '../config/firebase.js';
import { collection, getDocs, orderBy, limit, query, where, addDoc } from "firebase/firestore";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';

import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function RenderPost(props) {

    const posts = props.posts;

    if (props.isLoading) {
        return (
            <IndicadorActividad />
        );
    }
    else if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess} </Text>
            </View>);
    } else {
        const styles = StyleSheet.create({
            title: {
                fontWeight: 'bold',
            },
            userContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
            },
            user: {
                fontSize: 12,
                color: '#888',
            },
            date: {
                fontSize: 12,
                color: '#888',
            },
            description: {
                marginBottom: 10,
            },
            image: {
                width: 300,
                height: 200,
                marginBottom: 10,
            },
        });

        if (posts != null && posts.length > 0) {
            return posts.map((post, index) => (
                <TouchableOpacity key={index} onPress={() => props.setMostrarPost(post)}>
                    <Card>
                        <Card.Title style={styles.title}>{post.titulo}</Card.Title>
                        <Card.Divider />
                        <View style={styles.userContainer}>
                            <Text style={styles.user}>{post.user}</Text>
                        </View>
                        <Text style={styles.description}>{post.descripcion}</Text>
                        <Image source={{ uri: post.img }} style={styles.image} />
                        <Text style={styles.date}>{post.fecha}</Text>
                    </Card>
                </TouchableOpacity>
            ))
        }
        else {
            return (<View></View>);
        }
    }
};

function RenderComentarios(props) {

    const comentarios = props.comentarios;

    if (props.isLoading) {
        return (
            <IndicadorActividad />
        );
    }
    else if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess} </Text>
            </View>);
    } else {
        const styles = StyleSheet.create({
            userContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 2,
            },
            user: {
                fontSize: 12,
                color: '#888',
            },
            date: {
                fontSize: 12,
                color: '#888',
            },
            description: {
                marginBottom: 5,
            },
            container: {
                width: windowWidth * 0.95,
            }
        });

        if (comentarios != null && comentarios.length > 0) {
            return comentarios.map((comentario, index) => (
                <View style={styles.container}>
                    <Card key={index} >
                        <Text style={styles.description}>{comentario.comentario}</Text>
                        <Card.Divider />
                        <View style={styles.userContainer}>
                            <Text style={styles.user}>{comentario.user}</Text>
                        </View>
                        <Text style={styles.date}>{comentario.fecha}</Text>
                    </Card>
                </View>


            ))
        }
        else {
            return (<View><Text style={styles.date}>Todavía no hay comentarios.</Text></View>);
        }
    }
};


async function obtenerPostsBBDD(setIsLoading, setError, setPosts) {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("fecha", "desc"), limit(20));
    const querySnapshot = await getDocs(q);

    let postsBBDD = [];
    try {
        querySnapshot.forEach((doc) => {
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
        });
        setPosts(postsBBDD);
    } catch (e) {
        setError("Ha habido un error");
        console.log("Error en obtenerPostsBBDD: " + e);
    }
    setIsLoading(false);
};
async function obtenerComentariosBBDD(setIsLoadingComentarios, setErrorComentarios, setComentarios, idPost) {

    const comentariosRef = collection(db, "comentarios");
    const q = query(comentariosRef, where("post", '==', idPost), orderBy("fecha", "desc"), limit(20));
    const querySnapshot = await getDocs(q);

    let comentariosBBDD = [];
    try {
        querySnapshot.forEach((doc) => {
            const fecha = new Date(doc.data().fecha.seconds * 1000 + Math.floor(doc.data().fecha.nanoseconds / 1000000));


            const dia = fecha.getDate();
            const mes = fecha.toLocaleString('es-ES', { month: 'long' });
            const anio = fecha.getFullYear();
            const hora = fecha.getHours();
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            const fechaString = `${dia} de ${mes} de ${anio}, ${hora}:${minutos}`;

            comentariosBBDD.push({
                user: doc.data().user,
                fecha: fechaString,
                comentario: doc.data().comentario,
                id: doc.id,
            });
        });
        setComentarios(comentariosBBDD);
    } catch (e) {
        setErrorComentarios("Ha habido un error");
        console.log("Error en obtenerComentariosBBDD: " + e);
    }
    setIsLoadingComentarios(false);
};

async function subirComentarioBBDD(comentario, postid) {
    const user = await AsyncStorage.getItem('user');
    const docRef = await addDoc(collection(db, "comentarios"), {
        user: user,
        fecha: new Date(),
        comentario: comentario,
        post: postid
    });
};

function Home(props) {
    const [posts, setPosts] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [comentarios, setComentarios] = useState('');
    const [errorComentarios, setErrorComentarios] = useState('');
    const [isLoadingComentarios, setIsLoadingComentarios] = useState(true);

    const [mostrarPost, setMostrarPost] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [comentario, setComentario] = useState('');

    useEffect(() => {
        obtenerPostsBBDD(setIsLoading, setError, setPosts);
    }, []);

    useEffect(() => {
        if (mostrarPost != '') {
            obtenerComentariosBBDD(setIsLoadingComentarios, setErrorComentarios, setComentarios, mostrarPost.id);
        }
    }, [mostrarPost]);

    const handleAgregarComentario = () => {
        subirComentarioBBDD(comentario, mostrarPost.id).then(() => {
            setModalVisible(false);
            setComentario('');
            obtenerComentariosBBDD(setIsLoadingComentarios, setErrorComentarios, setComentarios, mostrarPost.id);
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            marginTop: 20,
        },
        goBack: {
            position: 'absolute',
            top: 0,
            left: 25,
            zIndex: 1,
        },
        titulo: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 14,
        },
        info: {
            color: 'gray',
            marginBottom: 8,
        },
        descripcion: {
            marginBottom: 8,
        },
        imagen: {
            width: 300,
            height: 200,
            marginBottom: 20,
        },
        comentarioTitulo: {
            marginBottom: 8,
            alignSelf: 'flex-start',
            left: 10,
        },
        modalContainer: {
            width: windowWidth * 0.8,
            maxHeight: windowHeight * 0.6,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -(windowWidth * 0.4) }, { translateY: -(windowHeight * 0.2) }],
            borderWidth: 3,
            borderColor: '#ccc',
        },
        modalTitulo: {
            fontSize: 17,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        comentarioInput: {
            width: '80%',
            height: 100,
            borderWidth: 1,
            borderColor: 'gray',
            marginBottom: 20,
            padding: 10,
        },
        boton_enviar: {
            borderRadius: 20,
            width: 100,
            height: 40,
            backgroundColor: '#a4ccbd',
            color: 'black',
            marginTop: 20,
            justifyContent: 'center',
        },

        boton_cancelar: {
            borderRadius: 20,
            width: 100,
            height: 40,
            backgroundColor: '#e0e0e0',
            color: 'black',
            marginTop: 10,
            justifyContent: 'center',
        },
        botonText: {
            color: 'black',
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
        }
    });
    return (
        <ScrollView>
            {mostrarPost === '' ? (
                <RenderPost posts={posts} isLoading={isLoading} errMess={error} setMostrarPost={setMostrarPost} />
            ) : (
                <View style={styles.container}>
                    <View style={styles.goBack}>
                        <Icon
                            name="arrow-left"
                            type="font-awesome"
                            size={24}
                            onPress={() => setMostrarPost('')}
                        />
                    </View>
                    <Card>
                        <Text style={styles.titulo}>{mostrarPost.titulo}</Text>
                        <Text style={styles.info}>{mostrarPost.user} - {mostrarPost.fecha}</Text>
                        <Text style={styles.descripcion}>{mostrarPost.descripcion}</Text>
                        <Image source={{ uri: mostrarPost.img }} style={styles.imagen} />
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Icon
                                name="comment"
                                type="font-awesome"
                                size={24}
                            />
                        </TouchableOpacity>
                    </Card>
                    <Card.Divider></Card.Divider>
                    <Text style={styles.comentarioTitulo}>Comentarios: </Text>


                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitulo}>Añadir comentario</Text>
                            <TextInput
                                style={styles.comentarioInput}
                                value={comentario}
                                onChangeText={text => setComentario(text)}
                                placeholder="Escribe tu comentario aquí"
                                multiline={true}
                            />
                            <TouchableOpacity style={styles.boton_enviar} onPress={handleAgregarComentario}>
                                <Text style={styles.botonText}>Añadir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.boton_cancelar} onPress={() => setModalVisible(false)}>
                                <Text style={styles.botonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <RenderComentarios comentarios={comentarios} isLoading={isLoadingComentarios} errMess={errorComentarios} />
                </View>
            )}
        </ScrollView>
    );

};

export default Home;