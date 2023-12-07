import { StyleSheet, View, Text, Pressable, Animated, Image, ScrollView, SafeAreaView, TouchableOpacity, Modal} from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import Button_Grad from '../components/reusable/buttons/button_gradient';
import Input_with_color_text from '../components/reusable/inputs/input_with_color_text';
import Toast from 'react-native-root-toast';
import { api_service } from '../shared/services/api_service';
import * as ImagePicker from 'expo-image-picker'
import { useRouter, useNavigation } from 'expo-router';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; 
import Specialist_card from '../components/reusable/cards/specialist_card';

const Profile = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [user, setUser] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contra, setContra] = useState('');
  const [contra2, setContra2] = useState('');
  const [contraAactual, setContraActual] = useState('')

  const [hasGalleryPermit, setHasGalleryPermit] = useState(null);
  const [image, setImage] =useState(null)
  const [imageEnviable, setImageEnviable] = useState(null)
  const [showModifyButton, setShowModifyButton] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [usuario, setUsuario] = useState()
  const [historial, setHistorial] = useState(null)
  const [modal, setModal] = useState(false)

  const api = new api_service()
  const router = useRouter();
  const navigation = useNavigation()

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    (async () => {
      await loadUser();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermit(galleryStatus.status === 'granted')
    })()

    navigation.setOptions({
      headerRight: () => (
      <View style={{flexDirection:'row'}}>
      
        <View style={{marginTop:6, marginLeft:10}}>
          <Text style={{color:activeColors.text, fontWeight:'bold', fontSize:20, marginRight:210}}>Mi Perfil</Text>
        </View> 
      </View>
      ),
    });
  }, [navigation])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1
    })
    if(!result.canceled){
      setImageEnviable(result.assets[0].uri)
    }
  }

  const mostrarHistorial = () => {
    setShowHistorial(!showHistorial)
  }

  const editUser = async () => {
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const patronTelefono = /^\d{8}$|^\d{10}$/;

    if(!patronCorreo.test(correo)){
      let toast = Toast.show('Favor de ingresar una dirección de correo válida.', {
        duration: Toast.durations.LONG,
      });
      return
    }

    if(!patronTelefono.test(telefono)){
      let toast = Toast.show('Favor de ingresar un número de teléfono válido.', {
        duration: Toast.durations.LONG,
      });
      return
    }
    
    if(nombre === '' || telefono === '' || correo === '' || contra === '' || contra2 === ''){
      let toast = Toast.show('Favor de llenar todos los campos.', {
        duration: Toast.durations.LONG,
      });
    } else {
      if(contra === contra2){
        const body = {
        id: await api.getId(),
        id_perfil: 2,
        nombre: nombre,
        apellidos: apellidos,
        telefono: telefono,
        correo: correo,
        contra: contra,
        estatus:1
        }
        try {
          let response
          if(imageEnviable === image){
            response = await api.editUser(body, imageEnviable, false); 
          } else {
            response = await api.editUser(body, imageEnviable); 
          }
          
          let decriptado = JSON.parse(await api.decrypt(response.message, "private"))
          console.log(decriptado)
          if(decriptado.status ==='OK'){
            let toast = Toast.show('Perfil actualizado con éxito.', {
              duration: Toast.durations.LONG,
            });
          } else {
            let toast = Toast.show('Ocurrió un problema, favor de intentar de nuevo más tarde.', {
              duration: Toast.durations.LONG,
            });
          }
        } catch (error) {
          console.log("exiton't");
          console.error('Errori:',error);
          let toast = Toast.show('Ocurrió un problema, favor de intentar de nuevo más tarde.', {
            duration: Toast.durations.LONG,
          });
        }
      } else {
        let toast = Toast.show('Las contraseñas no son iguales.', {
          duration: Toast.durations.LONG,
        });
      }
    }
  }

  const editPassword = async () => {
    if(contra === '' || contra2 === '' || contraAactual === ''){
      let toast = Toast.show('Todos los campos deben estar llenos.', {
        duration: Toast.durations.LONG,
      });
    } else {
      if(contra === contra2 && contraAactual === usuario.result[0].contra){
        const body = {
        id: await api.getId(),
        id_perfil: 3,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        correo: usuario.correo,
        contra: contra,
        estatus:1
        }
        try {
          let response
          if(imageEnviable === image){
            response = await api.editUser(body, imageEnviable, false); 
          } else {
            response = await api.editUser(body, imageEnviable); 
          }
          
          let decriptado = JSON.parse(await api.decrypt(response.message, "private"))
          if(decriptado.status === 'OK'){
            setShowModifyButton(false)
            let toast = Toast.show('Su contraseña ha sido exitosamente modificado.', {
              duration: Toast.durations.LONG,
            });
            showModal()
          } else {
            let toast = Toast.show('Ocurrió un error. Intente de nuevo o más tarde.', {
              duration: Toast.durations.LONG,
            });
          }
          

        } catch (error) {
          console.log("exiton't");
          console.error('Errori:',error);
          let toast = Toast.show('Ocurrió un problema, favor de intentar de nuevo más tarde.', {
            duration: Toast.durations.LONG,
          });
        }
      } else {
        let toast = Toast.show('Las contraseñas deben ser iguales.', {
          duration: Toast.durations.LONG,
        });
      }
    }
  }

  const loadUser = async () => {
    try {
      let response = await api.getUser()
      let result = await api.decrypt(response.message,"private")
      const parsed = JSON.parse (result)

      setUsuario(parsed)

      setNombre(parsed.result[0].nombre)
      setApellidos(parsed.result[0].apellidos)
      setTelefono(parsed.result[0].telefono)
      setCorreo(parsed.result[0].correo)
      setContra(parsed.result[0].contra)
      setUser(parsed.result[0].user)
      setImage(parsed.result[0].imagen.url + '?authorization=' + await api.getToken())
      setImageEnviable(parsed.result[0].imagen.url + '?authorization=' + await api.getToken())
      
      await getHistorial(parsed)
    } catch (error){
      console.error('El error es:',error.message)
    }
  }

  const getHistorial = async (usuario_activo) => {
    try{
      let response = await api.getHistorial()
      let result = JSON.parse(await api.decrypt(response.message, 'private'))
      let todo_historial = []
      result.result.forEach(element => {
        //if(element.usuarios_servicios.asociado.id === usuario_activo.result[0].id){
          todo_historial.push(element)
        //}
      });
      setHistorial(todo_historial.slice(0, 5))
    } catch (error){
      console.error('El error es:',error.message)
    }
  }

  const showModal = () => {
    setModal(!modal)
  }

  return(
    <View style={[styles.container,{backgroundColor:activeColors.bg}]}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}>
        <Pressable style={styles.modal} onPress={showModal}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent,{backgroundColor:activeColors.bg}]}>
            <Input_with_color_text texto={'Contraseña actual'} placeholder={'Soy una contraseña'} onChangeText={text=>{setContraActual(text)}} isPassword={true} capitalize={'none'}/>
            <Input_with_color_text texto={'Nueva Contraseña'} placeholder={'Soy una contraseña'} onChangeText={text1=>{setContra(text1)}} isPassword={true} capitalize={'none'}/>
            <Input_with_color_text texto={'Confirmar Contraseña'} placeholder={'Soy una contraseña'} onChangeText={text2=>{setContra2(text2)}} isPassword={true} capitalize={'none'}/>
            <Pressable style={{marginBottom:15}} onPress={editPassword}>
              <Button_Grad texto={'Cambiar Contraseña'} padding={15} width={'80%'}/>
            </Pressable>
          </View>
        </View>
        </Pressable>
      </Modal>

      <ScrollView style={{width:'85%'}} nestedScrollEnabled={true}>
        {image ? (
          <Pressable onPress={pickImage}>
            <Image style={styles.user} source={{ uri: imageEnviable }} />
          </Pressable>
        ) : (
          <Pressable onPress={pickImage}>
            <Image
              style={styles.user}
              source={require('../assets/blank_user.jpg')}
            />
          </Pressable>
        )}
        {user === '' ? (
          <View>

          </View>
        ) : (
          <View>
            <View style={styles.info}>
              <View style={{width:'40%'}}>
                <Text style={[styles.title1, {color:activeColors.text}]}>Tus ingresos</Text>
                <Text style={[styles.subtitle1, {color:activeColors.subtext}]}>Saldo actual</Text>
              </View>
              <Text style={{color:activeColors.text, fontSize:20, textAlign:'right', width:'60%', height:'100%', verticalAlign:'middle'}}>$5,254.33</Text>
            </View>
            <Input_with_color_text texto={'Nombre'} placeholder={'María'} onChangeText={text => {setNombre(text); setShowModifyButton(true); }} inputed={nombre}/>
            <Input_with_color_text texto={'Apellidos'} placeholder={'Hinojosa'} onChangeText={text => {setApellidos(text); setShowModifyButton(true); }} inputed={apellidos}/>
            <Input_with_color_text texto={'Teléfono'} placeholder={'33 4712 8899'} onChangeText={text => {setTelefono(text)}} inputed={telefono}/>
            <Input_with_color_text texto={'Correo'} placeholder={'correo@prueba.com'} onChangeText={text => {setCorreo(text); setShowModifyButton(true); }} inputed={correo}/>
            
            <TouchableOpacity style={{width:'100%', alignContent:'flex-start'}} onPress={showModal}>
              <Text style={{textDecorationLine: 'underline',}}>¿Cambiar contraseña?</Text>
            </TouchableOpacity>
          </View>
        )}
        {true && (
          <Pressable style={styles.modifyButtonContainer} onPress={editUser}>
            <Button_Grad texto="Modificar" padding={15}/>
          </Pressable>
        )}
        <View style={[styles.divisor, {backgroundColor:'#383838'}]}></View>
        <SafeAreaView style={styles.historial}>
          <Text style={[{color:activeColors.text, flex:15, fontSize:15}]}>Historial de servicios</Text>
          <TouchableOpacity style={{flex:2}} onPress={mostrarHistorial}>
            {showHistorial ? (
              <MaterialIcons name="keyboard-arrow-down" size={24} color={activeColors.text} />
            ):(
              <MaterialIcons name="keyboard-arrow-right" size={24} color={activeColors.text} />
            )}
          </TouchableOpacity>
        </SafeAreaView>
        {showHistorial && historial !== null ? (
        <SafeAreaView>
          {historial.map((element, index) => (
            <Specialist_card
              key={index}
              img={element.imagen_evidencia}
              nombre={element.usuarios_servicios.servicio.nombre}
              desc={'Servicio dado para ' + element.cliente.nombre + ' ' + element.cliente.apellidos}
            />
          ))}
          <View style={styles.info}>
            <View style={{ width: '90%' }}>
              <Text style={[styles.title1, { color: activeColors.text }]}>
                Tu Historial
              </Text>
              <Text style={[styles.subtitle1, { color: activeColors.subtext }]}>
                Ver todo tu Historial
              </Text>
            </View>
            <Pressable style={styles.arrow}>
              <AntDesign
                name="arrowright"
                size={24}
                color={activeColors.text}
                style={{ position: 'absolute', top: '20%' }}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      ) : (
        <View></View>
      )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  user: {
    alignSelf: 'center',
    borderRadius: 200,
    height: 170,
    width: 170,
  },
  modifyButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom:35
  },
  divisor: {
    marginTop:15,
    marginBottom:15,
    width:'100%',
    height:1
  },
  historial: {
    marginBottom:15,
    flexDirection:'row'
  },
  info:{
    flexDirection:'row',
    marginTop:15,
    marginBottom:15,
    borderBottomColor:'#383838',
    borderBottomWidth:1,
    borderTopColor:'#383838',
    borderTopWidth:1,
    padding:5,
    width:'100%'
  },
  title1: {
    fontSize:18
  },
  title2: {
    fontSize:26,
    marginBottom:7
  },
  subtitle1: {
    fontSize:14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width:'80%',
    padding:15,
    borderRadius: 10,
    elevation: 5,
  },
  modal :{
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex:1,
    width:'100%',
    height:'100%'
  },
})

export default Profile