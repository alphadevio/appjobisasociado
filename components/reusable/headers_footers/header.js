import { Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react'
import { useRouter } from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '../../../shared/config/themes';

const Header = props => {
    const router = useRouter();
    return(
        <Pressable style={styles.header} onPress={() => router.back()}>
            <MaskedView
            style={styles.mask}
            maskElement={(
                <View style={styles.container}>
                {props.anterior &&(
                    <View >
                        <Text style={styles.texto}>{' < '}</Text>
                    </View>
                )}
                    <Text style={[styles.texto,{textDecorationLine: 'underline',textDecorationStyle:'dashed',}]}>{props.anteriorTitle}</Text>
                </View>
            )}>
                <LinearGradient
                colors={['#cd95bb', '#9597ae', '#5b99a0']}
                style={styles.fondo}
                start={{ y: 0.1, x: 0.1 }} end={{ y: 0.0, x: 1.0 }}>
                </LinearGradient>
            </MaskedView>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    header:{
        flex:1,
        alignItems:'flex-start',
        justifyContent:'flex-start',
        width:'95%',
        flexDirection:'row',
        marginTop:5
    },
    mask:{
        width:'100%',
        height:40
    },
    texto:{
        fontSize:15,
    },
    fondo:{
        width:'100%',
        height:40
    },
    container:{
        flexDirection:'row',
        width:'100%'
    }
})

export default Header