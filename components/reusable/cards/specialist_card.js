import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'; 
import React, {useEffect, useState, useContext} from 'react'
import { useRouter, Link } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { api_service } from '../../../shared/services/api_service';
import { colors } from '../../../shared/config/themes';
import { ThemeContext } from '../../../shared/config/themeContext';

const Specialist_card = props => {
  const [token, setToken] = useState('');
  const [service, setService] = useState(null)
  const [imagen, setImagen] = useState(null)
  const api = new api_service()

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    (async () => {
      setToken(await api.getToken())
      if(props.id_servicio !== null){
        console.log(props.id_servicio)
        getService(props.id_servicio)
      }
      
    })()
  }, [])

  const getService = async (id) => {
    try{
      let response = await api.getUsuariosServiciosPorID(id)
      response = JSON.parse(await api.decrypt(response.message, 'private'))
      let response2 = await api.getServiciosPorId(response.result[0].id)
      response2 = JSON.parse(await api.decrypt(response2.message, 'private'))
      setService(response2.result[0].nombre)
      setImagen(response2.result[0].imagen.nombre)
    } catch (error){
      console.error('El error es:',error.message)
    }
  }

  return (
    <View style={[styles.container, {backgroundColor:activeColors.card}]}>
    {token === '' || service === null || imagen === null ? (
      <Text>Esperando...</Text>
    ): (
      <View style={{flexDirection:'row'}}>
        <Image
          source={{ uri: imagen + '?authorization=' + token }}
          style={styles.image}
        />
        <View style={styles.textos}>
          <Text style={[styles.titulo,{color:activeColors.text}]}>{service}</Text> 
          <Text style={[styles.descripcion,{color:activeColors.subtext}]}>Solicitado por {props.nombre_usuario} en {props.ubicacion}</Text> 
        </View>
      </View>
      )}
  </View>
  )
}

const styles = StyleSheet.create({
  container:{
    width:'97%',
    alignItems: 'center',
    height:100,
    margin:5,
    borderRadius:10,
    flexDirection:'row',
    padding:10
  },
  image:{
    width:70,
    height:70,
    borderRadius:4,
    marginTop:13
  },
  image_container:{
    width:'84%',
  },
  textos: {
    width:'80%',
    textAlign:'left',
    padding:10
  },
  titulo:{
    color:'white',
    fontSize:20
  },
  descripcion:{
    color:'white',
  },
  heart_container:{
    alignItems:'center',
    alignContent:'center',
    width:'20%',
    marginTop:29
  },
  mask:{
    width:'100%',
    height:'100%', 
  },
  fondo:{
    width:50,
    height:'100%'
},
})

export default Specialist_card