<template>
<div id="app">
 <div style="width: 100%;padding:20px">
 <h4> Buscar movimientos: </h4>
      <div class="select">
        <select v-model="key" id="select" class="form-control" required  @change="buscar()">
        <option v-for="(almacen) in almacenes" 
        :value="almacen.id" :key="almacen.id">
         {{almacen.nombre}}
        </option>
        </select>
      </div>

        <div v-if="listItems?.results?.length > 0">
                <div style="padding:10px" v-for="producto in listItems?.results" :key="producto.id">
                  <div class="card card-container" >
                    <div class="container">
                      <span style="font-size:18px;font-weight:bold"> Id: </span>
                      <span style="font-size:18px">{{producto.id}} </span>
                      <br>
                      <span style="font-size:18px;font-weight:bold"> Almacén Entrada: </span>
                      <span style="font-size:18px">{{producto.almacen_entrada}} </span>
                      <br> 
                      <span style="font-size:18px;font-weight:bold"> Almacén Salida: </span>
                      <span style="font-size:18px">{{producto.almacen_salida}} </span>
                      <br>
                    <div align="right">
                      <v-btn rounded x-small @click="verDetalles(producto.id)">      
                        <span
                          v-show="loading"
                          class="spinner-border spinner-border-sm"
                        ></span>
                        <span>Ver detalles</span>
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
  name: "MovimientosComponent",

  data () {
    return {
      almacenes: [],
      listItems: [],
      page:"",
      name:"",
      key: -1
    }
  },
  methods:{
    async getData() {
      let params = (this.key !== null) ? `?almacen=${this.key}` : '';
      await fetch(`${API_URL}movimientos/page${params}`
      //, { headers: {Authorization: 'Bearer ' + this.currentUser.token}}
        )
        .then(async (response) => {
          if(response.ok) {
            let mov = await response.json();
            this.listItems = mov;
          } else {
            this.listItems = []
          }
        })
    },
    async getPage(page) {
        let params = (this.key !== null) ? `?almacen=${this.key}` : '';
        fetch('${API_URL}movimientos/page?page=' + page + params, {
              headers: {Authorization: 'Bearer ' + this.currentUser.token}
          })
          .then(async (response) => {
          if(response.ok) {
            let mov = await response.json();
            this.listItems = mov;
          } else {
            this.listItems = []
          }
        })
    },
      async verDetalles(movimientoId) {
        this.$router.push('/detallesMovimiento/' + movimientoId);
    },
    async buscar() {
      await fetch(`${API_URL}movimientos/page?almacen=` + this.key)
      .then(async (response) => {
          if(response.ok) {
            let mov = await response.json();
            this.listItems = mov;
          } else {
            this.listItems = []
          }
        })
    },
    async getAlmacenes() {
      await fetch(`${API_URL}almacenes`)
        .then(async (response) => {
          if(response.ok) {
            let almacenes = await response.json();
            this.almacenes = almacenes;
            this.key = (this.almacenes?.results?.length) ? this.almacenes.results[0] : null;
          } else {
            this.almacenes = []
          }
        })
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
     this.getData();
     this.getAlmacenes();
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

.select {
  margin-top: 10px;
  max-width: 150px !important;
}
</style>