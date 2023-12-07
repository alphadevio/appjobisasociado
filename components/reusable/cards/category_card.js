import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'; 
import React, {useEffect, useState, useContext} from 'react'
import { useRouter, Link } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '../../../shared/config/themes';
import { ThemeContext } from '../../../shared/config/themeContext';

const Category_card = props => {
  const [favorito, setFavorito] = useState(false);

  const heart = () => {
    setFavorito(!favorito)
    console.log(favorito)
  }

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  return (
    <View style={[styles.container, {backgroundColor:activeColors.card}]}>
      <Link href={{
      pathname:'/servicios',
      params:{
        id:props.id,
        categoria:props.titulo
      }
      }}
      asChild>
        <Pressable style={styles.image_container}>
          <Image
          source={require('../../../assets/horizon.jpg')}
          style={styles.image}
          />
        </Pressable>
      </Link>
      <View style={{width:'100%', flexDirection:'row'}}>
        <View style={styles.textos}>
          <Text style={styles.titulo}>{props.titulo}</Text> 
          <Text style={styles.descripcion}>{props.descripcion}</Text> 
        </View>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    width:'97%',
    alignItems: 'center',
    backgroundColor:'#2e2e2e',
    height:280,
    margin:5,
    borderRadius:10,
    borderColor:'white',
    borderWidth:1
  },
  image:{
    width:'100%',
    height:'100%',
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  image_container:{
    width:'100%',
    height:'75%',
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  textos: {
    width:'85%',
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
    width:'15%',
    marginTop:22
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

export default Category_card