import { StyleSheet, View, Text, Image, Pressable, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import { api_service } from '../shared/services/api_service';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import Icon_Bubble from '../components/reusable/images_components/icon_bubble';
import { useRouter, Link, useNavigation, useSearchParams } from 'expo-router';

const Map = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const router = useRouter();
  const navigation = useNavigation()
  const api = new api_service()

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    navigation.setOptions({
      headerBackButtonEnabled:true,
      headerRight: () => (
      <View style={{flexDirection:'row'}}>
        <View style={{marginTop:6, marginLeft:10}}>
          <Text style={{color:activeColors.text, fontWeight:'bold', fontSize:20, marginTop:3}}>Mapa</Text>
        </View> 
        <Pressable onPress={mostrarOpcionesMenu} style={{marginTop:12, marginLeft:190}}>
          <Icon_Bubble/>
        </Pressable>
      </View>
      )
    });
  }, [navigation])

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
    router.push('/follow')
  }

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

      <Text>Soy un Mapa!</Text>
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

export default Map