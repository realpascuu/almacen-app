<template>
<div id="app">
  <div style="padding:10px;margin-top:10px" >
        <div class="form-group">
          <input style=" width:300px;height:30px" v-model="name" name="name" type="text"
           class="form-control" @keyup.enter="buscar"/>
        </div>
        <div style="margin-top:10px">
          <v-btn elevation="6" rounded @click="buscar(name)" >      
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span >Buscar</span>
            </v-btn>

              <v-btn style="float:right" elevation="6" rounded @click="crearProducto" >      
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span >Crear Producto</span>
            </v-btn>
          </div>
       
  </div>

 <div style="width: 100%; display: table;">
        <div>
          <div style="padding:10px" v-for="producto in listItems.results" :key="producto.cod">
            <div class="card card-container" >
              <div class="d-flex">
                <div class="h- d-flex align-items-center" v-if="producto.imagen !== null && producto.imagen !== '' && producto.imagen.startsWith('data')">
                  <img :src="producto.imagen" width="70">
                </div>
              <div class="container">
                <span style="font-size:18px;font-weight:bold">Producto: </span>
                <span style="font-size:18px">{{producto.nombre}} </span>
                <br>
                <span style="font-size:18px;font-weight:bold">Precio: </span>
                <span style="font-size:18px"> {{producto.pvp}} € </span>
                <br>
                <div align="right">
                <v-btn rounded x-small @click="verDetalles(producto.cod)">      
                  <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span>Ver detalles</span>
                </v-btn>

                <v-btn :loading="loading" class="ma-1" color="error" plain  @click="remove(producto.cod)" rounded >
                Delete
              </v-btn>
            </div>
          </div>
          </div>
      </div>
    </div>
    </div>
  </div>

  <div style="padding:20px">
   <v-btn elevation="6" rounded style="margin-right:10px" v-if="listItems.previousPage != -1" @click="getPage(listItems.previousPage, name)">      
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Página anterior</span>
          </v-btn>
           
           <v-btn elevation="6" rounded v-if="listItems.nextPage != -1" @click="getPage(listItems.nextPage, name)" >      
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span >Página siguiente</span>
          </v-btn>
  </div>
</div>

  
</template>

<script>

import { useAuthStore } from '../stores/authStore.js'
import {API_URL} from '../main';

export default {
  name: "ProductosComponent",

  data () {
    return {
      listItems: [],
      page:"",
      name:"",
      producto: [],
    }
  },
  methods:{
    async getData() {
      //console.log("Pillando data")
         fetch(`${API_URL}articulos/page`, {
          }).then(response => response.json()).then(response=> {this.listItems = response})
    },
    async getPage(page, nombre = null) {
      //console.log(page)
      const queryParams = (nombre) ? { page: page, nombre: nombre } : { page: page };  
      fetch(`${API_URL}articulos/page?` + new URLSearchParams(queryParams))
        .then(response => response.json())
        .then(response=> {this.listItems = response})
    },
    async buscar(nombre) {
      //console.log(this.name)
      const queryParams = (nombre) ? { nombre: nombre } : { };  
        fetch(`${API_URL}articulos/page?` + new URLSearchParams(queryParams) , {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.listItems = response})
    },
      async verDetalles(productoId) {
        this.$router.push('/detallesProducto/' + productoId);
    },
    async remove(productoId) {
      fetch(`${API_URL}articulos/` + productoId, {
          method: 'DELETE',
      })
      await this.buscar('');
    },
    async crearProducto(){
         this.$router.push('/crearProducto');
    },
  },
  setup() {
    const store = useAuthStore()
    return {store}
  },
  computed: {
    currentUser() {
      return this.store.user;
    }
  },
 
  mounted() {
    /**
    if (!this.currentUser) {
          this.$router.push('/login');
        }
      else{
          this.getData()
      }
      */
     this.getData()
 }
      
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 800px !important;
  padding: 10px 10px;
}

.card {
  background-color: #f7f7f7;
  margin: 0 auto 10px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.error-feedback {
  color: red;
}
</style>