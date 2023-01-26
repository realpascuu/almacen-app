<template>
<div id="app">
  <div class="col-md-12">
    <div class="card card-container">
          <div style="text-align:center">
              <h3>Detalles del Producto </h3>
           </div>
           <span class="titulos">Producto: </span>
           <span style="font-size:18px">{{nombre}} </span>

           <span class="titulos">Precio: </span>
           <span style="font-size:18px"> {{pvp}} € </span>
      
           <span class="titulos">Descripción: </span>
           <span style="font-size:18px"> {{especificaciones}} </span>
           <span class="titulos" style="margin-top:20px"> *Agregar cantidad a almacenes: </span>
           <input type="Number" v-model.number="cantidad" class="form-control" style="width:150px"/>
          <div class="form-group">
            <div class="form-group" style="padding-bot:10px;padding-top:20px;text-align:center">
               <v-btn rounded x-small @click="comprar(cantidad)" color="primary">      
                      <span v-show="loading"  class="spinner-border spinner-border-sm"  ></span>
                    <span>Agregar Cantidad</span>
            </v-btn>
              
                <br>
              <v-btn rounded x-small @click="volver" style="margin-top:10px">      
                    <span v-show="loading"  class="spinner-border spinner-border-sm"  ></span>
                  <span>Volver</span>
              </v-btn>
           </div>
        </div>

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
      cod: "",
      nombre: "",
      especificaciones: "",
      pvp:"",
      categoria:"",
      cantidad:"0"
    }
  },
  methods:{

    async getData() {
      //console.log(this.$route.params.id)

         fetch('https://localhost:5001/api/articulos/' + this.$route.params.id).then(response => response.json()).then(response=> {this.nombre = response.nombre;
          this.especificaciones=response.especificaciones;this.pvp=response.pvp;this.cod=response.cod})
    },
     async volver(){
        this.$router.push('/productos');
    },
      async comprar(cantidad){
        console.log(cantidad)
        if(this.cantidad <= 0){
           this.$swal('¡La cantidad tiene que ser un número positivo!')
        }
        else
        this.$swal('Cantidad agregada a los almacenes correctamente')
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