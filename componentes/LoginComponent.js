import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
} from "react-native";

const PantallaLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [isValid, setIsValid] = useState(true);

    const [registro, setRegistro] = useState(false);

    const handleLogin = () => {
        console.log(email);
        console.log(password);
        if (password == '') {
            console.log("no es vallido");
            setIsValid(false);
            return;
        }
        // firebase
        //   .auth()
        //   .signInWithEmailAndPassword(email, password)
        //   .then(() => {
        //     console.log('User logged in successfully!');
        //     // Aquí puedes almacenar los datos de inicio de sesión del usuario
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
    };
    const handleRegistro = () => {
        console.log(email);
        console.log(password);
        console.log(password2);
        if (password == password2) {

        }

    };

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("./imagenes/logo.png")} />
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            <View style={[styles.inputView, !isValid && styles.inputInvalid]}>
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
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Repita contraseña"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}
                            onChangeText={(password2) => setPassword(password2)}
                        />
                    </View> :
                    ""
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
                        <Text onPress={handleRegistro} style={styles.loginText}>REGISTRARSE</Text>
                        :
                        <Text onPress={handleLogin} style={styles.loginText}>LOGIN</Text>
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
    },
    inputView: {
        backgroundColor: "#FFC0CB",
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
        backgroundColor: "#FF1493",
    },
    inputInvalid: {
        backgroundColor: "red",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        borderColor: "red",
    },
});

export default PantallaLogin;
