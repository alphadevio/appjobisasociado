import { StyleSheet, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react'
import { api_service } from '../../../shared/services/api_service';
import { colors } from '../../../shared/config/themes';

const Icon_Bubble = () => {
    const [image, setImage] =useState(null)
    const api = new api_service()

    useEffect(() => {
        (async () => {
          await loadUser()
        })()
    }, [])

    const loadUser = async () => {
        try {
          let response = await api.getUser()
          let result = await api.decrypt(response.message,"private")
          const parsed = JSON.parse (result)
    
          setImage(parsed.result[0].imagen.url + '?authorization=' + await api.getToken())
          
        } catch (error){
          console.error('El error es:',error.message)
        }
      }

    return (
        <View style={styles.container}>
            {image ? (
            <Image style={styles.button} source={{ uri: image }} />
        ) : (
            <Image
              style={styles.button}
              source={require('../../../assets/blank_user.jpg')}
            />
        )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 50,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        borderRadius: 32,
        width:35,
        height:35
    },
    
})

export default Icon_Bubble