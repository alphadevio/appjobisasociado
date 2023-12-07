import { StyleSheet, View, Image, Text} from 'react-native';
import React, {useEffect, useState} from 'react'
import { api_service } from '../../../shared/services/api_service';
import { colors } from '../../../shared/config/themes';

const Square_Bubble = props => {
  const [token, setToken] = useState('')
  const api = new api_service()

  useEffect(() => {
    (async () => {
      setToken(await api.getToken())
    })()
  }, [])

  return (
    <View style={styles.container}>
    {props.img === undefined ? (
      <Image style={styles.button} source={{ uri: 'https://64.media.tumblr.com/12d3d28565ced5c3355e81b8d06bf83e/b49a5dcfbc81e0da-01/s400x600/ad256d7d6a399f40ed8d466ef383d24e15d20da8.png'}} />
    ):(
      <Image style={styles.button} source={{ uri: props.img + '?authorization=' + token }} />
    )}
     
      <Text style={styles.nombre}>{props.nombre} {props.apellido}</Text>
      <Text style={styles.desc}>Esta es una gran descripcion</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    width: 150,
    alignItems: 'center',
    margin:3
  },
  button: {
    alignItems: 'center',
    borderRadius: 10,
    width:130,
    height:130
  },  
  nombre: {
    marginTop:7,
    color:'white',
    textAlign:'left',
    width:'85%',
    fontSize:18
  },
  desc: {
    color:'white',
    textAlign:'left',
    width:'85%',
    fontSize:14,
    color:'#adadad'
  }
})

export default Square_Bubble