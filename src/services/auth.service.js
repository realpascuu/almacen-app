import axios from 'axios';
import { API_URL } from '../main';

export class AuthService {
  async login(user) {
    return await axios
      .post(API_URL + 'auth/login', {
        email: user.login,
        password: user.password
      })
      .then(response => {
          localStorage.setItem('user', JSON.stringify(response.data));
        return true;
      })
      .catch(error => {
        console.log(error);
        return error?.response?.data;
      })
      ;
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(user) {
    return await axios.post(API_URL + 'users', { ...user })
    .then(() => {
      
      return true;
    })
    .catch(() => {
      return false;
    });
  }

  editaprod(producto) {
    return axios.put(API_URL + 'articulos/' + producto.id, {
      nombre: producto.username,
      precio: producto.email,
      descripcion: producto.password,
    });
  }
}

export default new AuthService();
