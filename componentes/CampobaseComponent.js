import React, { Component, useState } from 'react';
import Constants from 'expo-constants';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './HomeComponent';
import Guardados from './GuardadosComponent';
import Mios from './MiosComponent';
import { View, StyleSheet, Image, Text, TouchableOpacity, Linking } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorGaztaroaClaro, colorGaztaroaOscuro } from '../comun/comun';
import { connect } from 'react-redux';
import { fetchExcursiones } from '../redux/ActionCreators';
import * as Permissions from 'expo-permissions';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
    }
}
const mapDispatchToProps = dispatch => ({
    fetchExcursiones: () => dispatch(fetchExcursiones()),
})



async function requestEmailPermission() {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    if (status !== 'granted') {
        alert('Lo siento, necesitamos los permisos para enviar una incidencia.');
    }
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={styles.drawerHeader}>
                    <View style={{ flex: 1 }}>
                        <Image source={require('./imagenes/logo.png')} style={styles.drawerImage} />
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.drawerHeaderText}>Mi planta</Text>
                    </View>
                </View>
                <DrawerItemList {...props} />
            </SafeAreaView>
        </DrawerContentScrollView>);
}


function HomeNavegador({ navigation }) {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{
            headerMode: 'screen',
            headerTintColor: '#a4c7cc',
            headerStyle: { backgroundColor: colorGaztaroaOscuro }, headerTitleStyle: { color: '#a4c7cc' },
            headerLeft: () => (<Icon name="menu" size={28} color='#a4c7cc' onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />),
        }} >
            <Stack.Screen
                name="Etxea"
                options={{
                    title: 'Inicio',
                }}
            >
                {(props) => <Home {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
function GuardadosNavegador({ navigation }) {
    const [haEntradoInicio, setHaEntradoInicio] = useState(true);
    return (
        <Stack.Navigator initialRouteName="Guardados" screenOptions={{
            headerMode: 'screen',
            headerTintColor: '#a4c7cc',
            headerStyle: { backgroundColor: colorGaztaroaOscuro }, headerTitleStyle: { color: '#a4c7cc' },
            headerLeft: () => (<Icon name="menu" size={28} color='#a4c7cc' onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />),
        }} >
            <Stack.Screen
                name="Guardado"
                options={{
                    title: 'Guardados',
                }}
                onPress={() => setHaEntradoInicio(true)}
            >
                {(props) => <Guardados {...props} haEntradoInicio={haEntradoInicio} setHaEntradoInicio={setHaEntradoInicio} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
function MiosNavegador({ navigation }) {
    const [haEntradoInicio, setHaEntradoInicio] = useState(true);
    return (
        <Stack.Navigator initialRouteName="Míos" screenOptions={{
            headerMode: 'screen',
            headerTintColor: '#a4c7cc',
            headerStyle: { backgroundColor: colorGaztaroaOscuro }, headerTitleStyle: { color: '#a4c7cc' },
            headerLeft: () => (<Icon name="menu" size={28} color='#a4c7cc' onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />),
        }} >
            <Stack.Screen
                name="Mío"
                options={{
                    title: 'Míos',
                }}
                onPress={() => setHaEntradoInicio(true)}
            >
                {(props) => <Mios {...props} haEntradoInicio={haEntradoInicio} setHaEntradoInicio={setHaEntradoInicio} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}


function DrawerNavegador({props}) {
    async function handleSugerencia() {
        await requestEmailPermission();
        const uri = 'mailto:miplantanahiainigo@gmail.com?subject=Sugerencia%20MiPlanta';
        Linking.openURL(uri);
    }

    function handleLogout(){
        console.log("Estoy en handle Logout");
        props.updateLoginStatus(false);
    }

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: colorGaztaroaClaro,
                },
            }} >
            <Drawer.Screen name="Inicio" component={HomeNavegador} options={{
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name='home'
                        type='font-awesome'
                        size={24}
                        color={tintColor}
                    />
                )
            }} />
            <Drawer.Screen name="Guardados" component={GuardadosNavegador} options={{
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name='bookmark-o'
                        type='font-awesome'
                        size={24}
                        color={tintColor}
                    />
                )
            }} />
            <Drawer.Screen name="Míos" component={MiosNavegador} options={{
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name='user'
                        type='font-awesome'
                        size={24}
                        color={tintColor}
                    />
                )
            }} />
            <Drawer.Screen name="Indicencia" options={{
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name='question'
                        type='font-awesome'
                        size={24}
                        color={tintColor}
                    />
                ),
                headerShown: true,
                headerStyle: { backgroundColor: colorGaztaroaOscuro },
                headerTitleStyle: { color: '#a4c7cc' }
            }}>
                {() => (
                    <View>
                        <Text style={styles.textoIncidencia} > Si desea comunicarse con soporte para consultar una posible incidencia o enviar sugerencias, hágalo a través del correo electrónico.</Text>
                        <TouchableOpacity onPress={handleSugerencia} style={styles.button}>
                            <Text style={styles.buttonText}>Enviar correo electrónico</Text>
                        </TouchableOpacity>
                    </View>

                )}
            </Drawer.Screen>
            <Drawer.Screen name="Log out" options={{
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name='arrow-right'
                        type='font-awesome'
                        size={24}
                        color={tintColor}
                    />
                ),
                headerShown: true,
                headerStyle: { backgroundColor: colorGaztaroaOscuro },
                headerTitleStyle: { color: '#a4c7cc' }
            }}>
                {() => (
                    <View>
                        <Text style={styles.textoIncidencia} > Si desea finalizar sesión pulse el botón. ¡Vuelve pronto!</Text>
                        <TouchableOpacity onPress={handleLogout} style={styles.button}>
                            <Text style={styles.buttonText}>Log out</Text>
                        </TouchableOpacity>
                    </View>

                )}
            </Drawer.Screen>

        </Drawer.Navigator>
    );
}

class Campobase extends Component {

    componentDidMount() {
        this.props.fetchExcursiones();
    }

    render() {
        return (
            <NavigationContainer>
                <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
                    <DrawerNavegador />
                </View>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: '#a4ccbd',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 60
    },
    button: {
        backgroundColor: '#a4ccbd',
        borderRadius: 10,
        padding: 10,
        alignSelf: 'center',
        marginTop: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textoIncidencia: {
        padding: 20,
        alignSelf: 'center',
        marginTop: 50,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Campobase);