<template>
  <Navbar />
  <div class="login-container">
    <h1>TOKO BAJU DELA</h1>
    <h2>Login Admin</h2>

    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email Admin</label>
        <input
          v-model="email"
          type="email"
          id="email"
          required
          placeholder="Masukkan email admin"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          placeholder="Masukkan password admin"
        />
      </div>
      <button type="submit" class="login-btn">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import '../css/login.css';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    const handleLogin = () => {
      // Simpan email dan password yang dimasukkan ke localStorage
      localStorage.setItem('userEmail', email.value);
      localStorage.setItem('userPassword', password.value);

      // Setelah login berhasil, update status login di store dan redirect
      authStore.login({ email: email.value, password: password.value });
      router.push('/');  // Redirect ke home page setelah login
    };

    return {
      email,
      password,
      errorMessage,
      handleLogin,
    };
  },
};
</script>
