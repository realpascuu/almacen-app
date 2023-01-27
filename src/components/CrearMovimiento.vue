<template>
<div id="app">
  <div class="col-md-12">
    <div class="card card-container">
        <div style="text-align:center">
          <h3>Realizar movimiento</h3>
        </div>
        <div class="d-flex align-items-center" style="justify-content: space-between">
          <div class="select">
            <label>Salida</label>
            <select v-model="salida_almacen" id="select" class="form-control" required  @change="loadProductos(1)">
              <option v-for="(almacen) in almacenes" :value="almacen.id" :key="almacen.id">
                {{ almacen.nombre }}
              </option>
            </select>
          </div>
          <div class="select">
            <label>Entrada</label>
            <select v-model="entrada_almacen" id="select" class="form-control" required >
              <option v-for="(almacen) in almacenes" :value="almacen.id" :key="almacen.id">
                {{ almacen.nombre }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="select_product != null" class="d-flex align-items-center my-3" style="justify-content: space-between">
          <button :disabled="cantidad === 0" class="btn btn-dark btn-sm" @click="changeCantidad(-1)">-</button>
          <div>
            {{ cantidad }}
          </div>
          <button :disabled="cantidad === select_product.cantidad" class="btn btn-dark btn-sm" @click="changeCantidad(1)">+</button>
        </div>
        <div v-if="select_product != null" class="d-flex align-items-center my-3" style="justify-content: space-between">
          <button @click="goToProducts()" class="btn btn-danger btn-sm">Volver a productos</button>
        </div>
        <div v-if="productos?.results?.length > 0 && select_product == null">
          <div style="padding:10px" v-for="producto in productos.results" 
          :key="producto.id" class="div-selectable">
            <div class="card card-container" @click.prevent.stop="selectProduct($event, producto.id, producto.cantidad)">
              <div class="container">
                <span style="font-size:18px;font-weight:bold">Articulo: </span>
                <span style="font-size:18px">{{producto.articulo}} </span>
                <br>
                <span style="font-size:18px;font-weight:bold">Cantidad: </span>
                <span style="font-size:18px"> {{producto.cantidad}} </span>
                <br>
              </div>
            </div>
          </div>
          <div style="padding:20px">
           <v-btn elevation="6" rounded style="margin-right:10px" v-if="productos.previousPage" @click="loadProductos(productos.previousPage)">      
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Página anterior</span>
            </v-btn>
            <v-btn elevation="6" rounded v-if="productos.nextPage" @click="loadProductos(productos.nextPage)" >      
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span >Página siguiente</span>
            </v-btn>
          </div>
        <div v-if="!productos?.results?.length" class="h-50 d-flex align-items-center justify-content-center">
          No hay datos disponibles
        </div>
      </div>
        <div class="form-group">
          <div class="form-group" style="padding-bot:10px;padding-top:20px;text-align:center">
            <v-btn elevation="6" rounded type="submit" color="primary" :disabled="cantidad == 0 || entrada_almacen < 1 || salida_almacen < 1"
            @click="createMov()">      
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span>Crear</span>
            </v-btn>
            <v-btn style="margin-left:20px" color="error" rounded x-small @click="volver">      
                <span v-show="loading"  class="spinner-border spinner-border-sm" ></span>
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
import {API_URL} from '../main';

export default {
  name: 'CrearMovimientoComponent',
  components: {
  },
  data () {
    return {
      entrada_almacen: -1,
      salida_almacen: -1,
      almacenes: [],
      productos: [],
      select_product: null,
      cantidad: 0
    }
  },
  methods:{
    async getAlmacenes() {
      await fetch(`${API_URL}almacenes`)
        .then(async (response) => {
          if(response.ok) {
            let almacenes = await response.json();
            this.almacenes = almacenes;
          } else {
            this.almacenes = []
          }
        })
    },
    changeCantidad(num) {
      let new_cantidad = this.cantidad + num;
      if(!(new_cantidad < 0) && !(new_cantidad > this.select_product)) {
        this.cantidad = new_cantidad;
      }
    },
    goToProducts() {
      this.select_product = null;
      this.loadProductos(1);
    },
    selectProduct(event, id, cantidad) {
      this.select_product = { id: id, cantidad: cantidad };
    },
    async loadProductos(page = 1) {
      let almacen = this.almacenes.find(e => e.id === this.salida_almacen);
      if(!almacen) return;
      let nombre = almacen.nombre;
      fetch(`${API_URL}almacenes/${nombre}?nombre=${nombre}&page=${page}&limit=2`)
      .then(async (response) => {
        if(!response.ok) {
          this.productos = [];
        } else {
          let items = await response.json()
          this.productos = items;
          console.log(this.productos);
        }
      })
      .catch((error) => console.log(error))
    },
    async createMov() {
      let response = {
        movimiento: {
          almacen_salida: this.salida_almacen,
          almacen_entrada: this.entrada_almacen
        },
        productos: [
          {
            articulo: this.select_product.id,
            cantidad: this.cantidad
          }
        ] 
      }
      fetch(`${API_URL}movimientos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(response) 
      })
      .then(async (response) => {
        if(!response.ok) {
          this.$swal({
            icon: 'error',
            title: 'Error al realizar movimiento',
            timer: 2000
          })
        } else {
          let result = await response.json()
          if(!result?.length) {
            this.$swal({
              icon: 'success',
              title: '¡Movimiento realizado!',
              text: 'Volviendo a movimientos...',
              timer: 2000
            })
            .then(() => this.volver());
          } else {
            this.$swal({
              icon: 'success',
              text: result?.join('\n'),
              timer: 2000
            })
          }
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
    } else {
      this.getAlmacenes();
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
  max-width: 450px !important;
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

.div-selectable {
  cursor: pointer;
}

.div-selectable:hover {
  box-shadow: 0 0 4px whitesmoke;
  transform: scale(1.1);
}

.div-selectable:active {
  box-shadow: 0 0 5px whitesmoke;
  transform: translateY(1px);
}

.error-feedback {
  color: red;
}

.select {
  margin-top: 10px;
  max-width: 150px !important;
}
</style>