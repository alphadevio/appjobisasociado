import { StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, { useState, useContext} from 'react'
import Button_Grad from '../components/reusable/buttons/button_gradient';
import { Link, useRouter } from 'expo-router';
import Input_with_color_text from '../components/reusable/inputs/input_with_color_text';
import { api_service } from '../shared/services/api_service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';

const Login = () =>{
  const [correoTelefono, setCorreoTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');

  const api = new api_service()
  const router = useRouter();

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  const loggear = async () => {
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const patronTelefono = /^\d{8}$|^\d{10}$/;
    if(!patronCorreo.test(correoTelefono) && !patronTelefono.test(correoTelefono)){
      let toast = Toast.show('Favor de ingresar un teléfono o correo válido.', {
        duration: Toast.durations.LONG,
      });
      return
    }
    
    if(correoTelefono === '' || contrasena === ''){
      let toast = Toast.show('Favor de llenar todos los campos.', {
        duration: Toast.durations.LONG,
      });
    } else {
      const body = {
        correo:correoTelefono,
        contra:contrasena
      }
      try {
        let response = await api.login(body); 
        if (response) {
          response = JSON.parse(await api.decrypt(response.message, ''));
          if(response.message === 'login correcto' && response.result.id_perfil !== 3){
            await AsyncStorage.setItem(api.TOKEN, JSON.stringify(response.result)); 
            const token = await AsyncStorage.getItem(api.TOKEN);
            if(token){
              router.replace('/home')
            }
          }else {
            let toast = Toast.show('Usuario o contraseña incorrectos.', {
              duration: Toast.durations.LONG,
            });
          }
        }
      } catch (error) {
        console.log("lao");
        console.error(error);
      }
    }
  }

  return (
    <View style={[styles.formulario, {backgroundColor:activeColors.bg}]}>
      <Image 
      style={styles.logo}
      source={require('../assets/logo.png')}
      />
      <Text style={{width:'100%', textAlign:'center', fontSize:15, marginBottom:20}}>Asociado</Text>

      <Input_with_color_text texto={'Correo o teléfono'} placeholder={'correo@prueba.com'} onChangeText={text => setCorreoTelefono(text)} capitalize={'none'}/>
      <Input_with_color_text texto={'Contraseña'} placeholder={'Introduce tu contraseña'} onChangeText={text => setContrasena(text)} isPassword={true} capitalize={'none'}/>

      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Pressable onPress={loggear} style={{width:400}}>
          <Button_Grad texto={'Ingresar'} padding={15}/>
        </Pressable>
        
        <Link href="/register" asChild>
          <Pressable style={styles.extraContainer}>
            <Text style={styles.extra_buttons}>¿No tienes cuenta? ¡Regístrate!</Text>
          </Pressable>
        </Link>
        
        <Pressable style={styles.extraContainer}>
            <Text style={styles.extra_buttons}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222222',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      marginTop:15,
      padding: 10,
      alignItems: 'center',
      borderRadius: 5,
      width:'40%'
    },
    textInside: {
        backgroundColor: 'transparent',
        fontSize: 15,
        color: '#fff',
    },
    formulario:{
      width:'100%',
      height:'100%',
      padding:50,
    },
    extra_buttons: {
      color:'white',
      fontWeight:'100',
      textDecorationLine: 'underline',
      textDecorationStyle:'dashed',
    },
    extraContainer:{
      marginTop:20
    },
    logo:{
      width:'100%',
      height:'20%',
      marginTop:75
    },
    proveedor:{
      color:'white', 
      alignItems: 'center', 
      width: '100%', 
      justifyContent:'center', 
      textAlign: 'center',
      position:'absolute',
      marginTop:140,
      fontSize:20
    }
  });

export default Login;