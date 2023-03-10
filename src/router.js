import { createWebHistory, createRouter } from "vue-router";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
// lazy-loaded
const Productos = () => import("./components/Productos.vue")
const DetallesProducto = () => import("./components/DetallesProducto.vue")
const CrearProducto = () => import("./components/CrearProducto.vue")
const Pedidos = () => import("./components/Pedidos.vue")
const DetallesPedido = () => import("./components/DetallesPedido.vue")
const Facturas = () => import("./components/Facturas.vue")
const DetallesFactura = () => import("./components/DetallesFactura.vue")
const Almacenes = () => import("./components/Almacenes.vue")
const Movimientos = () => import("./components/Movimientos.vue")
const DetallesMovimiento = () => import("./components/DetallesMovimiento.vue")
const CrearMovimiento = () => import("./components/CrearMovimiento.vue")

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/productos",
    name: "productos",
    // lazy-loaded
    component: Productos,
  },
  {
    path: "/detallesProducto/:id",
    name: "detallesProducto",
    // lazy-loaded
    component: DetallesProducto,
  },
  {
    path: "/crearProducto",
    name: "crearProducto",
    // lazy-loaded
    component: CrearProducto,
  },
  {
    path: "/crearMovimiento",
    name: "crearMovimiento",
    // lazy-loaded
    component: CrearMovimiento,
  },
  {
    path: "/pedidos",
    name: "pedidos",
    // lazy-loaded
    component: Pedidos,
  },
  {
    path: "/detallesPedido/:id",
    name: "detallesPedido",
    // lazy-loaded
    component: DetallesPedido,
  },
  {
    path: "/facturas",
    name: "facturas",
    // lazy-loaded
    component: Facturas,
  },
  {
    path: "/detallesFactura/:id",
    name: "detallesFactura",
    // lazy-loaded
    component: DetallesFactura,
  },
  {
    path: "/almacenes",
    name: "almacenes",
    // lazy-loaded
    component: Almacenes,
  },
  {
    path: "/movimientos",
    name: "movimientos",
    // lazy-loaded
    component: Movimientos,
  },
  {
    path: "/detallesMovimiento/:id",
    name: "detallesMovimiento",
    // lazy-loaded
    component: DetallesMovimiento,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;