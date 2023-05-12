import React, { useEffect, useState } from "react";
import {
    Text,
    View
} from "react-native";
import axios from 'axios';
import MostrarPublicaciones from "./MostrarPublicaciones";

const Publicaciones = () => {

    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
        console.log('Estoy en el useEffect');
        axios.get('https://miplanta-5f179-default-rtdb.europe-west1.firebasedatabase.app/publicaciones.json')
            .then((response) => {
                //console.log(response);
                let arrayRespuesta = [];
                for (let key in response.data) {
                    arrayRespuesta.push({
                        id: key,
                        imagen: response.data[key].imagen,
                        titulo: response.data[key].titulo,
                        user: response.data[key].user
                    })
                }
                setPublicaciones(arrayRespuesta);
                console.log(publicaciones);
            }).catch((error)=>{
                alert('Se ha producido un error');
                console.log(error);
            })
    },[]);

    return (
        <View>
            <MostrarPublicaciones publicaciones={publicaciones} />
        </View>
    );
};

export default Publicaciones;