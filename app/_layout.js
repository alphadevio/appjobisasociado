import React, { useEffect, useState} from 'react'
import Icon_Bubble from '../components/reusable/images_components/icon_bubble';
import { StyleSheet, Text, View, Pressable, Image} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons'; 
import { Link, Stack , useRouter, useNavigation} from 'expo-router'
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';

const StackLayout = () => {
  const [searchActivated, setSearchActivated] = useState(false);
  const router = useRouter();

  const users = () => {
    router.push('/profile')
  }

  const [theme, setTheme] = useState({mode:'light'})

  const updateTheme = (newTheme) => {
    let mode;
    if(!newTheme){
      mode = theme.mode === 'dark' ? 'light' : 'dark'
      newTheme = {mode}
    }
    setTheme(newTheme)
  }

  let activeColors = colors[theme.mode]

  return (
    <ThemeContext.Provider value={{theme,updateTheme}}>
    <Stack
      screenOptions={{
        headerStyle:{
          backgroundColor: activeColors.bg,
        },
        headerTintColor: 'white',
        headerTitleStyle:{
          textDecorationLine: 'underline',
          textDecorationStyle:'dashed',
          color:'white',
        }
      }}
    >
    <Stack.Screen name="index" options={{headerTitle:'Login',headerShown:false, headerShadowVisible:false, headerTintColor:activeColors.text}}/>
    <Stack.Screen name="register" options={{headerTitle:'', headerShadowVisible:false, headerTintColor:activeColors.text}}/>
    <Stack.Screen name="home" options={{headerTitle:'', headerBackButtonMenuEnabled:false, headerShadowVisible:false, headerRight: () => (
      <Pressable onPress={users}>
        <Icon_Bubble/>
      </Pressable>
    )}}/>
    <Stack.Screen name="profile" options={{headerTitle:'', headerBackButtonMenuEnabled:true, headerShadowVisible:false, headerTintColor:activeColors.text}}/>
    <Stack.Screen name="config" options={{headerTitle:'', headerBackButtonMenuEnabled:true, headerTintColor:activeColors.text, headerShadowVisible:false}}/>
    <Stack.Screen name="services" options={{headerTitle:'', headerBackButtonMenuEnabled:true, headerTintColor:activeColors.text, headerShadowVisible:false}}/>
    <Stack.Screen name="realizar" options={{headerTitle:'', headerBackButtonMenuEnabled:true, headerTintColor:activeColors.text, headerShadowVisible:false}}/>
    <Stack.Screen name="aprobar" options={{headerTitle:'', headerBackButtonMenuEnabled:true, headerTintColor:activeColors.text, headerShadowVisible:false}}/>
    <Stack.Screen name="map" options={{headerTitle:'', headerBackButtonMenuEnabled:true, headerTintColor:activeColors.text, headerShadowVisible:false}}/>
    <Stack.Screen name="follow" options={{headerTitle:'', headerBackButtonMenuEnabled:false, headerTintColor:activeColors.text, headerShadowVisible:false}}/>
    <Stack.Screen name="photos" options={{headerTitle:'', headerBackButtonMenuEnabled:false, headerTintColor:activeColors.text, headerShadowVisible:false}}/>

    </Stack>
    </ThemeContext.Provider>
  )
}

export default StackLayout