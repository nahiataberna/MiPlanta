import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { baseUrl } from '../comun/comun';
import { connect } from 'react-redux';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
    }
}

function RenderItem(props) {


    const item = props.item;

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
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                color: 'chocolate',
                padding: 10,
                fontSize: 35,
                fontWeight: 'bold',
                textAlign: 'center',
            },
        });

        if (item != null) {
            return (
                <Card>
                    <Card.Divider />
                    <Card.Image source={{ uri: baseUrl + item.imagen }}></Card.Image>
                    <Card.Title style={styles.title}>{item.nombre}</Card.Title>
                    <Text style={{ margin: 20 }}>
                        {item.descripcion}
                    </Text>
                </Card>
            );
        }
        else {
            return (<View></View>);
        }
    }
}

class Home extends Component {
    render() {
        return (
            <ScrollView>
                <RenderItem item={this.props.excursiones.excursiones.filter((excursion) => excursion.destacado)[0]} isLoading={this.props.excursiones.isLoading} errMess={this.props.excursiones.errMess} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);