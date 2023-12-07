import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useEffect, useState} from 'react'
import { colors } from '../../../shared/config/themes';

const Circle_button_gradient = props => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#cd95bb', '#9597ae', '#5b99a0']}
                style={styles.button}
                start={{ y: 0.1, x: 0.1 }} end={{ y: 0.0, x: 1.0 }}>
                <Text style={styles.textInside}>{props.texto}</Text>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 50,
        alignItems: 'center',
    },
    button: {
        marginTop:15,
        padding: 10,
        alignItems: 'center',
        borderRadius: 32,
        width:'80%'
    },
    textInside: {
        backgroundColor: 'transparent',
        fontSize: 15,
        color: '#fff',
    },
    
})

export default Circle_button_gradient