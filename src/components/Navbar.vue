<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <i class="fas fa-tshirt"></i>
        <span>TOKO BAJU DELA</span>
      </div>
      <ul class="navbar-menu">
        <li><router-link to="/">Beranda</router-link></li>
        <li><router-link to="/laporan">Laporan</router-link></li>
        <li><router-link to="/databaju">Data Baju</router-link></li>
        <li><router-link to="/order">Order</router-link></li>
        <li><router-link to="/pelanggan">Pelanggan</router-link></li>
        
        <!-- Login / Logout conditional -->
        <li v-if="!auth.isLoggedIn">
          <router-link to="/login">Login</router-link>
        </li>
        <li v-else>
          <button @click="handleLogout" class="logout-button">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { onMounted } from 'vue'
import '../css/navbar.css';

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  auth.checkLoginStatus()
})

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>
