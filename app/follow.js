import { StyleSheet, View, Text, Image, Pressable, Modal, TouchableOpacity, Alert, Switch } from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import Icon_Bubble from '../components/reusable/images_components/icon_bubble';
import { useRouter, Link, useNavigation, useSearchParams } from 'expo-router';
import { api_service } from '../shared/services/api_service';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import Button_Grad from '../components/reusable/buttons/button_gradient';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import Toast from 'react-native-root-toast';

const Follow = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [token, setToken] = useState(null);
  const [onWay, setOnWay] = useState(false);
  const [arriving, setArriving] = useState(false);
  const [starting, setStarting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const {id} = useSearchParams()

  const router = useRouter();
  const navigation = useNavigation()
  const api = new api_service()

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    (async () => {
      setToken(await api.getToken())
      console.log()
    })()

    navigation.setOptions({
      headerBackButtonEnabled:false,
      headerRight: () => (
        <View style={{flexDirection:'row'}}>
      
        <View style={{marginTop:6, marginLeft:10}}>
          <Text style={{color:activeColors.text, fontWeight:'bold', fontSize:20, marginTop:3}}>Seguimiento del servicio</Text>
        </View> 
        <Pressable onPress={mostrarOpcionesMenu} style={{marginTop:12, marginLeft:20}}>
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

  const mostrarOpcioness = () => {
    setMostrarOpciones(true);
  };

  const ocultarOpciones = () => {
    setMostrarOpciones(false);
  };

  const toggleSwitch1 = () => {
    setOnWay(!onWay)
  }

  const toggleSwitch2 = () => {
    if(onWay){
      setArriving(!arriving)
    } else {
      let toast = Toast.show('Debe primero estar en camino.', {
        duration: Toast.durations.LONG,
      });
    }
  }

  const toggleSwitch3 = () => {
    if(arriving && !starting){
      setStarting(!starting)
      router.push('/photos?mode=1&id=' + id)
    } else if (arriving){
      setStarting(!starting)
    } else {
      let toast = Toast.show('Debe primero haber llegado.', {
        duration: Toast.durations.LONG,
      });
    }
  }

  const toggleSwitch4 = () => {
    if(starting && !finishing){
      setFinishing(!finishing)
      router.push('/photos')
    } else if (starting){
      setFinishing(!finishing)
    } else {
      let toast = Toast.show('Debe primero haber comenzado el servicio.', {
        duration: Toast.durations.LONG,
      });
    }
  }

  const reagendar = () => {
    Alert.alert('Reagendar', '¿Seguro que desea reagendar el servicio?', [
      {text: 'Cancel', onPress: () => setMostrarOpciones(false), style: 'cancel',},
      {text: 'Reagendar', onPress: () => console.log('Reagendar >:D')},
    ]);
  }

  const cancelar = () => {
    Alert.alert('Cancelar', '¿Seguro que desea cancelar el servicio?', [
      {text: 'Cancel', onPress: () => setMostrarOpciones(false), style: 'cancel',},
      {text: 'Confirmar', onPress: () => console.log('Reagendar >:D'), style:{color:'#d63227'}},
    ]);
  }

  const finalizarServicio = () => {
    if(onWay && arriving && starting && finishing){
      let toast = Toast.show('Finalizando Servicio.', {
        duration: Toast.durations.LONG,
      });
    } else {
      let toast = Toast.show('Faltan pasos por cumplir.', {
        duration: Toast.durations.LONG,
      });
    }
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

      <Modal visible={mostrarOpciones} animationType="none" transparent={true}>
        <TouchableOpacity
          style={styles.modal2}
          onPress={ocultarOpciones}>
          <View style={styles.modalInterior2}>
            <TouchableOpacity onPress={reagendar} style={styles.menuOption}>
              <Text style>Reagendar servicio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelar} style={styles.menuOptionLogOut}>
              <Text style={{color:'#d63227'}}>Cancelar servicio</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.detalle}>
        <View style={[styles.seguir,{borderBottomColor:activeColors.subtext}]}>
          <Text style={[styles.texten,{color:activeColors.text}]}>En Camino al Servicio</Text>
          <Switch
          trackColor={{false: '#767577', true: '#dedede'}}
          thumbColor={onWay ? '#cd95bb' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch1}
          value={onWay}
          style={styles.switch}
          />
        </View>

        <View style={[styles.seguir,{borderBottomColor:activeColors.subtext}]}>
          <Text style={[styles.texten,{color:activeColors.text}]}>Llegando al domicilio</Text>
          <Switch
          trackColor={{false: '#767577', true: '#dedede'}}
          thumbColor={arriving ? '#cd95bb' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch2}
          value={arriving}
          style={styles.switch}
          />
        </View>

        <View style={[styles.seguir,{borderBottomColor:activeColors.subtext}]}>
          <View style={{width:'85.2%', flexDirection:'column'}}>
            <Text style={[styles.texten,{color:activeColors.text}]}>Comenzar Servicio</Text>
            <Text style={[styles.texten,{color:activeColors.subtext}]}>Se solicitará evidencia del estado actual.</Text>
          </View>
          <Switch
          trackColor={{false: '#767577', true: '#dedede'}}
          thumbColor={starting ? '#cd95bb' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch3}
          value={starting}
          style={styles.switch}
          />
        </View>

        <View style={[styles.seguir,{borderBottomColor:activeColors.subtext}]}>
          <View style={{width:'85.2%', flexDirection:'column'}}>
            <Text style={[styles.texten,{color:activeColors.text}]}>Finalizar Servicio</Text>
            <Text style={[styles.texten,{color:activeColors.subtext}]}>Se solicitará evidencia de la finalización.</Text>
          </View>
          
          <Switch
          trackColor={{false: '#767577', true: '#dedede'}}
          thumbColor={finishing ? '#cd95bb' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch4}
          value={finishing}
          style={styles.switch}
          />
        </View>

        <View style={[styles.seguir,{borderBottomColor:activeColors.subtext}]}>
          <Text style={[styles.title1,{color:activeColors.text}]}>MAPA</Text>
          <TouchableOpacity onPress={mostrarOpcioness}>
            <Entypo name="dots-three-horizontal" size={24} color={activeColors.text} style={styles.icon}/>
          </TouchableOpacity>
        </View>

        <View style={styles.imageBox}>
          <Image style={styles.imageBox} source={require('../assets/horizon.jpg')}/>
        </View>

      </View>

      <View style={styles.confirmar}>
        <TouchableOpacity onPress={() => finalizarServicio()}>
          <Button_Grad texto={'Finalizar Servicio'} padding={15} width={'100%'}/>
        </TouchableOpacity>
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
  modal2 :{
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
  modalInterior2: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius:20,
    width:'40%',
    margin:10,
    position:'absolute',
    right:5,
    top:323
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
    width:'33.3%',
    maxHeight:'100%'
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
    fontSize:18,
    marginTop:40,
    marginBottom:7,
    flex:10
  },
  icon:{
    marginTop:40,
    flex:1
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
  seguir: {
    flexDirection:'row',
    width:'100%',
    borderBottomWidth:1,
  },
  texten:{
    flex:7,
    verticalAlign:'middle',
    paddingBottom:5, 
  },
  imageBox:{
    width:'100%',
    height:'67%',
    marginTop:10
  },
  confirmar:{
    position:'absolute',
    bottom:20,
    width:'100%',
    right:10,
    left:10
  },
})

export default Follow;