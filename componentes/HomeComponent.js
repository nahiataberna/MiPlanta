import React, { Component, useEffect, useState } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card, Image } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { IndicadorActividad } from './IndicadorActividadComponent';

import { db } from '../config/firebase.js';
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";

function RenderItem(props) {

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
                <Card key={index}>
                    <Card.Title style={styles.title}>{post.titulo}</Card.Title>
                    <Card.Divider />
                    <View style={styles.userContainer}>
                        <Text style={styles.user}>{post.user}</Text>

                    </View>
                    <Text style={styles.description}>{post.descripcion}</Text>
                    <Image source={{ uri: post.img }} style={styles.image} />
                    <Text style={styles.date}>{post.fecha}</Text>
                </Card>
            ))
        }
        else {
            return (<View></View>);
        }
    }
};




async function obtenerPostsBBDD(setIsLoading, setError, setPosts, isLoading, posts) {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("fecha", "desc"), limit(20));
    const querySnapshot = await getDocs(q);

    let postsBBDD = [];
    querySnapshot.forEach((doc) => {
        setIsLoading(false);

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
            img: doc.data().img
        });
    });
    setPosts(postsBBDD);
    if (!isLoading && !posts) {
        setError("Ha habido un error");
    }
};

function Home(props) {
    const [posts, setPosts] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        obtenerPostsBBDD(setIsLoading, setError, setPosts, isLoading, posts);
    }, []);
    return (
        <ScrollView>
            <RenderItem posts={posts} isLoading={isLoading} errMess={error} />
        </ScrollView>
    );

};

export default Home;