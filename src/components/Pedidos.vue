<template>
<div id="app">
 <div style="padding-top:50px;width: 100%; display: table;">
    <div v-if="listItems?.results?.length">
      <div style="padding:10px" v-for="producto in listItems.results" :key="producto.id">
        <div class="card card-container" >
          <div class="container">
            <span style="font-size:18px;font-weight:bold"> Id: </span>
            <span style="font-size:18px">{{producto.numped}} </span>
            <br>
            <span style="font-size:18px;font-weight:bold"> Operación: </span>
            <span style="font-size:18px">{{producto.venta ? 'Venta' : 'Compra'}} </span>
            <br> 
            <span style="font-size:18px;font-weight:bold"> Fecha de pedido: </span>
            <span style="font-size:18px">{{producto.fecha_pedido}} </span>
            <!--<br>
            <span style="font-size:18px;font-weight:bold">Importe Total: </span>
            <span style="font-size:18px"> {{producto.precio}} € </span>-->
            <br>
            <div align="right">
              <v-btn rounded x-small @click="verDetalles(producto.numped)">      
                <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span>Ver detalles</span>
              </v-btn>

              <v-btn rounded x-small @click="generarFactura(producto.numped)" style="margin-left:10px" color="primary">      
                <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
                ></span>
                <span>Generar Factura</span>
              </v-btn>
            </div>
         </div>
        </div>
      </div>
    </div>
    <div v-if="!listItems?.results?.length" class="h-50 d-flex align-items-center justify-content-center">
      No hay datos disponibles
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

import { useAuthStore } from '../stores/authStore.js'
import {API_URL} from '../main';

export default {
  name: "PedidosComponent",

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
      fetch(`${API_URL}pedidos/page`, {
          headers: {Authorization: 'Bearer ' + this.currentUser.token}
      })
      .then(async (response) => {
        if(!response?.ok) {
          this.listItems = [];  
        } else {
          let items = await response.json(); 
          this.listItems = items;
        }
      })
    },
    async getPage(page) {
      fetch(`${API_URL}pedidos/page?page=` + page, {
        headers: {Authorization: 'Bearer ' + this.currentUser.token}
      })
      .then(async (response) => {
        if(!response?.ok) {
          this.listItems = [];  
        } else {
          let items = await response.json(); 
          this.listItems = items;
        }
      })
    },
      async verDetalles(pedidoId) {
        this.$router.push('/detallesPedido/' + pedidoId);
    },
    async remove(pedidoId,index) {
         fetch(`${API_URL}productos/` + pedidoId, {
              method: 'DELETE',
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          })
         this.listItems.productos.splice(index, 1); 
         this.$swal('Producto eliminado correctamente')
    },
    async generarFactura(pedidoId) {
      console.log('aaa')
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
            this.getData();
          } else {
            this.$swal({
              icon: 'error',
              title: 'Error al generar la factura'
            })
          }
          this.pedido = response.producto
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