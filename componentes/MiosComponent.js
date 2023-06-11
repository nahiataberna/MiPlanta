import React, { useEffect, useState } from 'react';
import { Text, ScrollView, View, Modal, TextInput } from 'react-native';
import { Card, Image } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    RenderPost,
    RenderComentarios,
    obtenerPostsMiosBBDD,
    obtenerComentariosBBDD,
    subirComentarioBBDD,
    guardarPostBBDD,
    eliminarPostGuardadoBBDD,
    comprobarPostGuardado,
    stylesHomeGuardados
} from './funcionesPosts';


function Mios(props) {
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

    useEffect(() => {
        obtenerPostsMiosBBDD(setIsLoading, setError, setPosts);
    }, []);


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
    const guardarPost = (idPost) => {
        guardarPostBBDD(idPost, setGuardado);
    };
    const eliminarPost = (idPost) => {
        eliminarPostGuardadoBBDD(idPost, setGuardado);
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

export default Mios;