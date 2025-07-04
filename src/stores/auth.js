import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userEmail: '',
    userPassword: '',
  }),
  actions: {
    login({ email, password }) {
      // Simpan status login dan data user ke state Toko Baju Dela
      this.isLoggedIn = true
      this.userEmail = email
      this.userPassword = password

      // Simpan status login dan data user ke localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userPassword', password)
    },
    logout() {
      // Hapus data user dari state Toko Baju Dela
      this.isLoggedIn = false
      this.userEmail = ''
      this.userPassword = ''

      // Hapus data login dari localStorage
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userPassword')
    },
    checkLoginStatus() {
      // Cek status login dari localStorage untuk Toko Baju Dela
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      this.userEmail = localStorage.getItem('userEmail')
      this.userPassword = localStorage.getItem('userPassword')
    },
  },
})
