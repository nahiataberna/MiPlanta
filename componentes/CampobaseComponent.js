import React, { Component } from 'react';
import Constants from 'expo-constants';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './HomeComponent';
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
        alert('Lo siento, necesitamos los permisos para enviar una sugerencia.');
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
                component={Home}
                options={{
                    title: 'Inicio',
                }}
            />
        </Stack.Navigator>
    );
}


function DrawerNavegador() {
    async function handleSugerencia() {
        await requestEmailPermission();
        const uri = 'mailto:miplantanahiainigo@gmail.com?subject=Sugerencia%20MiPlanta';
        Linking.openURL(uri);
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
            <Drawer.Screen name="Sugerencias e incidencias" options={{
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name='question'
                        type='font-awesome'
                        size={24}
                        color={tintColor}
                    />
                )
            }}>
                {() => (
                    <TouchableOpacity onPress={handleSugerencia} style={styles.button}>
                        <Text style={styles.buttonText}>Enviar correo electrónico</Text>
                    </TouchableOpacity>
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
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 10,
        alignSelf: 'center',
        marginTop: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Campobase);