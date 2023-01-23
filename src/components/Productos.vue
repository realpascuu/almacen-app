<template>
<div id="app">
  <v-snackbar
        v-model="snackbar"
      >
        {{ message }}
  </v-snackbar>


  <div style="padding:10px;" >
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
          </div>
  </div>

  

 <div style="width: 100%; display: table;">
        <div style="display: table-row; height: 100px;">
            <div>
                <div style="padding:10px" v-for="producto,index in listItems.productos" :key="producto.id">
                  <div class="card card-container" >
                    <div class="container">
                      <span style="font-size:18px;font-weight:bold">Producto: </span>
                      <span style="font-size:18px">{{producto.name}} </span>
                      <br>
                      <span style="font-size:18px;font-weight:bold">Precio: </span>
                      <span style="font-size:18px"> {{producto.precio}} € </span>
                      <br>
                    <div align="right">
                      <v-btn rounded x-small @click="verDetalles(producto.id)">      
                        <span
                          v-show="loading"
                          class="spinner-border spinner-border-sm"
                        ></span>
                        <span>Ver detalles</span>
                      </v-btn>

                      <v-btn :loading="loading" class="ma-1" color="error" plain  @click="remove(producto.id,index)" rounded >
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
   <v-btn elevation="6" rounded style="margin-right:10px" v-if="listItems.previousPage" @click="getPage(listItems.previousPage)">      
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Página anterior</span>
          </v-btn>
           
           <v-btn elevation="6" rounded v-if="listItems.nextPage" @click="getPage(listItems.nextPage)" >      
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
import * as yup from "yup";

import { useAuthStore } from '../stores/authStore.js'

export default {
  name: "ProductosComponent",

  data () {
    const schema = yup.object().shape({
      newname: yup.string().required("Campo nombre requerido!"),
      newdesc: yup.string().required("Campo descripción requerido!"),
      newprecio: yup.string().required("Campo precio requerido!"),
    });
    return {
      listItems: [],
      page:"",
      name:"",
      producto: [],
      schema,
      newname:"",
      newdesc:"",
      newprecio:"",
      message:"",
      snackbar:false,
    }
  },
  methods:{
    async getData() {
         fetch('http://localhost:3000/productos', {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.listItems = response})
    },
    async getPage(page) {
      //console.log(page)
        fetch('http://' + page
        , {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.listItems = response})
    },
    async buscar() {
      //console.log(this.name)
        fetch("http://localhost:3000/productos?" + new URLSearchParams({
            nombre: this.name,
           }) , {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.listItems = response})
    },
      async verDetalles(productoId) {
         fetch('http://localhost:3000/productos/' + productoId, {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.producto = response.producto})
    },
    async remove(productoId,index) {
         fetch('http://localhost:3000/productos/' + productoId, {
              method: 'DELETE',
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          })
         this.listItems.productos.splice(index, 1); 

    },
    ocultar(){
      this.producto = ""
    },
    async newProducto(){
      var newProducto = {
        nombre: this.newname,
        precio: this.newprecio,
        descripcion: this.newdesc
      }
       await fetch('http://localhost:3000/productos', {
              method: 'POST',
              headers: {'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.currentUser.token},
              body: JSON.stringify(newProducto)
      }).then(response => response.json()).then(response=> {this.message = response.mensaje})
      this.snackbar = true;
      this.newname = "";
      this.newprecio = "";
      this.newdesc = "";
      this.$refs.form.resetForm();

    }
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