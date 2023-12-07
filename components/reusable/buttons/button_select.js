import { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from '../../../shared/config/themes';
import { ThemeContext } from '../../../shared/config/themeContext';
import { Entypo } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

const Button_Select = props => {
  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  return (
    <View>
      {props.mode === 1 ? (
    <View style={[styles.container, {backgroundColor:activeColors.card}]}>
      <Text style={{flex:10, color:activeColors.text}}>{props.text}</Text>
      <Entypo name="plus" size={24} color={activeColors.text} style={{flex:1}}/>
    </View>
    ) : (
    <View style={[styles.container, {backgroundColor:'#cd95bb'}]}>
      <Text style={{flex:10, color:'white'}}>{props.text}</Text>
      <AntDesign name="check" size={24} color="white" style={{flex:1}} />
    </View>
    )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:12,
    width:'100%',
    borderRadius:10,
    marginBottom:7,
    flexDirection:"row"
  },
})

export default Button_Select