import React, { useEffect, useState } from "react";
import {
    Text,
} from "react-native";
import axios from 'axios';

const Prueba = () => {

    const [prueba, setPrueba] = useState([]);

    useEffect(() => {
        console.log('Estoy en el useEffect');
        axios.get('https://miplanta-5f179-default-rtdb.europe-west1.firebasedatabase.app/prueba.json')
            .then((response) => {
                //console.log(response);
                let arrayRespuesta = [];
                for (let key in response.data) {
                    arrayRespuesta.push({
                        id: key,
                        nombre: response.data[key]
                    })
                }
                setPrueba(arrayRespuesta);
                console.log(arrayRespuesta);
            }).catch((error)=>{
                alert('Se ha producido un error');
                console.log(error);
            })
    },[]);

    return (
        <Text>Hola</Text>
    );
};

export default Prueba;