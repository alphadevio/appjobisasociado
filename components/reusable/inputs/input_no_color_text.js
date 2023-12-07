import { StyleSheet, View,  Text, TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '../../../shared/config/themes';
import { useContext } from 'react';
import { ThemeContext } from '../../../shared/config/themeContext';

const Input_no_color_text = props => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    return (
        <View>
            <TextInput 
            style={styles.input} 
            placeholder={props.placeholder} 
            placeholderTextColor={activeColors.placeholder} 
            onChangeText={props.onChangeText} 
            value={props.inputed} 
            secureTextEntry={props.isPassword}
            autoFocus={props.autofocus || false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height:40,
        width: '100%',
        fontSize:15,
        color:'white',
        padding:5,
        borderColor:'#aaa',
        borderBottomWidth:1,
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

export default Input_no_color_text