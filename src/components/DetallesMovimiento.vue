<template>
<div id="app">
  <div class="col-md-12">
    <div class="card card-container">
          <div style="text-align:center">
              <h3>Detalles del Movimiento </h3>
           </div>
           <div class="row">
                <div class="column">
                     <span class="titulos"> Id del movimiento: </span>
                     <span style="font-size:18px">{{this.$route.params.id}} </span>
                </div>
                <div class="column" align="right">
                    <span class="titulos"> Almacén de entrada: </span>
                    <span style="font-size:18px">{{almacen_entrada?.nombre}}, </span>
                    <span style="font-size:18px">{{almacen_entrada?.localidad}} </span>
                    <br>
                    <span class="titulos"> Almacén de salida: </span>
                    <span style="font-size:18px">{{almacen_salida?.nombre}}, </span>
                    <span style="font-size:18px">{{almacen_salida?.localidad}} </span>
                </div>
             </div>
             <div v-if="linpeds?.length">
              <span class="titulos">Listado de Productos del Movimiento: </span>
                 <div class="row">
                   <div class="column" align="center">
                        <span class="titulos"> Producto: </span>
                   </div>
                   <div class="column" align="center">
                       <span class="titulos"> Unidades: </span>
                   </div>
                </div>
              <div class="interior-card" style="padding:10px" v-for="producto, index in linpeds" :key="index">
                 <div class="row">
                   <div class="column" align="center">
                        <span style="font-size:18px">{{producto.nombre}} </span>
                   </div>
                   <div class="column" align="center">
                      <span style="font-size:18px">{{producto.cantidad}} </span>
                   </div>
                 </div>
              </div>
            </div>
          <div class="form-group" align="center" style="margin-top:10px">
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
  name: 'DetallesMovimientoComponent',
  data () {
 
    return {
      almacen_entrada: null,
      almacen_salida: null,
      linpeds: []
    }
  },
  methods:{

    async getData() {
      //console.log(this.$route.params.id)
        fetch(`${API_URL}movimientos/` + this.$route.params.id, {
            headers: {Authorization: 'Bearer ' + this.currentUser.token}
        })
        .then(async (response) => {
          if(response.ok) {
            let item = await response.json()
            this.almacen_entrada = item?.almacen_entrada;
            this.almacen_salida = item?.almacen_salida;
            this.linpeds = item?.articulosmovimiento;
          } else {
            this.$swal({
              icon: 'error',
              title: 'Ha ocurrido un error. Volviendo a movimientos...',
              timer: 2000,
              showConfirmButton: false
            })
            .then(() => this.volver());
          }
        })
    },
     async volver(){
        this.$router.push('/movimientos');
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

.column {
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