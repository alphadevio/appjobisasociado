import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useEffect, useState} from 'react'
import { colors } from '../../../shared/config/themes';

const Button_Grad = props => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#cd95bb', '#9597ae', '#5b99a0']}
                style={[styles.button,{padding:props.padding || 0, width:props.width || '40%'}]}
                start={{ y: 0.1, x: 0.1 }} end={{ y: 0.0, x: 1.0 }}>
                <Text style={styles.textInside}>{props.texto}</Text>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        borderRadius: 5,
    },
    textInside: {
        backgroundColor: 'transparent',
        fontSize: 15,
        color: '#fff',
    },
    
})

export default Button_Grad