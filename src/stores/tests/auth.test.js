import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth' // Ganti path sesuai lokasi auth.js

describe('Auth Store - Toko Baju Dela', () => {
  // Mock localStorage sebelum setiap test dijalankan
  beforeEach(() => {
    setActivePinia(createPinia())
    global.localStorage = {
      getItem: vi.fn(() => null), // Default return null
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
  })
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('default isLoggedIn harus false', () => {
    const authStore = useAuthStore()
    expect(authStore.isLoggedIn).toBe(false)
  })
  it('login() mengubah isLoggedIn menjadi true', () => {
    const authStore = useAuthStore()
    const dummyCredentials = { email: 'admin@tokobajudela.com', password: 'admin123' }
    authStore.login(dummyCredentials)
    expect(authStore.isLoggedIn).toBe(true)
    expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true')
    expect(localStorage.setItem).toHaveBeenCalledWith('userEmail', dummyCredentials.email)
    expect(localStorage.setItem).toHaveBeenCalledWith('userPassword', dummyCredentials.password)
  })
  it('logout() mengubah isLoggedIn menjadi false', () => {
    const authStore = useAuthStore()
    const dummyCredentials = { email: 'admin@tokobajudela.com', password: 'admin123' }
    authStore.login(dummyCredentials)
    authStore.logout()
    expect(authStore.isLoggedIn).toBe(false)
    expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn')
    expect(localStorage.removeItem).toHaveBeenCalledWith('userEmail')
    expect(localStorage.removeItem).toHaveBeenCalledWith('userPassword')
  })

  it('checkLoginStatus() membaca status login dari localStorage', () => {
    const authStore = useAuthStore()

    // Simulasikan kondisi logged in
    localStorage.getItem.mockReturnValueOnce('true')
    authStore.checkLoginStatus()
    expect(authStore.isLoggedIn).toBe(true)

    // Simulasikan kondisi logged out
    localStorage.getItem.mockReturnValueOnce('false')
    authStore.checkLoginStatus()
    expect(authStore.isLoggedIn).toBe(false)
  })
})
