// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Beranda from '../components/beranda.vue'
import DataBaju from '../components/databaju.vue'
import Pelanggan from '../components/pelanggan.vue'
import Order from '../components/order.vue'
import Laporan from '../components/laporan.vue'
import Login from '../components/login.vue'

const routes = [
  {
    path: '/',
    name: 'Beranda',
    component: Beranda
  },
  {
    path: '/databaju',
    name: 'DataBaju',
    component: DataBaju
  },
  {
    path: '/pelanggan',
    name: 'Pelanggan',
    component: Pelanggan
  },
  {
    path: '/order',
    name: 'Order',
    component: Order
  },
  {
    path: '/laporan',
    name: 'Laporan',
    component: Laporan
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
