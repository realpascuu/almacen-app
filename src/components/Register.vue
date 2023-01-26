<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <Form @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div class="form-group">
            <label for="email">Email</label>
            <Field v-model="email" name="email" type="email" class="form-control" @keyup.enter="handleRegister" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
           <div class="form-group">
            <label for="password">Password</label>
            <Field v-model="password" name="password" type="password" class="form-control" @keyup.enter="handleRegister"/>
            <ErrorMessage name="password" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <Field v-model="nombre" name="nombre" class="form-control"  @keyup.enter="handleRegister"/>
            <ErrorMessage name="nombre" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="apellidos">Apellidos</label>
            <Field v-model="apellidos" name="apellidos" class="form-control"  @keyup.enter="handleRegister"/>
            <ErrorMessage name="apellidos" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="address">Dirección</label>
            <Field v-model="address" name="address" class="form-control"  @keyup.enter="handleRegister"/>
            <ErrorMessage name="address" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="cp">CP</label>
            <Field v-model="cp" name="cp" class="form-control"  @keyup.enter="handleRegister"/>
            <ErrorMessage name="cp" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <Field v-model="telefono" name="telefono" class="form-control"  @keyup.enter="handleRegister"/>
            <ErrorMessage name="telefono" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="dni">DNI</label>
            <Field v-model="dni" name="dni" class="form-control"  @keyup.enter="handleRegister"/>
            <ErrorMessage name="dni" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="fechanac">Fecha de nacimiento</label>
            <Field v-model="fechanac" type="date" name="fechanac" class="form-control"  @keyup.enter="handleRegister"/>
            <ErrorMessage name="fechanac" class="error-feedback" />
          </div>
          <div class="form-group">
            <div class="form-group" style="padding-bot:10px;padding-top:20px;text-align:center">
          <v-btn elevation="6" rounded @click="handleRegister" @keyup.enter="handleRegister">      
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Registrarse</span>
          </v-btn>
        </div>
          </div>
        </div>
      </Form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import {  Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from '../stores/authStore.js'
import { AuthService } from '../services/auth.service';


export default {
  name: "RegisterComponent",
  components: {
    Field,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore()
    return {store}
  },
  data() {
    const schema = yup.object().shape({
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),
      address: yup
        .string()
        .required("Direccion is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      nombre: yup
        .string()
        .required("Nombre is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      apellidos: yup
        .string()
        .required("Apellidos is required!")
        .min(3, "Must be at least 3 characters!")
        .max(40, "Must be maximum 40 characters!"),
      dni: yup
        .string()
        .required("Dni is required!")
        .min(3, "Must be at least 3 characters!")
        .max(9, "Must be maximum 9 characters!"),
      telefono: yup
        .string()
        .required("Dni is required!")
        .min(9, "Must be at least 9 characters!")
        .max(9, "Must be maximum 10 characters!"),
      cp: yup
        .string()
        .required("Dni is required!")
        .min(5, "Must be at least 5 characters!")
        .max(9, "Must be maximum 5 characters!"),
      fechanac: yup
        .date()
        .required("Fecha nacimiento is required!")
        
    });

    return {
      successful: false,
      loading: false,
      message: "",
      fechanac: Date.now(),
      schema,
      username: "",
      password: "",
      address: "",
      email: "",
      cp: "",
      telefono: "",
      dni: "",
      nombre: "",
      apellidos: "",
    };
  },
  computed: {
    loggedIn() {
      return this.store.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/productos");
    }
  },
  methods: {
    async handleRegister() {
      this.message = "";
      this.successful = false;
      this.loading = true;

      var user = {
        email: this.email,
        password: this.password,
        nombre: this.nombre,
        apellidos: this.apellidos,
        dni: this.dni,
        telefono: this.telefono,
        calle: this.address,
        codpos: this.cp,
        fechanac: this.fechanac
      }

      try {
        let authService = new AuthService();
        let response = await authService.register(user);
        this.message = response;
        this.loading = false;
        if(response) {
          this.$swal({ icons: 'success', title: '¡Registro completado!'});
          this.successful = true;
          this.$router.push("/login");
          return;
        } else {
          this.$swal({ icons: 'error', title: 'Fallos en el registro. Compruebe los datos.'});
        }
      } 
      catch(error) {
        this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        this.successful = false;
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
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

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.error-feedback {
  color: red;
}
</style>
