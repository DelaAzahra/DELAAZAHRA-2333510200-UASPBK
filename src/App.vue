<template>
  <div id="app">
    <!-- Hanya tampilkan Navbar jika bukan halaman Login -->
    <Navbar v-if="showNavbar" />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const route = useRoute()

    // Navbar hanya muncul jika bukan halaman login
    const showNavbar = computed(() => route.name !== 'Login')

    return {
      showNavbar
    }
  }
}
</script>

<style>
/* Gaya global misalnya reset atau layout */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}
</style>
