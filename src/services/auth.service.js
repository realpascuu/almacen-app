import axios from 'axios';
import API_URL from '../main';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'auth/login', {
        login: user.login,
        password: user.password
      })
      .then(response => {
          localStorage.setItem('user', JSON.stringify(response.data));
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
