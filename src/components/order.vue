<template>
  <div class="pemesanan-wrapper">
    <div class="pemesanan-container">
      <div class="pemesanan-header">
        <h1 class="pemesanan-title">{{ isEditing ? 'Edit Order' : 'Form Order Baju' }}</h1>
      </div>

      <!-- Form Pemesanan -->
      <div class="form-section">
        <div class="form-card">
          <h3 class="form-title">{{ isEditing ? 'Update Order' : 'Order Baju' }}</h3>

          <div class="form-grid">
            <div class="input-group">
              <label for="namaPemesan">Nama Pemesan</label>
              <input
                id="namaPemesan"
                v-model="form.namaPemesan"
                placeholder="Masukkan nama pemesan"
                class="form-input"
              />
            </div>

            <div class="input-group">
              <label for="namaBaju">Nama Baju</label>
              <input
                id="namaBaju"
                v-model="form.namaBaju"
                placeholder="Masukkan nama baju yang ingin dipesan"
                class="form-input"
              />
            </div>

            <div class="input-group">
              <label for="ukuran">Ukuran</label>
              <select
                id="ukuran"
                v-model="form.ukuran"
                class="form-select"
              >
                <option value="">Pilih ukuran</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div class="input-group">
              <label for="noHp">No. HP</label>
              <input
                id="noHp"
                v-model="form.noHp"
                placeholder="Masukkan no. HP"
                type="text"
                class="form-input"
              />
            </div>

            <div class="input-group">
              <label for="status">Status Pembayaran</label>
              <select
                id="status"
                v-model="form.status"
                class="form-select"
              >
                <option value="Lunas">Lunas</option>
                <option value="DP 50%">DP 50%</option>
                <option value="Proses">Proses</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
          </div>

          <div class="button-group">
            <button
              @click="isEditing ? updateOrder() : submitOrder()"
              class="btn btn-primary"
            >
              {{ isEditing ? 'Update Order' : 'Submit Order' }}
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

      <!-- Tabel Pemesanan -->
      <div class="pemesanan-table-section">
        <h3>Daftar Order</h3>
        <table class="pemesanan-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Pemesan</th>
              <th>Nama Baju</th>
              <th>Ukuran</th>
              <th>No. HP</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orderList" :key="order.id">
              <td>{{ index + 1 }}</td>
              <td>{{ order.namaPemesan }}</td>
              <td>{{ order.namaBaju }}</td>
              <td>{{ order.ukuran }}</td>
              <td>{{ order.noHp }}</td>
              <td>{{ order.status }}</td>
              <td>{{ formatTanggal(order.tanggal) }}</td>
              <td>
                <button class="btn-edit" @click="editOrder(order)">Edit</button>
                <button class="btn-delete" @click="hapusOrder(order.id)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import '../css/order.css';

const form = ref({
  namaPemesan: '',
  namaBaju: '',
  ukuran: '',
  noHp: '',
  status: 'Lunas'
});

const orderList = ref([]);
const isEditing = ref(false);
const currentOrderId = ref(null);

const fetchOrder = async () => {
  try {
    const response = await fetch('https://tokobajudela.glitch.me/order');
    const data = await response.json();
    orderList.value = data;
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat mengambil data order.');
  }
};

const submitOrder = async () => {
  if (form.value.namaPemesan && form.value.namaBaju && form.value.ukuran && form.value.noHp) {
    try {
      const id = Date.now();
      const response = await fetch('https://tokobajudela.glitch.me/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          ...form.value,
          tanggal: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        alert('Order berhasil!');
        await fetchOrder();
        resetForm();
      } else {
        alert('Terjadi kesalahan saat mengirim data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan jaringan.');
    }
  } else {
    alert('Semua field harus diisi!');
  }
};

const editOrder = (order) => {
  form.value = { ...order };
  currentOrderId.value = order.id;
  isEditing.value = true;
};

const updateOrder = async () => {
  if (currentOrderId.value != null) {
    try {
      const response = await fetch(`https://tokobajudela.glitch.me/order/${currentOrderId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form.value,
          tanggal: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        alert('Order berhasil diperbarui!');
        await fetchOrder();
        resetForm();
        isEditing.value = false;
        currentOrderId.value = null;
      } else {
        alert('Terjadi kesalahan saat memperbarui data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan jaringan.');
    }
  }
};

const hapusOrder = async (id) => {
  const confirmDelete = confirm('Apakah Anda yakin ingin menghapus order ini?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://tokobajudela.glitch.me/order/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Order berhasil dihapus!');
      await fetchOrder();
    } else {
      alert('Terjadi kesalahan saat menghapus order.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan jaringan.');
  }
};

const cancelEdit = () => {
  resetForm();
  isEditing.value = false;
  currentOrderId.value = null;
};

const resetForm = () => {
  form.value = {
    namaPemesan: '',
    namaBaju: '',
    ukuran: '',
    noHp: '',
    status: 'Lunas'
  };
};

const formatTanggal = (tanggal) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(tanggal).toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchOrder();
});
</script>
