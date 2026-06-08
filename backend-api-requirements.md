# Spesifikasi Kebutuhan API Backend (Berdasarkan Role)

Dokumen ini berisi rancangan pemisahan API berdasarkan *Role* pengguna (Employee, Manager, Admin). Pemisahan ini **wajib** dilakukan di sisi *Backend* (API Gateway / Lambda) untuk mencegah kebocoran data (*Data Leakage*) dan mempercepat *loading* aplikasi.

**Aturan Emas Backend:**

1. *Backend* **TIDAK BOLEH** mengandalkan *Frontend* untuk memfilter data sensitif.
2. *Backend* **WAJIB** membaca dan memvalidasi `Cognito Token` dari setiap *request* yang masuk untuk mengetahui *Role*, `userId` (sub), dan `department` dari si pemanggil.

---

## 1. ROLE: EMPLOYEE (Karyawan Biasa)

API di bawah ini hanya boleh mengakses/memodifikasi data milik Karyawan itu sendiri. Karyawan tidak boleh bisa memanggil API milik Manager atau Admin.

### `GET /employee/upload-url`

* **Fungsi:** Meminta *Presigned URL S3* untuk mengunggah foto *selfie*.
* **Otorisasi:** Token Karyawan.

### `POST /employee/attendance` (Check-in)

* **Fungsi:** Mencatat absensi masuk.
* **Payload Request:**
  ```json
  {
    "photoKey": "photos/UUID/...jpg",
    "timestamp": "2026-06-08T..."
  }
  ```

  *(Catatan untuk Backend: `userId`, `name`, dan `department` **TIDAK** perlu dikirim dari Frontend. Backend harus mengekstraknya secara otomatis dari Token Cognito demi keamanan agar tidak bisa dipalsukan).*

### `GET /employee/attendance`

* **Fungsi:** Melihat riwayat absensi pribadi.
* **Respons Backend:** Lambda mengambil `userId` (sub) dari Token Cognito, lalu melakukan _query_ ke DynamoDB **HANYA** untuk absen milik `userId` tersebut.

---

## 2. ROLE: MANAGER (Kepala Departemen)

API ini hanya boleh mengembalikan data yang departemennya sama dengan departemen sang Manager.

### `GET /manager/team`

* **Fungsi:** Melihat daftar anggota tim (Roster) di departemennya.
* **Respons Backend:** Lambda mengecek `department` Manager dari Token, lalu meminta Cognito me-list seluruh *user* yang memiliki `custom:department` yang sama dengan Manager tersebut.

### `GET /manager/attendance`

* **Fungsi:** Melihat log absensi seluruh karyawan di departemennya.
* **Query Params (Opsional):** `?date=YYYY-MM-DD`
* **Respons Backend:** Lambda menarik data absensi dari DynamoDB **HANYA** untuk departemen sang Manager. (Jangan pernah mengirim absen departemen lain).

### `GET /manager/photo`

* **Fungsi:** Meminta *Presigned URL S3* untuk melihat foto *selfie* bukti absen anak buahnya.
* **Query Params:** `?photoKey=...`

---

## 3. ROLE: SUPER ADMIN

Admin memiliki akses ke seluruh data perusahaan untuk keperluan audit dan manajemen SDM.

### `GET /admin/users`

* **Fungsi:** Melihat seluruh daftar karyawan perusahaan dari Cognito.
* **Query Params (Opsional):** `?department=IT` (Untuk *filter*).

### `POST /admin/users`

* **Fungsi:** Membuat akun pegawai atau manajer baru di Cognito.
* **Payload Request:**
  ```json
  {
    "action": "create",
    "email": "santoso@it.com",
    "name": "Santoso Budi",
    "employeeId": "E-102",
    "department": "IT",
    "groupName": "IT_employee",
    "password": "Password123!"
  }
  ```

### `GET /admin/attendance`

* **Fungsi:** Melihat seluruh log absensi perusahaan (Semua Departemen).
* **Query Params (Opsional):** `?department=IT&date=YYYY-MM-DD`
* **Respons Backend:** Memberikan seluruh data. Sangat disarankan mengimplementasikan sistem *Pagination* (Limit/Offset) agar aplikasi tidak *crash* jika datanya mencapai puluhan ribu.

### `GET /admin/photo`

* **Fungsi:** Mengakses foto *selfie* pegawai mana pun di perusahaan.
