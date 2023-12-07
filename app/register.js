import { StyleSheet, View, Text, Pressable, Animated, Image} from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import Button_Grad from '../components/reusable/buttons/button_gradient';
import Circle_button_gradient from '../components/reusable/buttons/circle_button_gradient';
import Input_with_color_text from '../components/reusable/inputs/input_with_color_text';
import Toast from 'react-native-root-toast';
import { api_service } from '../shared/services/api_service';
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [user, setUser] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contra, setContra] = useState('');

  const [hasGalleryPermit, setHasGalleryPermit] = useState(null);
  const [image, setImage] =useState(null)

  const [showImageField, setShowImageField] = useState(false);
  const fadeAnimation = useState(new Animated.Value(0))[0]; // Animación de desvanecimiento

  const api = new api_service()
  const router = useRouter();

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermit(galleryStatus.status === 'granted')
    })()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1
    })
    
    console.log('IMAGEN: ', result)

    if(!result.canceled){
      setImage(result.assets)
    }
  }

  const shImage = () => {
    if(nombre === '' || user === '' || telefono === '' || correo === '' || contra === ''){
      let toast = Toast.show('Favor de llenar todos los campos.', {
        duration: Toast.durations.LONG,
      });
    } else {
      setShowImageField(true)
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000, // Duración de la animación en milisegundos
        useNativeDriver: false, // Necesario para la propiedad opacity
      }).start(() => {
        setShowImageField(true); // Cambiar el estado después de completar la animación
      });
    }
  }

  const signUp = async () => {
  if(nombre === '' || user === '' || telefono === '' || correo === '' || contra === ''){

  } else {
    //URL.createObjectURL(image)
    const body = {
      id_perfil: 2,
      nombre: nombre,
      apellidos: apellidos,
      telefono: telefono,
      correo: correo,
      contra: contra,
      estatus:1
    }
    try {
      console.log(image)
      let response = await api.signUp(body, image[0]); 
      let decriptado = await api.decrypt(response.message, "")
      if(decriptado.status !== 'ERROR'){
        router.replace('/home')
      }
    } catch (error) {
      console.log("exiton't");
      console.error('Errori:',error);
    }
  }
}

  return(
    <View style={[styles.container, {backgroundColor:activeColors.bg}]}>
      <View style={styles.formulario}>
        {showImageField ? (
          <Animated.View style={{ opacity: fadeAnimation, width: '100%', alignItems:'center', height:'100%' }}>
            <Text style={styles.titulo}>¡Sube una foto tuya!</Text>
              <Pressable onPress={pickImage} style={styles.imageSelector}>
                {image ? (
                  <Image style={styles.user} source={{ uri: image[0].uri }} />
                ) : (
                  <Image
                    style={styles.user}
                    source={require('../assets/blank_user.jpg')}
                  />
                )}
                <View style={styles.mas}>
                  <Circle_button_gradient texto={'+'} />
                </View>
              </Pressable>

              <Pressable onPress={signUp} style={{ position: 'absolute', bottom: 40, width: 300 }}>
                <Button_Grad texto={'Registrarse'} padding={15}/>
              </Pressable>
            
          </Animated.View>
        ) : (
          <>
            <Input_with_color_text texto={'Nombre'} placeholder={'María'} onChangeText={text => setNombre(text)}/>
            <Input_with_color_text texto={'Apellidos'} placeholder={'García Hinojosa'} onChangeText={text => setApellidos(text)}/>
            <Input_with_color_text texto={'Nombre de Usuario'} placeholder={'MariaH_2023'} onChangeText={text => setUser(text)}/>
            <Input_with_color_text texto={'Teléfono'} placeholder={'33 1234 5678'} onChangeText={text => setTelefono(text)}/>
            <Input_with_color_text texto={'Correo'} placeholder={'correo@ejemplo.com'} onChangeText={text => setCorreo(text)}/>
            <Input_with_color_text texto={'Contraseña'} placeholder={'Introduce tu contraseña'} onChangeText={text => setContra(text)} isPassword={true}/>
            <Pressable onPress={shImage}>
                <Button_Grad texto={'Siguiente'} padding={15}/>
            </Pressable>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formulario:{
    width:'90%',
    alignContent:'flex-start',  
  },
  header:{
    flex:1,
  },
  title:{
    fontSize:30,
    color:'white',
    fontWeight:'bold',
    marginBottom:25,
  },
  user: {
    alignSelf: 'center',
    borderRadius: 200,
    height: 170,
    width: 170,
    position: 'absolute',
  },
  mas: {
    position: 'absolute',
    left:140,
    top:120
  },
  imageSelector:{
    height:'20%',
    width:210,
    marginTop:80
  },
  titulo:{
    color:'white', 
    alignItems: 'center', 
    width: '100%', 
    justifyContent:'center', 
    textAlign: 'center',
    marginTop:30,
    fontSize:20
  }
})

export default Register;