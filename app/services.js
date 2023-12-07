import { StyleSheet, View, Text, FlatList, RefreshControl, Pressable, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import { Link, useRouter, useNavigation } from 'expo-router';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import { api_service } from '../shared/services/api_service';
import { StatusBar } from 'expo-status-bar';
import Icon_Bubble from '../components/reusable/images_components/icon_bubble';
import Button_Select from '../components/reusable/buttons/button_select';

const Services = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [serviciosCompletos, setServiciosCompletos] = useState(null)
  const [serviciosApagados, setServiciosApagados] = useState(null)
  const [serviciosPrendidos, setServiciosPrendidos] = useState(null)

  const api = new api_service()
  const router = useRouter();
  const navigation = useNavigation()

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    (async () => {
      await setLista()
    })()

    navigation.setOptions({
      headerBackButtonEnabled:true,
      headerRight: () => (
        <View style={{flexDirection:'row'}}>
      
        <View style={{marginTop:6, marginLeft:10}}>
          <Text style={{color:activeColors.text, fontWeight:'bold', fontSize:20, marginTop:3}}>Tus Servicios</Text>
        </View> 
        <Pressable onPress={mostrarOpcionesMenu} style={{marginTop:12, marginLeft:125}}>
          <Icon_Bubble/>
        </Pressable>
      </View>
      )
    });
  }, [navigation])

  const ocultarOpcionesMenu = () => {
    setMostrarMenu(false);
  };

  const mostrarOpcionesMenu = () => {
    setMostrarMenu(true);
  };

  const users = () => {
    setMostrarMenu(false)
    router.push('/profile')
  }

  const config = () => {
    setMostrarMenu(false)
    router.push('/config')
  }

  const setLista = async () => {
    //SE OBTIENEN TODOS LOS SERVICIOS QUE HAY
    let servicios
    try {
      let response = await api.getServiciosPorUsuario()
      response = JSON.parse(await api.decrypt(response.message, "private"))
      servicios = response.result
    } catch (error) {
      console.log("exiton't");
      console.error('Errori:',error);
    }
    //SE OBTIENE EL USUARIO SERVICIO (DICHO SOLO TRAE INFORMACION DEL USUARIO)
    let serviciosActivos
    try {
      let response = await api.getUsuariosServiciosPorUsuario(await api.getId())
      response = JSON.parse(await api.decrypt(response.message, "private"))
      serviciosActivos = response.result
    } catch (error) {
      console.log("exiton't");
      console.error('Errori:',error);
    }
    //SE COMPARAN LOS SERVICIOS CON LOS ID PRESENTES EN USUARIO SERVICIO, Y SE OBTIENE UNA LISTA FINAL A PARTIR DE ESTO
    if(serviciosActivos !== null && servicios !== null){
      let activos = []
      let apagados = servicios
      serviciosActivos.forEach((element) => {
        servicios.forEach((element2) => {
          if(element.id_servicio === element2.id){
            activos.push(element2)
            const index = apagados.indexOf(element2)
            apagados.splice(index,1)
          } 
        })
      })
      setServiciosApagados(apagados)
      setServiciosPrendidos(activos)
      setServiciosCompletos([ ... activos, { separator: true }, ... apagados])
    }
  }

  const addService = async (item) => {
    try{
      console.log(item)
      let response = await api.addUsuarioServicio(item.id)
      response = JSON.parse(await api.decrypt(response.message, "private"))
      console.log('RESPUESTA:',response)
    } catch (error) {
      console.log("exiton't");
      console.error('Errori:',error);
    }

    await setLista()
  }

  const deleteService = async (item) => {
    let serviciosActivos
    try {
      let response = await api.getUsuariosServiciosPorUsuario(await api.getId())
      response = JSON.parse(await api.decrypt(response.message, "private"))
      serviciosActivos = response.result
    } catch (error) {
      console.log("exiton't");
      console.error('Errori:',error);
    }
    let id
    serviciosActivos.forEach((element) => {
      if(element.id_servicio == item.id){
        id = element.id
      }
    })
    try{
      let response = await api.deleteUsuarioServicio(id)
      response = JSON.parse(await api.decrypt(response.message, 'private'))
      console.log('RESPUESTA',response)
    } catch (error) {
      console.log("exiton't");
      console.error('Errori:',error);
    }

    await setLista()
  }

  const renderItem = ({ item }) => {
    if (item.separator) {
      return <View style={{ height: 3, backgroundColor: 'gray' , marginBottom:7}} />
    } else {
      if(item.habilitado === 1){
        if(serviciosApagados.includes(item)){
          return (
            <Pressable onPress={() => addService(item)}>
              <Button_Select text={item.nombre} mode = {1}/>
            </Pressable>
          );
        } else {
          return (
            <Pressable onPress={() => deleteService(item)}>
              <Button_Select text={item.nombre} mode = {0}/>
            </Pressable>
          );
        } 
      } else {
        return <View></View>
      }
    }
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
      {serviciosCompletos === null ? (
        <Text>Esperando...</Text>
      ) : (
        <FlatList
        data={serviciosCompletos}
        style={{width:'100%', height:'85%'}}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      )}
      
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
})

export default Services

