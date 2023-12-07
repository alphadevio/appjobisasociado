import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'; 
import React, {useEffect, useState, useContext} from 'react'
import { useRouter, Link } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '../../../shared/config/themes';
import { ThemeContext } from '../../../shared/config/themeContext';

const Service_card = props => {
  const [favorito, setFavorito] = useState(false);

  const heart = () => {
    setFavorito(!favorito)
    console.log(favorito)
  }

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  return (
    <View style={[styles.container,{backgroundColor:activeColors.card}]}>
      <Link href={{
      pathname:'/servicioDetalle',
      params:{
        nombre:props.titulo,
        id:props.id
      }
      }}
      asChild>
        <Pressable style={styles.image_container}>
          <View style={{flexDirection:'row'}}>
            <Image
            source={require('../../../assets/horizon.jpg')}
            style={styles.image}
            />
            <View style={styles.textos}>
              <Text style={styles.titulo}>{props.titulo}</Text> 
              <Text style={styles.descripcion}>{props.descripcion}</Text> 
            </View>
          </View>
        </Pressable>
      </Link>
        
      <View style={styles.heart_container}>
        <Pressable onPress={heart}>
        {favorito ? (
          <Pressable onPress={heart}>
            <MaskedView
              style={styles.mask}
              maskElement={(
                <AntDesign style={{}} name="heart" size={24} color="white" />
              )}> 
                <LinearGradient
                colors={['#cd95bb', '#9597ae', '#5b99a0']}
                style={styles.fondo}
                start={{ y: 0.1, x: 0.1 }} end={{ y: 0.0, x: 1.0 }}>
                </LinearGradient>
            </MaskedView>
          </Pressable>
        ):(
          <MaskedView
            style={styles.mask}
            maskElement={(
              <AntDesign style={{}} name="hearto" size={24} color="white" />
            )}> 
              <LinearGradient
              colors={['#cd95bb', '#9597ae', '#5b99a0']}
              style={styles.fondo}
              start={{ y: 0.1, x: 0.1 }} end={{ y: 0.0, x: 1.0 }}>
              </LinearGradient>
          </MaskedView>
        )}
      </Pressable>
    </View>
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
    borderRadius:4
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

export default Service_card