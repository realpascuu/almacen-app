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
                     <span style="font-size:18px">{{pedido.numped}} </span>
                     <br>
                     <span class="titulos"> Fecha de pedido: </span>
                     <span style="font-size:18px">{{pedido.fecha_pedido}} </span>
                </div>
                <div class="column-mitad" align="right">
                    <span class="titulos"> Operación: </span>
                    <span style="font-size:18px">{{pedido.venta ? 'Venta' : 'Compra'}} </span>

                </div>
             </div>
            <div v-if="linpeds?.length">
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
               <div class="interior-card" style="padding:10px" v-for="linped, index in linpeds" :key="index">
                 <div class="row">
                   <div class="column" align="center">
                         <span style="font-size:18px">{{linped.nombre}} </span>
                   </div>
                   <div class="column" align="center">
                       <span style="font-size:18px">{{linped.cantidad}} </span>
                   </div>
                   <div class="column" align="center">
                       <span style="font-size:18px">{{linped.precio}} </span>
                   </div>
                 </div>
   
              </div>
                <div align="center">
                  <span class="titulos">Precio Total: </span>
                  <span style="font-size:18px"> {{precio_total}} € </span>
              </div>
            </div>

          <div class="form-group" align="center" style="margin-top:10px">
                <v-btn rounded x-small @click="generarFactura(pedido.numped)" color="primary">      
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
import {API_URL} from '../main';

export default {
  name: 'DetallesPedidoComponent',
  data () {
 
    return {
      pedido: {},
      linpeds: [],
      precio_total: 0
    }
  },
  methods:{

    async getData() {
      //console.log(this.$route.params.id)
      fetch(`${API_URL}pedidos/` + this.$route.params.id, {
          headers: {Authorization: 'Bearer ' + this.currentUser.token}
      })
      .then(async (response) => {
        if(response.ok) {
          var data = await response.json()
          this.pedido = data.pedido;
          this.linpeds = data.linpeds;
          this.precio_total = this.linpeds?.reduce((acc, e) => {
            return acc + e.cantidad * e.precio;
          }, 0); 
        }
      })
    },
     async volver(){
        this.$router.push('/pedidos');
    },
     async generarFactura(pedidoId){
      fetch(`${API_URL}pedidos/${pedidoId}/generar-factura`, {
            method: 'PUT',
            headers: {Authorization: 'Bearer ' + this.currentUser.token}
        })
        .then((response) => {
          if(response.ok) {
            this.$swal({
              icon: 'success',
              title: 'Factura generada'
            })
            this.$router.push('/facturas');
          } else {
            this.$swal({
              icon: 'error',
              title: 'Error al generar la factura'
            })
          }
        })
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