import { StyleSheet, View, Text, Switch, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState, useContext} from 'react'
import { useSearchParams, useRouter, useNavigation } from 'expo-router';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import { AntDesign } from '@expo/vector-icons'; 

const Config = () => {
  const {theme, updateTheme} = useContext(ThemeContext)
  const [selectedLanguage, setSelectedLanguage] = useState();

  let activeColors = colors[theme.mode]
  const [isEnabled, setIsEnabled] = useState(theme.mode === 'light');
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    updateTheme()
  }

  return(
    <View style={[styles.container, {backgroundColor:activeColors.bg}]}>
    <Text style={{color:activeColors.text, fontSize:20}}>Configuración</Text>
      <View style={styles.info}>
        <View style={{flexDirection:'row'}}>
          <Text style={[styles.opcion, {color:activeColors.text}]}>Modo Claro</Text>
            <Switch
              trackColor={{false: '#767577', true: '#dedede'}}
              thumbColor={isEnabled ? '#cd95bb' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.switch}
            />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.opcion, { color: activeColors.text }]}>Lenguaje</Text>
          <View style={{ height: 53, marginTop: 10, marginBottom: 10, borderRadius: 10, overflow: 'hidden' }}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
              style={{ width: 150, color: activeColors.text, backgroundColor: activeColors.inputs, verticalAlign:'middle' }}
            >
              <Picker.Item label="Español" value="es" />
              <Picker.Item label="English" value="en" />
            </Picker>
          </View>
        </View>

        
      </View>
      <View style={{borderBottomColor:'#383838', borderBottomWidth:1, width:'100%', flexDirection:'row', paddingBottom:13}}>
        <View style={{width:'90%'}}>
          <Text style={[styles.title1, {color:activeColors.text}]}>Hazte premium</Text>
          <Text style={[styles.subtitle1, {color:activeColors.subtext}]}>Precios y ofertas</Text>
        </View>
        <Pressable style={styles.arrow} >
          <AntDesign name="arrowright" size={24} color={activeColors.text} style={{position:'absolute',top: '20%'}}/>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222222',
      padding:10,
    },
    opcion:{
      color:'white',
      fontSize:18,
      flex:8,
      marginTop:7,
      verticalAlign:'middle'
    },
    switch:{
      flex:1,
    },
    info:{
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
})

export default Config