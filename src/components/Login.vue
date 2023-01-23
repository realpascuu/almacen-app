<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form :validation-schema="schema">
        <div class="form-group">
          <label for="login">Username</label>
          <Field v-model="login" name="login" type="text" class="form-control" @keyup.enter="handleLogin"/>
          <ErrorMessage name="login" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Field v-model="password" name="password" type="password" class="form-control" @keyup.enter="handleLogin"/>
          <ErrorMessage name="password" class="error-feedback" />
        </div>

        <div class="form-group" style="padding-bot:10px;padding-top:20px;text-align:center">
          <v-btn elevation="6" rounded @click="handleLogin" @keyup.enter="handleLogin">      
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Login</span>
          </v-btn>
        </div>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import {  Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from '../stores/authStore.js'


export default {
  name: "LoginComponent",
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
      login: yup.string().required("Username is required!"),
      password: yup.string().required("Password is required!"),
    });

    return {
      loading: false,
      message: "",
      schema,
      login: "",
      password: "",
    };
  },
  computed: {
    loggedIn() {
      return this.store.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/productos");
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;

      var user = {
        login: this.login,
        password: this.password
      }
      //console.log(user)
      try {
        await this.store.login(user)
        this.$router.push("/productos");
      }
      catch (error) {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
      }
    },
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
