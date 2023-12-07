import { StyleSheet, View,  Text, TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '../../../shared/config/themes';
import { useContext } from 'react';
import { ThemeContext } from '../../../shared/config/themeContext';

const Input_with_color_text = props => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]

    return (
        <View>
            <MaskedView
                style={styles.mask}
                maskElement={(
                    <Text style={styles.texto}>{props.texto}</Text>
                )}>
                    <LinearGradient
                    colors={['#cd95bb', '#9597ae', '#5b99a0']}
                    style={styles.fondo}
                    start={{ y: 0.1, x: 0.1 }} end={{ y: 0.0, x: 1.0 }}>
                    </LinearGradient>
            </MaskedView>
            <TextInput 
            style={[styles.input,{backgroundColor:activeColors.inputs, color:activeColors.text}]} 
            placeholder={props.placeholder} 
            placeholderTextColor={activeColors.placeholders} 
            onChangeText={props.onChangeText} 
            value={props.inputed} 
            secureTextEntry={props.isPassword} 
            autoCapitalize={props.capitalize}/>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height:40,
        width: '100%',
        fontSize:15,
        color:'white',
        borderRadius:10,
        padding:5,
        borderColor:'white',
        borderWidth:1,
        marginBottom:20
      },
    mask:{
        width:'100%',
        height:40
    },
    texto:{
        fontSize:20,
        fontWeight:'bold'
    },
    fondo:{
        width:'100%',
        height:40
    },
})

export default Input_with_color_text