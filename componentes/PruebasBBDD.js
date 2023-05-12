import { db } from "../config/firebase";
import {
    Text,
    View
} from "react-native";
import { query, getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import MostrarPublicaciones from "./MostrarPublicaciones";

const Prueba = () => {

    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
        async function queryForDocuments () {
            const postsQuery = query(collection(db,'posts'));
            const querySnapshot = await getDocs(postsQuery);
            querySnapshot.forEach((snap) => {
                let arrayRespuesta = [];
                arrayRespuesta.push({
                    id: snap.id,
                    imagen: snap.data().img,
                    titulo: snap.data().titulo,
                    user: snap.data().user,
                    fecha: snap.data().fecha
                })
                setPublicaciones(arrayRespuesta);
                console.log(publicaciones);
            });
        }
        queryForDocuments();
    },[]);

    


    return (
        <View>
            <MostrarPublicaciones publicaciones={publicaciones} />
        </View>
    );
};

export default Prueba;