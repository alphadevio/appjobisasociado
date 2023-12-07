import { StyleSheet, View, Text, Image, Pressable, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import Icon_Bubble from '../components/reusable/images_components/icon_bubble';
import { useRouter, Link, useNavigation, useSearchParams } from 'expo-router';
import { api_service } from '../shared/services/api_service';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import Button_Grad from '../components/reusable/buttons/button_gradient';
import { AntDesign } from '@expo/vector-icons'; 

const Realizar = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [token, setToken] = useState(null);
  const [client, setClient] = useState(null);
  const [service, setService] = useState(null)
  const [img, setImg] = useState(null)

  const {cliente, servicio, direccion, fecha, solicitud} = useSearchParams()

  const router = useRouter();
  const navigation = useNavigation()
  const api = new api_service()

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    (async () => {
      setToken(await api.getToken())
      await getUser()
      await getService(servicio)
    })()

    navigation.setOptions({
      headerBackButtonEnabled:true,
      headerRight: () => (
        <View style={{flexDirection:'row'}}>
      
        <View style={{marginTop:6, marginLeft:10}}>
          <Text style={{color:activeColors.text, fontWeight:'bold', fontSize:20, marginTop:3}}>Realizar Servicio</Text>
        </View> 
        <Pressable onPress={mostrarOpcionesMenu} style={{marginTop:12, marginLeft:90}}>
          <Icon_Bubble/>
        </Pressable>
      </View>
      )
    });
  }, [navigation])

  const getUser = async () => {
    try{
      let response = await api.getUserByID(cliente)
      response = JSON.parse(await api.decrypt(response.message, 'private'))
      setClient(response.result)
    } catch (error){
      console.error('El error es:',error.message)
    }
  }

  const getService = async (id) => {
    try{
      let response = await api.getUsuariosServiciosPorID(id)
      response = JSON.parse(await api.decrypt(response.message, 'private'))
      let response2 = await api.getServiciosPorId(response.result[0].id_servicio)
      response2 = JSON.parse(await api.decrypt(response2.message, 'private'))
      setService(response2.result[0].nombre)
      setImg(response2.result[0].imagen.nombre)
    } catch (error){
      console.error('El error es:',error.message)
    }
  }

  const users = () => {
    setMostrarMenu(false)
    router.push('/profile')
  }

  const config = () => {
    setMostrarMenu(false)
    router.push('/config')
  }

  const mostrarOpcionesMenu = () => {
    setMostrarMenu(true);
  };

  const ocultarOpcionesMenu = () => {
    setMostrarMenu(false);
  };

  const follow = () => {
    router.push('/follow?id='+solicitud)
  }

  const mapa = () => {
    router.push('map');
  };

  return(
    <View style={[styles.container, {backgroundColor:activeColors.bg}]}>

      <Modal visible={mostrarMenu} animationType="none" transparent={true}>
        <TouchableOpacity
          style={styles.modal}
          onPress={ocultarOpcionesMenu}>
          <View style={styles.modalInterior}>
            <TouchableOpacity onPress={config} style={styles.menuOption}>
              <Text style>Configuración</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={users} style={styles.menuOption}>
              <Text>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Cerrar sesión')} style={styles.menuOptionLogOut}>
              <Text>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.detalle}>
        <View style={{width:300, height:300}}>
        {token !== null && img !== null && (
          <Image source={{ uri: img + '?authorization=' + token }} style={[styles.image,{width:300, height:300}]} />
        )}
        
        <View style={styles.imageOverlay}>
          <Text style={[styles.imageText,{color:'white'}]}>{service}</Text>
          <Text style={[styles.imageDesc,{color:'white'}]}>{client !== null ? 'Solicitado por: ' + client[0].nombre + ' ' + client[0].apellidos : 'Esperando'}</Text>
        </View>
      </View>
        
      <View style={styles.info}>
        <View style={{width:'90%'}}>
          <Text style={[styles.title1,{color:activeColors.text}]}>Checar dirección</Text>
          <Text style={[styles.subtitle1,{color:activeColors.subtext}]}>Haga clic para abrir el mapa</Text>
        </View>
        <Pressable style={styles.arrow} onPress={mapa}>
          <AntDesign name="arrowright" size={24} color={activeColors.text} style={{position:'absolute',top: '20%'}}/>
        </Pressable>
      </View>
      <View style={styles.desc}>
        <Text style={[styles.title2,{color:activeColors.text}]}>Descripción</Text>
        <ScrollView style={{height:'37%'}}>
        {img !== null && service !== null && client !== null && (
          <Text style={[styles.subtitle1,{color:activeColors.subtext}]}>
            Servicio de {service} solicitado en {direccion} en la fecha {Date(fecha).toString()} por {client[0].nombre} {client[0].apellidos} {'\n\n'}

            Recibirá a la puerta Monkey D. Luffy y la paga será de $2,346.77 pesos mexicanos
          </Text>
        )}
          <View style={{height:55}}></View>
        </ScrollView>
        <Pressable style={styles.solicitar} onPress={follow}>
          <Button_Grad texto={'Comenzar Servicio'} padding={10} width={'100%'}/>
        </Pressable>
      </View>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    width:'100%'
  },
  modal :{
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex:1,
  },
  modalInterior: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius:20,
    width:'40%',
    margin:10,
    position:'absolute',
    right:10,
    top:50
  },
  menuOption: {
    marginBottom:10
  },
  menuOptionLogOut: {
    marginBottom:10,
    borderTopWidth:1,
    paddingTop:8,
    borderTopColor:'#A9A9A9'
  },
  image:{
    width:300,
    height:300,
    borderRadius:4,
    marginRight:10
  },
  detalle:{
    width:'100%',
    height:'100%',
    alignItems:'center'
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
    width:'90%'
  },
  title1: {
    color:'white',
    fontSize:18
  },
  title2: {
    color:'white',
    fontSize:26,
    marginBottom:7
  },
  subtitle1: {
    fontSize:14,
    color:'#adadad'
  },
  arrow:{
    width:'10%',
    height:'100%'
  },
  desc:{
    width:'90%'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 4,
  },
  imageText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 2,
  },
  imageDesc: {
    color: '#adadad',
    fontSize: 14,
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  solicitar: {
    width:'100%', 
    marginTop:15,
    position:'absolute',
    bottom:10
  },
})

export default Realizar;