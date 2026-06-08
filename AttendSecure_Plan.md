# AttendSecure — Team Task Division (3 Orang)

> Setiap orang mengerjakan bagiannya masing-masing secara paralel. Integrasi dilakukan di akhir dengan cara Orang 2 mengupdate `.env` dan Orang 3 melakukan final testing.

---

## Koordinasi Awal (Lakukan Bersama, ~1 Jam)

Sebelum pisah, lakukan ini bertiga dulu:

* [ ] Tentukan siapa Orang 1, 2, dan 3
* [ ] Buat 1 GitHub repo bersama dengan struktur:
  ```
  attendsecure/├── frontend/├── backend/└── docs/
  ```
* [ ] Orang 1 mulai setup AWS dan catat semua nilai penting di file `docs/env-values.md` (di-share via GitHub) setelah setiap service selesai dibuat

---

## Orang 1 — AWS Infrastructure & Backend

> Pegang akun AWS. Semua service dibuat di sini.

### Foundation (Kerjakan pertama, hasil dibagikan ke tim)

* [ ] Set billing alert $5
* [ ] Buat **KMS CMK** → catat Key ARN
* [ ] Buat **S3 bucket** dengan SSE-KMS + block public access + CORS
* [ ] Buat **DynamoDB table** `attendance-records` + GSI `department-date-index`
* [ ] Buat **Cognito User Pool** dengan:
  * 3 User Groups: `super-admin`, `manager`, `employee`
  * Custom attribute: `custom:department`
  * App Client (no secret)
  * 3 test users dengan role dan department masing-masing
* [ ] Buat **3 IAM roles** untuk Lambda
* [ ] Catat semua nilai ke `docs/env-values.md`:
  * KMS Key ARN
  * S3 Bucket Name
  * DynamoDB Table Name
  * Cognito User Pool ID
  * Cognito App Client ID

### Backend (Setelah foundation selesai)

* [ ] Buat Lambda **`checkIn`** — tulis kode, set env vars, test via Console
* [ ] Buat Lambda **`getAttendance`** — tulis kode, set env vars, test via Console
* [ ] Buat Lambda **`manageUsers`** — tulis kode, set env vars, test via Console
* [ ] Setup **API Gateway** — buat semua routes, pasang Cognito Authorizer, enable CORS
* [ ] Deploy API ke stage `dev` → catat **Invoke URL** ke `docs/env-values.md`
* [ ] Test end-to-end via Postman (check-in → upload foto → get attendance)
* [ ] Buat **S3 bucket frontend** + setup **CloudFront distribution**
* [ ] Catat **CloudFront domain** ke `docs/env-values.md`
* [ ] Update CORS semua Lambda dan API Gateway ke CloudFront domain

### Output yang dihasilkan

* Semua AWS services berjalan
* API siap dipanggil
* File `docs/env-values.md` lengkap untuk Orang 2

---

## Orang 2 — Frontend

> Kerjakan di lokal. Tidak butuh akun AWS. Pakai placeholder di `.env` dulu.

### Setup Awal

* [ ] `npx create-react-app attendsecure-frontend`
* [ ] Install dependencies: `npm install aws-amplify @aws-amplify/ui-react axios`
* [ ] Buat `.env` dengan placeholder:
  ```
  REACT_APP_API_URL=https://placeholder.execute-api.ap-southeast-1.amazonaws.com/devREACT_APP_COGNITO_REGION=ap-southeast-1REACT_APP_COGNITO_USER_POOL_ID=placeholderREACT_APP_COGNITO_APP_CLIENT_ID=placeholder
  ```
* [ ] Setup Amplify config di `src/index.js`

### Halaman & Komponen

* [ ] `src/hooks/useAuth.js` — ambil user session + deteksi role dari token
* [ ] `src/App.js` — routing berdasarkan role (employee / manager / super-admin)
* [ ] `src/pages/EmployeeDashboard.jsx`:
  * Tombol Check In
  * Upload foto (file input atau kamera)
  * Tabel riwayat presensi + thumbnail foto
* [ ] `src/pages/ManagerDashboard.jsx`:
  * Tabel presensi departemen
  * Date picker
  * Expand foto saat diklik
* [ ] `src/pages/AdminDashboard.jsx`:
  * Tabel semua user
  * Form tambah user baru

### Integrasi (Setelah Orang 1 selesai)

* [ ] Ambil nilai dari `docs/env-values.md`
* [ ] Update `.env` dengan nilai asli
* [ ] `npm run build`
* [ ] Upload folder `build/` ke S3 frontend bucket (minta Orang 1 yang upload jika tidak punya akses AWS)
* [ ] Test di CloudFront URL

### Output yang dihasilkan

* Frontend lengkap dan siap di-deploy
* Semua halaman per role berfungsi

---

## Orang 3 — Dokumentasi & Testing

> Tidak butuh akun AWS. Kerjakan paralel dari awal.

### Dokumentasi

* [ ] Buat `docs/product-overview.md` — ringkasan produk, fitur, target user
* [ ] Buat `docs/architecture.md` — deskripsi arsitektur + diagram (bisa pakai draw.io atau Excalidraw)
* [ ] Buat `docs/security-analysis.md` — jelaskan setiap keputusan keamanan:
  * Kenapa SSE-KMS bukan SSE-S3
  * Kenapa pre-signed URL bukan Lambda proxy
  * Kenapa JWT disimpan di memory bukan localStorage
  * Role isolation: bagaimana Lambda filter data per role
* [ ] Buat slide presentasi (minimal 8 slide):
  1. Cover — nama produk, anggota tim
  2. Problem statement
  3. Solution overview
  4. Architecture diagram
  5. AWS services yang digunakan + alasan
  6. Security features
  7. Demo screenshots
  8. Kesimpulan & lessons learned

### Testing (Setelah integrasi selesai)

* [ ] Test **Scenario 1** — Employee check-in happy path → screenshot
* [ ] Test **Scenario 2** — Employee coba check-in dua kali → screenshot error
* [ ] Test **Scenario 3** — Manager lihat data departemennya → screenshot
* [ ] Test **Scenario 4** — Manager tidak bisa lihat departemen lain → screenshot
* [ ] Test **Scenario 5** — Admin buat user baru → screenshot
* [ ] Test **Scenario 6** — Akses foto langsung via S3 URL tanpa pre-signed → konfirmasi Access Denied
* [ ] Kumpulkan semua screenshot ke `docs/screenshots/`
* [ ] Tulis `docs/test-results.md` — ringkasan hasil testing

### Output yang dihasilkan

* Dokumentasi lengkap siap dikumpulkan
* Slide presentasi siap
* Bukti testing dengan screenshot

---

## Integrasi Final (Bersama, ~1 Jam)

Lakukan ini setelah semua orang selesai dengan bagiannya:

1. Orang 1 konfirmasi semua AWS services aktif dan `docs/env-values.md` lengkap
2. Orang 2 update `.env` → rebuild → upload ke S3 frontend
3. Orang 3 jalankan semua test scenarios di CloudFront URL
4. Jika ada bug → Orang 1 fix backend, Orang 2 fix frontend
5. Orang 3 capture screenshot final untuk presentasi

---

## File `docs/env-values.md` (Template — diisi Orang 1)

```markdown
# AttendSecure — Environment Values

## AWS Region
ap-southeast-1

## KMS
Key ARN: arn:aws:kms:ap-southeast-1:XXXXXXXXXXXX:key/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

## S3
Photos Bucket: attendsecure-photos-XXXXXXXXXXXX
Frontend Bucket: attendsecure-frontend-XXXXXXXXXXXX

## DynamoDB
Table Name: attendance-records

## Cognito
User Pool ID: ap-southeast-1_xxxxxxxxx
App Client ID: xxxxxxxxxxxxxxxxxxxxxxxxxx
Hosted UI Domain: https://attendsecure-xxxxx.auth.ap-southeast-1.amazoncognito.com

## API Gateway
Invoke URL: https://xxxxxxxxxx.execute-api.ap-southeast-1.amazonaws.com/dev

## CloudFront
Domain: https://dxxxxxxxxxxxx.cloudfront.net

## Test Users
admin@test.com / [password]
manager@test.com / [password]
employee@test.com / [password]
```

---

*AttendSecure — Cloud Computing Security course project*
*AWS Services: Cognito · API Gateway · Lambda · DynamoDB · S3 · KMS · CloudFront*
