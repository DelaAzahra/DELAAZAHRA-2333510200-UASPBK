<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="header-section">
        <h2 class="page-title">Toko Baju Dela</h2>
        <p class="page-subtitle">Kelola data produk baju dengan mudah dan efisien</p>
      </div>

      <!-- Form Section -->
      <div class="form-section">
        <div class="form-card">
          <h3 class="form-title">{{ isEditing ? 'Edit Data Baju' : 'Tambah Baju Baru' }}</h3>
          <div class="form-grid">
            <div class="input-group">
              <label for="nama">Nama Baju</label>
              <input 
                id="nama"
                v-model="form.nama" 
                placeholder="Masukkan nama baju" 
                class="form-input"
              />
            </div>
            <div class="input-group">
              <label for="ukuran">Ukuran</label>
              <input 
                id="ukuran"
                v-model="form.ukuran" 
                placeholder="Masukkan ukuran (S, M, L, XL)" 
                class="form-input"
              />
            </div>
            <div class="input-group">
              <label for="harga">Harga Baju</label>
              <input 
                id="harga"
                v-model="form.harga" 
                placeholder="Masukkan harga baju" 
                type="number" 
                class="form-input"
              />
            </div>
          </div>
          <div class="button-group">
            <button 
              @click="isEditing ? updateBaju() : tambahBaju()" 
              class="btn btn-primary"
            >
              {{ isEditing ? 'Update Baju' : 'Tambah Baju' }}
            </button>
            <button 
              v-if="isEditing" 
              @click="cancelEdit" 
              class="btn btn-secondary"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-section">
        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Daftar Baju</h3>
            <div class="table-info">
              <span class="total-count">Total: {{ daftarBaju.length }} baju</span>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Baju</th>
                  <th>Ukuran</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(baju, index) in daftarBaju" :key="baju.id" class="table-row">
                  <td>{{ index + 1 }}</td>
                  <td>{{ baju.nama }}</td>
                  <td>{{ baju.ukuran }}</td>
                  <td>{{ formatCurrency(baju.harga) }}</td>
                  <td>
                    <button @click="editBaju(baju.id)" class="btn-action btn-edit">Edit</button>
                    <button @click="hapusBaju(baju.id)" class="btn-action btn-delete">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '../css/databaju.css' // ganti ke file CSS kamu

const daftarBaju = ref([])
const form = ref({ nama: '', ukuran: '', harga: '' })
const isEditing = ref(false)
const editIndex = ref(null)

async function fetchBajuData() {
  try {
    const response = await fetch('https://web-hostingan.vercel.app//baju')
    const data = await response.json()
    daftarBaju.value = data
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan saat mengambil data baju.')
  }
}

async function tambahBaju() {
  if (form.value.nama && form.value.ukuran && form.value.harga) {
    try {
      const response = await fetch('https://web-hostingan.vercel.app//baju', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      })

      const result = await response.json()

      if (response.ok) {
        daftarBaju.value.push(result)
        resetForm()
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat menambah data baju.')
    }
  } else {
    alert('Semua field harus diisi!')
  }
}

async function editBaju(id) {
  const baju = daftarBaju.value.find(item => item.id === id)
  if (baju) {
    form.value = { ...baju }
    isEditing.value = true
    editIndex.value = id
  }
}

async function updateBaju() {
  if (editIndex.value !== null) {
    try {
      const response = await fetch(`https://web-hostingan.vercel.app//baju/${editIndex.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      })

      const result = await response.json()

      if (response.ok) {
        const index = daftarBaju.value.findIndex(baju => baju.id === editIndex.value)
        daftarBaju.value[index] = result
        resetForm()
        isEditing.value = false
        editIndex.value = null
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat memperbarui data baju.')
    }
  }
}

async function hapusBaju(id) {
  if (confirm('Apakah Anda yakin ingin menghapus baju ini?')) {
    try {
      const response = await fetch(`https://web-hostingan.vercel.app//baju/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        daftarBaju.value = daftarBaju.value.filter(baju => baju.id !== id)
      } else {
        alert('Gagal menghapus baju')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat menghapus data baju.')
    }
  }
}

function cancelEdit() {
  isEditing.value = false
  editIndex.value = null
  resetForm()
}

function resetForm() {
  form.value = { nama: '', ukuran: '', harga: '' }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

onMounted(() => {
  fetchBajuData()
})
</script>
