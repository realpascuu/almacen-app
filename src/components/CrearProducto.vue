<template>
<div id="app">
  <div class="col-md-12">
    <div class="card card-container">
      <Form ref="form" @submit="newProducto" :validation-schema="schema">
          <div style="text-align:center">
              <h3>Creando Producto </h3>
              <h5>Todos los campos son obligatorios </h5>

           </div>
          <div class="form-group" >
            <label for="name">Nombre</label>
            <Field v-model="name" name="name" type="text" class="form-control" />
            <ErrorMessage name="name" class="error-feedback" />
          </div>
           <div class="form-group">
            <label for="precio">Precio</label>
            <Field type="number" v-model="precio" name="precio" class="form-control"/>
            <ErrorMessage name="precio" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="desc">Descripcion</label>
            <Field v-model="desc" name="desc" type="text" class="form-control" />
            <ErrorMessage name="desc" class="error-feedback" />
          </div>
          <div class="select">
                <label for="cat">Categoria</label>
                <select v-model="key" id="select" class="form-control" required >
                <option v-for="(almacen) in categorias.results" 
                :value="almacen.categoria" :key="almacen.categoria">
                {{almacen.categoria}}
                </option>
                </select>
              </div>
          <div class="form-group">
            <div class="form-group" style="padding-bot:10px;padding-top:20px;text-align:center">

              <v-btn elevation="6" rounded type="submit" color="primary">      
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
      </Form>
      <br>
    </div>
  </div>

</div>

  
</template>

<script>
import {Form,Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import { useAuthStore } from '../stores/authStore.js'

export default {
  name: 'CrearProductoComponent',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data () {
    const schema = yup.object().shape({
      name: yup.string().required("Campo nombre requerido!"),
      desc: yup.string().required("Campo descripción requerido!"),
      precio: yup.string().required("Campo precio requerido!"),
    });

    return {
      producto: [],
      successful: false,
      page:"",
      name:"",
      desc:"",
      precio:"",
      id:"",
      schema,
      message: "",
      categorias: [],
      activo: true
    }
  },
  methods:{
      async getData() {
      //console.log(this.$route.params.id)

         fetch('https://localhost:5001/api/articulos/categorias')
         .then(response => response.json()).then(response=> {this.categorias = response;console.log(this.categorias)})
    },

    async newProducto() {
      if(this.activo){
        this.successful = false;
        this.message = "";
        this.activo = false;
          var newProducto = {
            nombre: this.name,
            pvp: this.precio,
            especificaciones: this.desc,
            categoria: this.key,
            imagen: ""
          }
          console.log(newProducto)
        try{
        await fetch('https://localhost:5001/api/articulos/crear', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json'},
                  body: JSON.stringify(newProducto)
              })
              this.$swal("Producto creado correctamente")
              this.$refs.form.resetForm();
              //console.log(this.error)
          }
          catch (error) {
              this.loading = false;
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              this.$swal("Error al crear, problemas con la base de datos")
          }
          finally{
            this.activo = true;
          }
     }
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

.error-feedback {
  color: red;
}

.select {
  margin-top: 10px;
  max-width: 150px !important;
}
</style>