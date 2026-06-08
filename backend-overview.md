# Arsitektur & Infrastruktur AttendSecure (Serverless AWS)

## Deskripsi Proyek
AttendSecure adalah sistem presensi (absensi) cerdas dan aman berbasis komputasi awan (*cloud computing*). Infrastruktur ini dibangun sepenuhnya menggunakan arsitektur **Serverless di Amazon Web Services (AWS)**, memastikan skalabilitas tinggi, keamanan berlapis, dan efisiensi biaya. Sistem ini mendukung fitur otorisasi berbasis peran (RBAC), penyimpanan foto presensi yang aman, dan kalkulasi keterlambatan otomatis.

---

## Komponen AWS Utama

*   **Amazon Cognito:** Bertindak sebagai *Identity Provider* (IdP). Mengelola autentikasi pengguna dan menerapkan *Role-Based Access Control* (RBAC) melalui sistem `Groups` (Super Admin, Manager, Karyawan).
*   **Amazon API Gateway:** Bertindak sebagai pintu masuk utama (REST API) yang menghubungkan *client* dengan fungsi *backend*. Dilengkapi dengan *Cognito Authorizer* untuk memastikan hanya *request* dengan token JWT valid yang diteruskan.
*   **AWS Lambda:** Menjalankan logika bisnis *backend* tanpa perlu mengelola *server* fisik. Terdiri dari 5 fungsi *microservices*.
*   **Amazon S3:** Layanan penyimpanan objek yang aman (*private bucket*). Digunakan untuk menyimpan foto bukti presensi (selfie) dengan akses terbatas menggunakan mekanisme *Pre-signed URL*.
*   **Amazon DynamoDB:** *Database* NoSQL berkinerja tinggi untuk menyimpan dan melakukan *query* riwayat presensi (*timestamp*, *user ID*, status kehadiran, dan *department*).

---

## Daftar Endpoint & Fungsi Lambda

### 1. Autentikasi & Manajemen Akun
*   **Fungsi Lambda:** `AttendSecure-manageUsers`
*   **Endpoint:** `POST /manage-users`
*   **Deskripsi:** Fungsi *All-in-One* (CRUD) untuk mengelola data pengguna. Memiliki kemampuan untuk `create`, `update`, `delete`, dan `list` pengguna langsung ke AWS Cognito.
*   **Keamanan:** Akses eksklusif, hanya dapat diakses oleh *user* dengan peran `super-admin`.

### 2. Pra-Upload Foto Presensi
*   **Fungsi Lambda:** `AttendSecure-GetUploadURL`
*   **Endpoint:** `GET /upload-url-photo`
*   **Deskripsi:** Membangkitkan *Pre-signed URL* khusus (metode `PUT`) yang berlaku selama 15 menit agar *client* dapat mengunggah file foto secara langsung dan aman ke Amazon S3 tanpa perlu mengekspos kredensial AWS.

### 3. Pencatatan Kehadiran (Check-In)
*   **Fungsi Lambda:** `AttendSecure-CheckIn-Function`
*   **Endpoint:** `POST /checkin`
*   **Deskripsi:** Mencatat data presensi pengguna ke DynamoDB. Dilengkapi dengan logika pintar yang otomatis mengkalkulasi waktu lokal (WIB) dan mengubah status menjadi "terlambat" jika melewati batas toleransi pukul 08:15 WIB.

### 4. Laporan Presensi
*   **Fungsi Lambda:** `AttendSecure-GetAttendance`
*   **Endpoint:** `GET /attendance`
*   **Deskripsi:** Mengambil riwayat kehadiran dari DynamoDB dengan filter RBAC bawaan:
    *   `Super Admin`: Dapat melihat seluruh data perusahaan.
    *   `Manager`: Hanya dapat melihat data staf di departemennya.
    *   `Karyawan Biasa`: Hanya dapat melihat riwayat presensinya sendiri.

### 5. Pengambilan Foto Presensi
*   **Fungsi Lambda:** `AttendSecure-GetPhotoURL`
*   **Endpoint:** `GET /attendance/photo`
*   **Deskripsi:** Memvalidasi ID dan *timestamp* kehadiran, mencocokkannya dengan *database*, dan menghasilkan *Pre-signed URL* (metode `GET`) untuk menampilkan gambar dari bucket *private* S3 ke *dashboard client*.

---

## Keamanan Sistem (Security Highlights)

*   **Identitas Tanpa Password Terenkripsi:** Aplikasi *client* berinteraksi dengan API menggunakan *Bearer Token* (JWT) yang diterbitkan oleh Cognito, menghilangkan kebutuhan pengiriman kata sandi yang berulang.
*   **Least Privilege Access:** File statis (foto) di Amazon S3 tidak pernah dibuka ke publik. Akses *upload* maupun *download* diisolasi menggunakan *Pre-signed URL* dengan durasi kadaluarsa yang singkat.
*   **Validasi Otorisasi Ganda:** Hak akses tidak hanya dicek di level API Gateway, tetapi divalidasi ulang di dalam *runtime* Lambda untuk memastikan keamanan mutlak.

---

## Rekomendasi Integrasi Client
Infrastruktur *backend* ini mengekspos standar REST API dengan respons JSON penuh. Sistem ini sangat siap dan ideal untuk dikonsumsi oleh antarmuka *frontend* modern (seperti React/Vue.js untuk *Dashboard Manager*) maupun diintegrasikan langsung dengan aplikasi *mobile* Android menggunakan Kotlin dan Jetpack Compose.