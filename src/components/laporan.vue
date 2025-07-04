<template>
  <div class="page-laporan-penjualan">
    <Navbar>
      <template #header>
        <h1>Laporan Penjualan Baju</h1>
      </template>
    </Navbar>

    <section class="laporan-header">
      <header class="laporan-title">
        <h2>Laporan Penjualan Bulanan</h2>
      </header>
      <div class="laporan-filter">
        <label>Periode:</label>
        <span>{{ bulan }} {{ tahun }}</span>
        <div class="filter-selects">
          <select v-model="bulan" class="input-dropdown">
            <option v-for="(month, idx) in daftarBulan" :key="idx" :value="month">
              {{ month }}
            </option>
          </select>
          <select v-model="tahun" class="input-dropdown">
            <option v-for="year in daftarTahun" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <section class="laporan-summary">
      <div class="summary-item">
        <p class="summary-title">Total Penjualan</p>
        <p class="summary-value">Rp {{ formatCurrency(totalPenjualan) }}</p>
      </div>
      <div class="summary-item">
        <p class="summary-title">Total Unit Terjual</p>
        <p class="summary-value">{{ totalUnit }}</p>
      </div>
      <div class="summary-item">
        <p class="summary-title">Jumlah Transaksi</p>
        <p class="summary-value">{{ penjualan.length }}</p>
      </div>
    </section>

    <main class="laporan-content">
      <table class="table-penjualan">
        <thead>
          <tr>
            <th>#</th>
            <th>Tanggal</th>
            <th>Nama Baju</th>
            <th>Ukuran</th>
            <th>Pelanggan</th>
            <th>Harga</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in penjualan" :key="item.id">
            <td>{{ i + 1 }}</td>
            <td>{{ formatDate(item.tanggal) }}</td>
            <td>{{ item.namaBaju }}</td>
            <td>{{ item.ukuran }}</td>
            <td>{{ item.pelanggan }}</td>
            <td>Rp {{ formatCurrency(item.harga) }}</td>
            <td>
              <span :class="['badge-status', formatStatusClass(item.status)]">
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <footer class="laporan-footer">
      <button class="btn-action print" @click="cetakLaporan">
        Cetak Laporan
      </button>
    </footer>
  </div>
</template>


<script>
import '../css/laporan.css';
export default {
  name: "LaporanPenjualanBaju",
  data() {
    return {
      bulan: "Mei",
      tahun: 2025,
      daftarBulan: [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ],
      daftarTahun: [2023, 2024, 2025],
      penjualan: [
        {
          id: 1,
          tanggal: "2025-05-01",
          namaBaju: "Kemeja Flanel",
          ukuran: "L",
          pelanggan: "Andi Wijaya",
          harga: 250000,
          status: "Lunas"
        },
        {
          id: 2,
          tanggal: "2025-05-05",
          namaBaju: "Kaos Polo",
          ukuran: "M",
          pelanggan: "Budi Santoso",
          harga: 150000,
          status: "DP 50%"
        },
        {
          id: 3,
          tanggal: "2025-05-10",
          namaBaju: "Dress Casual",
          ukuran: "S",
          pelanggan: "Citra Dewi",
          harga: 350000,
          status: "Lunas"
        },
        {
          id: 4,
          tanggal: "2025-05-15",
          namaBaju: "Blazer Wanita",
          ukuran: "M",
          pelanggan: "Dedi Kurniawan",
          harga: 400000,
          status: "Proses"
        },
        {
          id: 5,
          tanggal: "2025-05-20",
          namaBaju: "Celana Jeans",
          ukuran: "L",
          pelanggan: "Eka Putri",
          harga: 280000,
          status: "Lunas"
        }
      ]
    };
  },
  computed: {
    totalPenjualan() {
      return this.penjualan.reduce((total, item) => total + item.harga, 0);
    },
    totalUnit() {
      return this.penjualan.length;
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    },
    cetakLaporan() {
      window.print();
    },
    exportExcel() {
      alert("Fitur export Excel akan diimplementasikan di sini");
    },
    formatStatusClass(status) {
      return status
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }
};
</script>
