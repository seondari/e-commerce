# Toko Kita - Website E-Commerce

Tugas kelompok mata kuliah Pemrograman Web.

## Anggota
| Nama | NPM |
|---|---|
| Anggraito Husodo | 20124162 |
| Desta Fidelia Natalie | 20124326 |
| Gendis Aminarti Adinda | 20124516 |
| Hizkia Manuel Sirait | 20124568 |
| Ira Destriana Sondari | 20124598 |

## Fitur
- Beranda dan daftar produk (data dari `data/products.json`)
- Pencarian, filter kategori, dan pengurutan harga
- Halaman detail produk
- Keranjang belanja (tambah, ubah jumlah, hapus)
- Wishlist (ikon hati) dan badge jumlah item di navbar
- Registrasi dan login (simulasi dengan **localStorage**)
- Checkout dan pembuatan pesanan (simulasi dengan **localStorage**)
- Riwayat pesanan dan pembatalan pesanan
- Tema terang/gelap, ikon, dan notifikasi toast
- fitur wishlist

## Teknologi
HTML, CSS, JavaScript (belum menggunakan framework).
Ikon memakai Font Awesome lewat CDN, jadi butuh koneksi internet agar ikon tampil.

---

# BACA SEBELUM MENGERJAKAN
Perhatikan langkah-langkah dengan teliti. Ikuti urutannya dan jangan ada yang dilompati.

## A. Persiapan (cukup sekali)

### 1. Terima undangan collaborator
Buka email atau notifikasi GitHub (ikon lonceng), lalu klik **Accept invitation**.
Tanpa ini kamu **tidak bisa push**.

### 2. Pasang Git
1. Unduh dari https://git-scm.com/downloads lalu pasang. Pilih **Next** terus (pengaturan bawaan sudah cukup).
2. Tutup dan buka kembali VS Code (atau terminal), lalu cek:
   ```bash
   git --version
   ```
   Kalau muncul nomor versi, berarti berhasil.

### 3. Pasang Live Server
1. Di VS Code buka tab **Extensions** (**Ctrl + Shift + X**), cari **Live Server** (oleh Ritwick Dey), lalu klik **Install**.

### 4. Atur identitas Git
Pakai email yang **sama dengan akun GitHub-mu**:
```bash
git config --global user.name "Nama Kamu"
git config --global user.email "emailgithub@contoh.com"
git config --global pull.rebase false
```
Baris ketiga membuat `git pull` selalu berjalan dengan cara yang sama dan tidak error saat riwayat bercabang.

## B. Mengambil proyek (clone, cukup sekali)

1. Buka VS Code, lalu buka terminal dengan **Ctrl + `** (tombol backtick, di atas Tab).
2. Masuk ke folder tempat kamu mau menyimpan proyek, misalnya `Documents`:
   ```bash
   cd Documents
   ```
3. Clone repo (ganti `url-repo` dengan URL repo ini: klik tombol hijau **Code** di GitHub, pilih **HTTPS**, lalu salin):
   ```bash
   git clone url-repo
   cd nama-folder-repo
   ```
4. Buka folder itu di VS Code: **File → Open Folder**, atau ketik:
   ```bash
   code .
   ```
5. Saat pertama kali `git push` nanti, akan muncul jendela browser untuk login GitHub. Login dengan akunmu lalu izinkan. Setelah itu tidak ditanya lagi.

> Pakai **Open Folder**, bukan *Add Folder to Workspace*, supaya Git tidak tercampur dengan proyek lain.

## C. Menjalankan proyek
1. Klik kanan `index.html` di sidebar VS Code.
2. Pilih **Open with Live Server**.
3. Browser terbuka di alamat `http://127.0.0.1:5500`.

> Halaman tidak bisa dibuka dengan klik dua kali pada file, karena data produk diambil dengan `fetch`.

## D. Alur kerja harian (langsung di branch `main`)

Kita **tidak memakai branch dulu**. Semua orang bekerja langsung di `main`.
Supaya aman, ikuti urutan ini **setiap kali** mengerjakan:

**1. Kabari grup dulu.** Contoh: "Aku mau kerjakan `cart.js` ya."

**2. Ambil update terbaru** (wajib, sebelum mulai mengedit apa pun):
```bash
git pull
```

**3. Kerjakan bagianmu**, lalu simpan file (**Ctrl + S**) dan tes di Live Server.

**4. Commit dan push** secepat mungkin setelah satu bagian selesai (jangan ditunda sampai besok):
```bash
git add .
git commit -m "tulis ringkas apa yang diubah"
git push
```

**5. Kabari grup:** "Sudah push ya, silakan `git pull`."

Cek kondisi kapan saja dengan:
```bash
git status
```

### Aturan kerja bareng
- **Jangan mengedit file yang sama di waktu yang sama.** Kabari grup dulu sebelum menyentuh sebuah file.
- **`git pull` dulu, baru mulai kerja.** Ini kebiasaan paling penting.
- **Commit kecil dan sering**, dengan pesan yang jelas (misalnya `tambah validasi form login`, bukan `update`).
- **Jangan pernah memakai `git push --force`.**
- **Jangan commit data rahasia** (password, API key, file `.env`). Repo ini public, jadi semua orang bisa melihatnya.
- Sebelum push, pastikan situs masih jalan di Live Server dan tidak ada error merah di **F12 → Console**.

## E. Kalau ada masalah di Git

**`rejected` atau `failed to push` saat `git push`**
Berarti temanmu sudah push duluan. Jalankan:
```bash
git pull
git push
```

**Terminal membuka editor teks (Vim) berisi pesan "Merge branch ..."**
Itu normal setelah `git pull`. Ketik `:wq` lalu tekan Enter. Kalau yang terbuka tab di VS Code, simpan lalu tutup tab-nya.

**`CONFLICT` saat `git pull`**
Artinya kamu dan temanmu mengedit baris yang sama. Di file yang bermasalah akan muncul tanda seperti ini:
```
<<<<<<< HEAD
versi milikmu
=======
versi milik temanmu
>>>>>>> origin/main
```
Cara menyelesaikan:
1. Buka file itu. VS Code menyediakan tombol **Accept Current / Accept Incoming / Accept Both**, atau edit manual.
2. Pastikan tanda `<<<<<<<`, `=======`, dan `>>>>>>>` sudah hilang semua.
3. Simpan, lalu:
   ```bash
   git add .
   git commit -m "selesaikan konflik"
   git push
   ```

**`403` atau `permission denied` saat push**
Undangan collaborator belum diterima, atau login ke akun GitHub yang salah.

**Salah mengedit file dan ingin dibatalkan (belum di-commit)**
```bash
git restore nama-file
```
Perhatian: perintah ini menghapus semua perubahan di file itu dan tidak bisa dikembalikan.

**`fatal: not a git repository`**
Terminal belum ada di folder proyek. Cek dengan `pwd`, lalu `cd` ke folder repo.

## Struktur folder
```
index.html
pages/
  products.html  product-detail.html  cart.html  checkout.html
  login.html     register.html        wishlist.html  orders.html
css/
  style.css          (semua gaya dan warna tema)
js/
  layout.js          (navbar, footer, tema, ikon, toast)
  store.js           (fungsi data bersama: produk, pesanan, wishlist)
  products.js        (daftar dan detail produk)
  cart.js            (keranjang)
  auth.js            (registrasi dan login)
  checkout.js        (checkout)
  wishlist.js        (halaman wishlist)
  orders.js          (riwayat pesanan)
data/
  products.json      (data produk)
assets/
  images/            (gambar produk)
```

## Catatan data
Akun, keranjang, wishlist, dan pesanan **disimpan di browser masing-masing** (localStorage), bukan di server.
Jadi akun atau pesanan yang kamu buat tidak akan terlihat di komputer temanmu. Itu normal, karena belum ada backend.
Untuk melihat atau menghapus data uji coba: **F12 → Application → Local Storage**.

## Sumber gambar dan update selanjutnya
(menyesuaikan).

Diperbarui 5-11-2026
