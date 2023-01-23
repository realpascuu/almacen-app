<template>
<div id="app">
  <div class="col-md-12">
    <div class="card card-container">
          <div style="text-align:center">
              <h3>Detalles del Producto </h3>
           </div>
           <span class="titulos">Producto: </span>
           <span style="font-size:18px">{{producto.name}} </span>

           <span class="titulos">Precio: </span>
           <span style="font-size:18px"> {{producto.precio}} € </span>
      
           <span class="titulos">Descripción: </span>
           <span style="font-size:18px"> {{producto.descripcion}} </span>
       
          <div class="form-group">
            <div class="form-group" style="padding-bot:10px;padding-top:20px;text-align:center">
         <v-btn rounded x-small @click="volver">      
              <span v-show="loading"  class="spinner-border spinner-border-sm"  ></span>
             <span>Volver</span>
         </v-btn>
           </div>
          </div>
      <br>
    </div>
  </div>

</div>

  
</template>

<script>

import { useAuthStore } from '../stores/authStore.js'

export default {
  name: 'DetallesProductoComponent',
  data () {
 
    return {
      producto: [],
    }
  },
  methods:{

    async getData() {
      //console.log(this.$route.params.id)

         fetch('http://localhost:3000/productos/' + this.$route.params.id, {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.producto = response.producto;this.name = this.producto.name;
          this.desc=this.producto.descripcion;this.precio=this.producto.precio;this.id=this.producto.id})
    },
     async volver(){
        this.$router.push('/productos');
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
    if (!this.currentUser) {
          this.$router.push('/login');
        }
      else{
          this.getData()
      }
 }
      
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 600px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
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

.titulos {
  padding-top:10px;
  font-size:18px;
  font-weight:bold
}
</style>