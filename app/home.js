import { StyleSheet, View, Text, FlatList, RefreshControl, Pressable, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import { useRouter, useNavigation, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons'; 
import Icon_Bubble from '../components/reusable/images_components/icon_bubble';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import Specialist_card from '../components/reusable/cards/specialist_card';
import { api_service } from '../shared/services/api_service';

const Home = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [solicitudes, setSolicitudes] = useState(null)
  const [seguimientos, setSeguimientos] = useState(null)
  const [showRealizar, setShowRealizar] = useState(false)

  const router = useRouter();
  const navigation = useNavigation()

  const api = new api_service()

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    (async () => {
      await getSolicitudes();
      await getSeguimientos()
    })()

    navigation.setOptions({
      headerBackButtonEnabled:false,
      headerRight: () => (
        <View style={{flexDirection:'row'}}>
      
        <View style={{marginTop:6, marginLeft:10}}>
          <Text style={{color:activeColors.text, fontWeight:'bold', fontSize:20, marginTop:3}}>Tu Inicio</Text>
        </View> 
        <Pressable onPress={mostrarOpcionesMenu} style={{marginTop:12, marginLeft:190}}>
          <Icon_Bubble/>
        </Pressable>
      </View>
      )
    });
  }, [navigation])

  const getSolicitudes = async () =>{
    try{
      let response = await api.getSolicitudesPorIdAsociado(await api.getId())
      response = JSON.parse(await api.decrypt(response.message, 'private'))
      let solis = []
      response.result.forEach((element) => {
        if(element.estatus === 1) {
          solis.push(element)
        }
      })
      setSolicitudes(solis)
    } catch (error){
      console.error('El error es:',error.message)
    }
  }

  const getSeguimientos = async () =>{
    try{
      let response = await api.getSeguimientoPorIdAsociado(await api.getId())
      response = JSON.parse(await api.decrypt(response.message, 'private'))
      console.log('SEGUIMIENTOS:',response.result)
      setSeguimientos(response.result)
    } catch (error){
      console.error('El error es:',error.message)
    }
  }

  const services = () => {
    router.push('/services')
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

  return(
    <View style={[styles.container, {backgroundColor:activeColors.bg}]}>
      <StatusBar
      animated={false}
      backgroundColor={'#222222'}
      style="light"
      />

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

      <View style={styles.info}>
        <View style={{width:'90%'}}>
          <Text style={[styles.title1, {color:activeColors.text}]}>Tus servicios</Text>
          <Text style={[styles.subtitle1, {color:activeColors.subtext}]}>Revisa los servicios que ofreces</Text>
        </View>
        <Pressable style={styles.arrow} onPress={services}>
          <AntDesign name="arrowright" size={24} color={activeColors.text} style={{position:'absolute',top: '20%'}}/>
        </Pressable>
      </View>

      {showRealizar ? (
      <View style={styles.header}>
        <Pressable style={styles.buttonSelect} onPress={() => setShowRealizar(false)}>
          <Text style={[styles.menuText,{color:activeColors.text}]}>Solicitados</Text>
        </Pressable>
        <Pressable style={styles.buttonSelect} onPress={() => setShowRealizar(true)}>
          <Text style={[styles.menuText,{color:'#cd95bb'}]}>Por Realizar</Text>
        </Pressable>
      </View>
    ) : (
      <View style={styles.header}> 
        <Pressable style={styles.buttonSelect} onPress={() => setShowRealizar(false)}>
          <Text style={[styles.menuText,{color:'#cd95bb'}]}>Solicitados</Text>
        </Pressable>
        <Pressable style={styles.buttonSelect} onPress={() => setShowRealizar(true)}>
          <Text style={[styles.menuText,{color:activeColors.text}]}>Por Realizar</Text>
        </Pressable>
      </View>
    )}
      

      {showRealizar ? (
        <FlatList
        data={seguimientos}
        style={{height:'5%', flex:1}}
        renderItem={({item}) =>
        <Link href={{
        pathname: '/realizar',
        params: {
          cliente:item.cliente.id,
          servicio:item.usuario_servicio.id,
          direccion:item.ubicacion,
          fecha:item.fecha,
          solicitud:item.id
        }
        }}
        asChild>
          <Pressable>
            <Specialist_card 
            id_solicitud={item.id}
            ubicacion={item.ubicacion}
            fecha={item.fecha}
            id_usuario={item.cliente.id}
            nombre_usuario={item.cliente.nombre + ' ' + item.cliente.apellidos}
            id_usuario_servicio={item.usuario_servicio.id}
            id_servicio={item.usuario_servicio.id_servicio}
            />
          </Pressable>
        </Link>
        }
      />
      ) : (
        <FlatList
        data={solicitudes}
        style={{height:'5%', flex:1}}
        renderItem={({item}) =>
        <Link href={{
        pathname: '/aprobar',
        params: {
          cliente:item.cliente.id,
          servicio:item.usuario_servicio.id,
          direccion:item.ubicacion,
          fecha:item.fecha,
          solicitud:item.id
        }
        }}
        asChild>
          <Pressable>
            <Specialist_card 
            id_solicitud={item.id}
            ubicacion={item.ubicacion}
            fecha={item.fecha}
            id_usuario={item.cliente.id}
            nombre_usuario={item.cliente.nombre + ' ' + item.cliente.apellidos}
            id_usuario_servicio={item.usuario_servicio.id}
            id_servicio={item.usuario_servicio.id_servicio}
            />
          </Pressable>
        </Link>
        }
      />
      )}
      

      
    </View>
  );
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
  separator: {
    height:50,
    justifyContent:'center',
    marginTop:7,
    marginBottom:7,
    padding:5,
    borderRadius:15
  },
  header: {
    flexDirection:'row',
    width:'100%',
    padding:10,
    paddingTop:0,
    borderBottomWidth:1,
    paddingBottom:18,
  },
  menuText:{
    width:'100%',
    textAlign:'center',
    fontSize:18
  },
  buttonSelect:{
    height:26,
    flex:1
  }
})

export default Home;