import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import color1 from '../comun/comun.js';

export default BotonAnadirPost = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <Button
                buttonStyle={styles.button}
                icon={<Icon type="font-awesome" name="plus" size={18} color="white" />}
                iconRight
                onPress={onPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 50,
        backgroundColor: '#a4c7cc',
        width: 50,
        height: 50,
    },
});

