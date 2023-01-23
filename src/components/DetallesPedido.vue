<template>
<div id="app">
  <div class="col-md-12">
    <div class="card card-container">
          <div style="text-align:center">
              <h3>Detalles del Pedido </h3>
           </div>
           <div class="row">
                <div class="column-mitad">
                     <span class="titulos"> Id de factura: </span>
                     <span style="font-size:18px">{{pedido.id}} </span>
                     <br>
                     <span class="titulos"> Fecha de factura: </span>
                     <span style="font-size:18px">{{pedido.name}} </span>
                </div>
                <div class="column-mitad" align="right">
                    <span class="titulos"> Operación: </span>
                    <span style="font-size:18px">{{pedido.name}} </span>
                    <br>
                    <span class="titulos"> Almacén: </span>
                    <span style="font-size:18px">{{pedido.name}} </span>
                </div>
             </div>

           <span class="titulos">Listado de Productos del pedido: </span>
              <div class="row">
                <div class="column" align="center">
                     <span class="titulos"> Producto: </span>
                </div>
                <div class="column" align="center">
                    <span class="titulos"> Unidades: </span>
                </div>
                <div class="column" align="center">
                    <span class="titulos"> Precio: </span>
                </div>
             </div>
           <div class="interior-card" style="padding:10px" v-for="producto in pedido" :key="producto.id">
              <div class="row">
                <div class="column" align="center">
                     <span style="font-size:18px">{{producto}} </span>
                </div>
                <div class="column" align="center">
                   <span style="font-size:18px">{{producto}} </span>
                </div>
                <div class="column" align="center">
                   <span style="font-size:18px">{{producto}} </span>
                </div>
              </div>

           </div>
           <div align="center">
             <span class="titulos">Precio Total: </span>
             <span style="font-size:18px"> {{pedido.precio}} </span>
          </div>

          <div class="form-group" align="center" style="margin-top:10px">
                <v-btn rounded x-small @click="generarFactura" color="primary">      
                      <span v-show="loading"  class="spinner-border spinner-border-sm"  ></span>
                    <span>Generar Factura</span>
                </v-btn>
                <br>
                <v-btn rounded x-small @click="volver" color="error" style="margin-top:10px">      
                      <span v-show="loading"  class="spinner-border spinner-border-sm"  ></span>
                    <span>Volver</span>
                </v-btn>
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
      pedido: [],
    }
  },
  methods:{

    async getData() {
      //console.log(this.$route.params.id)

         fetch('http://localhost:3000/productos/' + this.$route.params.id, {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.pedido = response.producto})
    },
     async volver(){
        this.$router.push('/productos');
    },
     async generarFactura(pedidoId){
        fetch('http://localhost:3000/pedidos/' + pedidoId, {
              method: 'POST',
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          }).then(response => response.json()).then(response=> {this.pedido = response.producto})
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
  max-width: 900px !important;
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

.interior-card {
  height: 80px;
  width: 800px !important;
  padding: 40px 40px;
  background-color: #dcdcdc;
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

/* Create three equal columns that floats next to each other */
.column {
  float: left;
  width: 33.33%;
  padding: 10px;
}

.column-mitad {
  float: left;
  width: 50%;
  padding: 10px;
}
/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>