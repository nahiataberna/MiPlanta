import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { color1, color2, colorError } from "../comun/comun";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

const store = ConfigureStore();

const PantallaLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [emailIsValid, setEmailIsValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [password2Valid, setPassword2Valid] = useState(true);

    const [mensajeError, setMensajeError] = useState('');


    const [registro, setRegistro] = useState(false);

    const  handleLogin = async () => {
        try{

            if (password == '') {
                setPasswordValid(false);
                setMensajeError("Debe rellenar todos los campos");
            }
            if (email == '') {
                setEmailIsValid(false);
                setMensajeError("Debe rellenar todos los campos");
                return;
            }
            else{
                await signInWithEmailAndPassword(auth, email, password);
                await AsyncStorage.setItem('user',email);
                await AsyncStorage.setItem('pass',password);

                const emailasync = await AsyncStorage.getItem('user');
                console.log("Esta funcionando");
                console.log(emailasync);
                console.log(auth);
            }

        }catch(error){
            console.log(error)
        }
    };
    const handleRegistro = async () => {
        if (password == password2) {
            setPassword2Valid(false);
            setMensajeError("Las contraseñas no coinciden");
        }
        if (password == '') {
            setPasswordValid(false);
            setMensajeError("Debe rellenar todos los campos");
        }
        if (password == '') {
            setPassword2Valid(false);
            setMensajeError("Debe rellenar todos los campos");
        }
        if (email == '') {
            setEmailIsValid(false);
            setMensajeError("Debe rellenar todos los campos");
            return;
        }
        else{            
            try {
                await createUserWithEmailAndPassword(auth, email, password);

            } catch (error) {
                console.log(error);
            }
            console.log(auth);
        }

    };

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("./imagenes/logo.png")} />
            <StatusBar style="auto" />
            <View style={[styles.inputView, !emailIsValid && styles.inputInvalid]}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            <View style={[styles.inputView, !passwordValid && styles.inputInvalid]}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Contraseña"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            {
                registro ?
                    <View style={[styles.inputView, !password2Valid && styles.inputInvalid]}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Repita contraseña"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}
                            onChangeText={(password2) => setPassword2(password2)}
                        />
                    </View> :
                    ""
            }
            {
                mensajeError == '' ? "" :
                    <Text style={styles.mensajeError}> {mensajeError}</Text>
            }

            <TouchableOpacity>
                {
                    registro ?
                        <Text onPress={(registro) => setRegistro(false)} style={styles.forgot_button}>Ya tengo cuenta</Text>
                        :
                        <Text onPress={(registro) => setRegistro(true)} style={styles.forgot_button}>Registrarse</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn}>
                {
                    registro ?
                        <Text onPress={() => handleRegistro()} style={styles.loginText}>REGISTRARSE</Text>
                        :
                        <Text onPress={() => handleLogin()} style={styles.loginText}>LOGIN</Text>
                }

            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginBottom: 40,
        width: 220,
        height: 220,
    },
    inputView: {
        backgroundColor: color2,
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
    },
    forgot_button: {
        height: 30,
        marginBottom: 30,
    },
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: color1,
    },
    inputInvalid: {
        backgroundColor: colorError,
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        borderWidth: 3,
        borderColor: "red",
    },
    mensajeError: {
        height: 30,
        marginBottom: 30,
        color: colorError,
    },
});

export default PantallaLogin;