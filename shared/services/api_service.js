import * as CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class api_service {
  endpoints = {
    usuarios:'usuarios',
    login:'login', 
    signUp:'signup', 
    registro:'usuariosSinProteccion', 
    categorias: 'categorias',
    servicios:'servicios',
    usuarios_servicios: 'usuarios_servicios',
    calificaciones:'calificaciones',
    historial:'servicios_historial',
    servicios_solicitudes:'servicios_solicitudes',
    servicios_seguimiento:'servicios_seguimiento'
  } //Los distintos endpoints de la api

  id = 0 //Id del usuario activo
  url = "https://apidev.jobis.com.mx/rest/v1/" // La mismisima api

  TOKEN = "token_jobis"; //Token de direccion para guardar la llave del usuario en su local storage

  PUBLIC_KEY = "8Mtg/CCWubYzVCwAedusHFBmMuBFcCwC" //Llave publica usada nomas para el login
  PRIVATE_KEY = "" //Llave privada propia de cada usuario
  secureIV = "2595fc7bf8a8437b" //No se

  //------------------------------------------------LLAMADAS NECESARIAS PARA QUE EL RESTO DE LA API FUNCIONE------------------------------------------------//

  //Sirve para encriptar los datos y enviarlos correctamente a la api
  async encrypt(data, keyP) {
    let key = (keyP === '' ? this.PUBLIC_KEY : await this.getPrivateKey())
    if (key.length != 32) { return ''; }
    let _key = CryptoJS.enc.Utf8.parse(key)
    let _iv = CryptoJS.enc.Utf8.parse(this.secureIV)
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), _key, {
    keySize: 256,iv: _iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7})

    return encrypted.toString();
  }

  //Mismo que lo de arriba pero para desencriptarlos
  async decrypt(data, keyP) {
    this.PRIVATE_KEY = keyP;
    let key = (keyP === '') ? this.PUBLIC_KEY : await this.getPrivateKey();
    if(key.length != 32){return '';}
    let _key = CryptoJS.enc.Utf8.parse(key);
    let _iv = CryptoJS.enc.Utf8.parse(this.secureIV);
    let decrypted = CryptoJS.AES.decrypt(data,_key,
        {keySize:256, iv:_iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7})
        .toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

  async getToken(){
    if(true){
      const token = await AsyncStorage.getItem(this.TOKEN);
      let res = JSON.parse(token || "");
      this.id = res.id
      
      if(res.token) return res.token;
      else return null;
    }
  }

  async getId(){
    if(true){
      const token = await AsyncStorage.getItem(this.TOKEN);
      let res = JSON.parse(token || "");
      this.id = res.id
      if(res.id) return res.id;
      else return null;
    }
  }

  async getPrivateKey(){
    if(true){
      const token = await AsyncStorage.getItem(this.TOKEN);
      let res = JSON.parse(token || "");
      if(res.token) return res.llave;
      else return '';
    }
  }

  //------------------------------------------------FUNCIONES PARA EL LOGIN / SIGNUP / NUEVA CONTRA------------------------------------------------//

  //Funcion para hacer el login de la aplicacion
  async login(body) {
    const encryptedBody = await this.encrypt(body, "");
    return fetch(this.url + this.endpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ text: encryptedBody }), 
    })
    .then(response => response.json())
    .catch(error => {
      console.log(error)
      return null;
    });
  }

  async signUp(body,image) {
    const encryptedBody = await this.encrypt(body, "");

    const formData = new FormData()
    formData.append('image',{uri:image.uri, type:`${image.type}/${image.uri.split('.').pop()}`, name: image.uri.split('/').pop()})
    formData.append('text',encryptedBody)

    return fetch(this.url + this.endpoints.registro, {
      method: 'POST',
      headers: {
        //'Content-Type': 'mutlipart/formdata', 
        //'Authorization':`Bearer ${await this.getToken()}`
      },
      body: formData
    })
    .then(response => response.json())
    .catch( error => {
      console.error("Error en el:",error.message)
    });
  }

  //------------------------------------------------FUNCIONES PARA EL PERFIL------------------------------------------------//

  async getUser() {
    return await fetch(this.url + this.endpoints.usuarios + '?id=' + await this.getId(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getUserByID(id) {
    return await fetch(this.url + this.endpoints.usuarios + '?id=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async editUser(body,image, bandera = true) {
    const encryptedBody = await this.encrypt(body, "private");
    const formData = new FormData()
    if(bandera){
      formData.append('image',{uri:image, type:`image/${image.split('.').pop()}`, name: image.split('/').pop()})
    }
    formData.append('text',encryptedBody)

    return fetch(this.url + this.endpoints.usuarios, {
      method: 'PUT',
      headers: {
        //'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
      body: formData 
    })
    .then(response => response.json())
    .catch( error => {
      console.error("Error en el:", error)
    });
  }

  //------------------------------------------------FUNCIONES PARA LAS CATEGORÍAS------------------------------------------------//

  async getCategories(busc) {
    let busqueda = ""
    if(busc !== ''){
      busqueda = '?where=' + busc
    } 
    return await fetch(this.url + this.endpoints.categorias + busqueda, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  //------------------------------------------------FUNCIONES PARA LOS ASOCIADOS------------------------------------------------//

  async getAsociados() {
    return await fetch(this.url + this.endpoints.usuarios + '?id_perfil=3', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  //------------------------------------------------FUNCIONES PARA LOS SERVICIOS------------------------------------------------//

  async getServiciosPorCategoria(idCategoria) {
    return await fetch(this.url + this.endpoints.servicios + '?id_categoria=' + idCategoria, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getServiciosPorUsuario(idUsuario) {
    return await fetch(this.url + this.endpoints.servicios, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getServiciosAll() {
    return await fetch(this.url + this.endpoints.servicios, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getServiciosPorId(id) {
    return await fetch(this.url + this.endpoints.servicios + '?id=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getUsuariosServiciosPorServicio(idServicio, busc) {
    let busqueda = ""
    if(busc !== ''){
      busqueda = '&where=' + busc
    } 
    return await fetch(this.url + this.endpoints.usuarios_servicios + '?id_servicio=' + idServicio + busqueda, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getUsuariosServiciosPorUsuario(idUsuario) {
    return await fetch(this.url + this.endpoints.usuarios_servicios + '?id_usuario=' + idUsuario , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getUsuariosServiciosPorID(id) {
    return await fetch(this.url + this.endpoints.usuarios_servicios + '?id=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async addUsuarioServicio(idServicio) {
    const body = {id_usuario: await this.getId(), servicios:[idServicio]}
    const encryptedBody = await this.encrypt(body, "private")
    return await fetch(this.url + this.endpoints.usuarios_servicios, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
      body:JSON.stringify({text:encryptedBody})
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async deleteUsuarioServicio(id) {
    const body = {id:id}
    const encryptedBody = await this.encrypt(body, "private")
    return await fetch(this.url + this.endpoints.usuarios_servicios, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
      body:JSON.stringify({text:encryptedBody})
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  //------------------------------------------------FUNCIONES PARA LAS CALIFICACIONES------------------------------------------------//

  async getCalificaciones(idAsociado) {
    return await fetch(this.url + this.endpoints.calificaciones, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response => response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  //------------------------------------------------FUNCIONES PARA EL HISTORIAL------------------------------------------------//

  async getHistorial() {
    return await fetch(this.url + this.endpoints.historial, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response=>response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  //------------------------------------------------FUNCIONES PARA LA SOLICITUD DE SERVICIOS------------------------------------------------//

  async getSolicitudes() {
    return await fetch(this.url + this.endpoints.servicios_solicitudes, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response=>response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getSolicitudesPorIdAsociado(id) {
    return await fetch(this.url + this.endpoints.servicios_solicitudes + '?id_asociado=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response=>response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  //------------------------------------------------FUNCIONES PARA EL SEGUIMIENTO DE SEVICIOS------------------------------------------------//

  async getSeguimiento() {
    return await fetch(this.url + this.endpoints.servicios_seguimiento, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response=>response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async getSeguimientoPorIdAsociado(id) {
    return await fetch(this.url + this.endpoints.servicios_seguimiento + '?id_asociado=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
    })
    .then(response=>response.json())
    .catch( error => {
      console.log('ERROR')
      console.error("Error en el:",error.message)
    });
  }

  async aprobarSolicitud(body){
    const encryptedBody = await this.encrypt(body, 'private')
    return fetch(this.url + this.endpoints.servicios_solicitudes, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
      body: JSON.stringify({ text: encryptedBody }), 
    })
    .then(response => response.json())
    .catch( error => {
      console.error("Error en el:",error.message)
    });
  }

  async addFotosBefore(body, images){
    const encryptedBody = await this.encrypt(body, "private");

    const imageArray = images.map((image, index) => ({
      uri: image.uri,
      type: `${image.type}/${image.uri.split('.').pop()}`,
      name: `image_${index}.${image.uri.split('.').pop()}`,
    }));

    const formData = new FormData()
    formData.append('imagen_fin',imageArray)
    formData.append('text',encryptedBody)
    console.log('BODY:',body)
    console.log('FORMDATA:',formData)
    return fetch(this.url + this.endpoints.registro, {
      method: 'PUT',
      headers: {
        'Content-Type': 'mutlipart/formdata', 
        'Authorization':`Bearer ${await this.getToken()}`
      },
      body: formData
    })
    .then(response => response.json())
    .catch( error => {
      console.error("Error en el:",error.message)
    });
  }

}


