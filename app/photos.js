import { StyleSheet, View, Text, Image, Pressable, Modal, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState, useContext} from 'react'
import { useRouter, Link, useNavigation, useSearchParams } from 'expo-router';
import { api_service } from '../shared/services/api_service';
import { colors } from '../shared/config/themes';
import { ThemeContext } from '../shared/config/themeContext';
import * as ImagePicker from 'expo-image-picker';
import Button_Grad from '../components/reusable/buttons/button_gradient';
import Toast from 'react-native-root-toast';

const screenWidth = Dimensions.get('window').width;

const Photos = () => {
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [image6, setImage6] = useState(null);
  const [image7, setImage7] = useState(null);
  const [image8, setImage8] = useState(null);
  const [image9, setImage9] = useState(null);

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]
  const api = new api_service()


  const {id, mode} = useSearchParams()

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      if(result.assets.length > 1) setImage2(result.assets[1])
      if(result.assets.length > 2) setImage3(result.assets[2])
      if(result.assets.length > 3) setImage4(result.assets[3])
      if(result.assets.length > 4) setImage5(result.assets[4])
      if(result.assets.length > 5) setImage6(result.assets[5])
      if(result.assets.length > 6) setImage7(result.assets[6])
      if(result.assets.length > 7) setImage8(result.assets[7])
      if(result.assets.length > 8) setImage9(result.assets[8])
      if(result.assets.length > 9) {
        let toast = Toast.show('No se pueden agregar más de 9 imágenes.', {
          duration: Toast.durations.LONG,
        });
      }
    }
  };

  const sendImages = async () => {
    const body = {
      id: id
    }
    let images = []
    if (image !== null) {images.push(image)}
    if (image2 !== null) {images.push(image2)}
    if (image3 !== null) {images.push(image3)}
    if (image4 !== null) {images.push(image4)}
    if (image5 !== null) {images.push(image5)}
    if (image6 !== null) {images.push(image6)}
    if (image7 !== null) {images.push(image7)}
    if (image8 !== null) {images.push(image8)}
    if (image9 !== null) {images.push(image9)}
    console.log(id)
    try {
    //if(mode === 1){      
      let response = await api.addFotosBefore(body, images); 
    //} else {
      //let response = await api.addFotosBefore(body, images); 
    //}
      let decriptado = await api.decrypt(response.message, "")
      if(decriptado.status !== 'ERROR'){
        console.log('yey')
      }
    } catch (error) {
      console.log("exiton't");
      console.error('Errori:',error);
    }
  }

  return(
    <View style={[styles.container,{backgroundColor:activeColors.bg}]}>
    <View style={{width:'100%', flex:1}}>
      <TouchableOpacity title="Pick an image from camera roll" onPress={pickImage}>
        <Button_Grad texto={'Seleccione una o más imágenes'} padding = {15} width={'90%'}/>
      </TouchableOpacity>
    </View>
    <View style={{width:'100%', flex:6, display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
      {image && <Image source={{ uri: image.uri }} style={styles.imagen} />}
      {image2 && <Image source={{ uri: image2.uri }} style={styles.imagen} />}
      {image3 && <Image source={{ uri: image3.uri }} style={styles.imagen} />}
      {image4 && <Image source={{ uri: image4.uri }} style={styles.imagen} />}
      {image5 && <Image source={{ uri: image5.uri }} style={styles.imagen} />}
      {image6 && <Image source={{ uri: image6.uri }} style={styles.imagen} />}
      {image7 && <Image source={{ uri: image7.uri }} style={styles.imagen} />}
      {image8 && <Image source={{ uri: image8.uri }} style={styles.imagen} />}
      {image9 && <Image source={{ uri: image9.uri }} style={styles.imagen} />}
    </View>
    {image &&
      <TouchableOpacity title="Pick an image from camera roll" onPress={sendImages} style={{position:'absolute', bottom:25, width:'100%'}}>
          <Button_Grad texto={'Enviar fotos'} padding = {15} width={'90%'}/>
      </TouchableOpacity>
    }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    width:'100%'
  },
  imagen: {
    width: screenWidth * 0.31, // Ancho del 33% de la pantalla
    height: screenWidth * 0.42, // Altura igual al ancho
  },
  text:{
    color:'white'
  }
})

export default Photos