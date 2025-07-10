<template>
  <div class="pelanggan-container">
    <div class="header-section">
      <h1>Manajemen Data Pelanggan Toko Baju Dela</h1>
      <button class="btn-tambah" @click="openForm">
        <span>+</span> Tambah Pelanggan
      </button>
    </div>

    <!-- FORM INPUT DI LUAR TABLE -->
    <div v-if="showForm" class="form-container">
      <h3>{{ isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru' }}</h3>
      <div class="form-group">
        <label>Nama</label>
        <input v-model="form.nama" type="text" placeholder="Nama pelanggan" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="Email pelanggan" />
      </div>
      <div class="form-group">
        <label>Telepon</label>
        <input v-model="form.telepon" type="text" placeholder="No HP pelanggan" />
      </div>
      <div class="form-group">
        <label>Alamat</label>
        <input v-model="form.alamat" type="text" placeholder="Alamat pelanggan" />
      </div>
      <div class="form-group">
        <label>Gender</label>
        <select v-model="form.gender">
          <option value="">Pilih Gender</option>
          <option value="Pria">Pria</option>
          <option value="Wanita">Wanita</option>
        </select>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select v-model="form.status">
          <option value="Aktif">Aktif</option>
          <option value="Tidak Aktif">Tidak Aktif</option>
        </select>
      </div>
      <div class="button-group">
        <button class="btn-submit" @click="isEditing ? updatePelanggan() : submitPelanggan()">
          {{ isEditing ? 'Update' : 'Simpan' }}
        </button>
        <button class="btn-cancel" @click="closeForm">Batal</button>
      </div>
    </div>

    <!-- TABEL DAFTAR PELANGGAN -->
    <div v-if="pelangganList.length > 0" class="pelanggan-grid">
      <table class="pelanggan-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Alamat</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pelanggan in pelangganList" :key="pelanggan.id">
            <td>{{ pelanggan.id }}</td>
            <td>{{ pelanggan.nama }}</td>
            <td>{{ pelanggan.email }}</td>
            <td>{{ pelanggan.telepon }}</td>
            <td>{{ pelanggan.alamat || '-' }}</td>
            <td>{{ pelanggan.gender || '-' }}</td>
            <td>{{ pelanggan.status }}</td>
            <td>
              <button class="btn-edit" @click="editPelanggan(pelanggan)">Edit</button>
              <button class="btn-delete" @click="confirmDelete(pelanggan.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="empty-state">
      <p>Tidak ada data pelanggan.</p>
    </div>

    <!-- MODAL KONFIRMASI HAPUS -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Konfirmasi Penghapusan</h3>
        <p>Apakah Anda yakin ingin menghapus pelanggan ini?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">Batal</button>
          <button class="btn-confirm-delete" @click="hapusPelanggan">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../css/pelanggan.css' 
export default {
  name: "PelangganTokoBajuDela",
  data() {
    return {
      pelangganList: [],
      showForm: false,
      isEditing: false,
      currentEditingId: null,
      showDeleteModal: false,
      pelangganToDeleteId: null,
      form: {
        nama: '',
        email: '',
        telepon: '',
        alamat: '',
        gender: '',
        status: 'Aktif'
      }
    }
  },
  created() {
    this.loadPelanggan();
  },
  methods: {
    loadPelanggan() {
      fetch('https://tokobajudela.glitch.me/pelanggan')
        .then(res => res.json())
        .then(data => {
          this.pelangganList = data;
        })
        .catch(err => {
          console.error(err);
          alert("Gagal memuat data pelanggan.");
        });
    },
    openForm() {
      this.showForm = true;
      this.isEditing = false;
      this.resetForm();
    },
    closeForm() {
      this.showForm = false;
      this.isEditing = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        nama: '',
        email: '',
        telepon: '',
        alamat: '',
        gender: '',
        status: 'Aktif'
      };
    },
    submitPelanggan() {
      if (!this.form.nama || !this.form.email || !this.form.telepon) {
        alert("Nama, email, dan telepon wajib diisi!");
        return;
      }
      const newPelanggan = {
        ...this.form,
        id: Date.now()
      };
      fetch('https://web-hostingan.vercel.app//pelanggan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPelanggan)
      })
        .then(res => res.json())
        .then((saved) => {
          alert("Data pelanggan berhasil ditambahkan.");
          this.loadPelanggan();
          this.closeForm();
        })
        .catch(err => {
          console.error(err);
          alert("Gagal menyimpan data.");
        });
    },
    editPelanggan(pelanggan) {
      this.showForm = true;
      this.isEditing = true;
      this.currentEditingId = pelanggan.id;
      this.form = { ...pelanggan };
    },
    updatePelanggan() {
      if (!this.currentEditingId) {
        alert("ID pelanggan tidak ditemukan.");
        return;
      }
      fetch(`https://web-hostingan.vercel.app//pelanggan/${this.currentEditingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      })
        .then(res => res.json())
        .then(() => {
          alert("Data pelanggan berhasil diupdate.");
          this.loadPelanggan();
          this.closeForm();
        })
        .catch(err => {
          console.error(err);
          alert("Gagal memperbarui data.");
        });
    },
    confirmDelete(id) {
      this.pelangganToDeleteId = id;
      this.showDeleteModal = true;
    },
    hapusPelanggan() {
      if (!this.pelangganToDeleteId) {
        alert("ID pelanggan tidak ditemukan.");
        return;
      }
      fetch(`https://web-hostingan.vercel.app//pelanggan/${this.pelangganToDeleteId}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error("Delete gagal");
          alert("Data pelanggan berhasil dihapus.");
          this.loadPelanggan();
          this.showDeleteModal = false;
          this.pelangganToDeleteId = null;
        })
        .catch(err => {
          console.error(err);
          alert("Gagal menghapus data.");
        });
    }
  }
}
</script>
