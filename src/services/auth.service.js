import axios from 'axios';

const API_URL = 'http://localhost:3000/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        login: user.login,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'register', {
      username: user.username,
      email: user.email,
      password: user.password,
      address: user.address
    });
  }

  editaprod(producto) {
    return axios.put(API_URL + 'productos/' + producto.id, {
      nombre: producto.username,
      precio: producto.email,
      descripcion: producto.password,
    });
  }
}

export default new AuthService();
