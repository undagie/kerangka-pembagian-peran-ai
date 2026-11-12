# Panel Moodle: Periksa Tugas dengan AI

*Userscript* yang menambahkan panel pemeriksaan di halaman tugas Moodle (`mod/assign/view.php`) dan halaman kuis (`mod/quiz/view.php`, `mod/quiz/report.php`). Panel membaca repositori GitHub yang dikumpulkan mahasiswa atau jawaban uraian kuis, menilainya dengan kunci yang sama untuk semua mahasiswa, lalu menyimpan umpan balik ke Moodle setelah dosen membacanya.

Panel berjalan di peramban dosen yang sudah masuk Moodle dan memakai layanan web yang sama dengan halaman penilaian Moodle. Kata sandi tidak disimpan.

## 1. Persiapan

### Kunci layanan AI

Panel memakai layanan AI apa pun yang kompatibel dengan OpenAI Chat Completions.

| Layanan | Alamat API | Catatan |
|---|---|---|
| OpenRouter (bawaan) | `https://openrouter.ai/api/v1` | Satu kunci untuk banyak model. Pemeriksaan silang, `data_collection: "deny"`, laporan biaya, dan pemantau harga hanya aktif di sini |
| Layanan lain atau layanan kampus | Alamat yang berakhir dengan `/v1` | Isi juga model penilai dengan ID model di layanan itu. Pastikan ketentuan datanya sendiri |

Pasang batas kredit pada kunci. Kunci tersimpan di penyimpanan lokal peramban, tidak di Moodle.

### Token GitHub

Tanpa token, GitHub membatasi 60 permintaan per jam per alamat IP. Buat *fine-grained token* di pengaturan GitHub dengan akses **Public repositories (read-only)**. Bila mahasiswa memakai repositori privat dengan dosen sebagai kolaborator, beri token akses baca ke repositori itu.

## 2. Pemasangan

1. Pasang ekstensi Tampermonkey (atau pengelola *userscript* lain) di peramban.
2. Di Chrome, buka `chrome://extensions`, buka rincian Tampermonkey, lalu aktifkan **Allow User Scripts**.
3. Buat skrip baru, tempel seluruh isi `periksa-tugas-ai.user.js`, lalu simpan.
4. Ganti baris `@match` di kepala skrip dengan alamat Moodle kampus Anda, misalnya `https://elearning.kampus.ac.id/mod/assign/view.php*`. Pola bawaan `*://*/...` berlaku untuk semua situs dan sebaiknya dipersempit.
5. Buka halaman tugas. Tombol **Periksa AI** muncul di tepi kanan layar.

## 3. Alur satu tugas

1. Buka halaman tugas, klik **Periksa AI**. Daftar peserta dimuat, termasuk yang tidak mengumpulkan.
2. **Pengaturan**: isi kunci layanan AI, alamat API bila bukan OpenRouter, model, dan token GitHub.
3. **Modul dan kunci penilaian**: muat modul (`.docx`, `.md`, atau `.txt`), lalu susun kunci dari modul, atau impor kunci `.json`. Tinjau dan sunting kunci di kotak teks. Status validasi muncul di bawahnya. Panduan menulis kunci: [dokumen/04-kunci-dan-rubrik.md](../../dokumen/04-kunci-dan-rubrik.md).
4. **Diagnosa**: semua baris harus lolos.
5. **Kalibrasi**: periksa 3–5 mahasiswa yang beragam. Baca rincian butir, bukti, dan umpan baliknya. Perjelas kunci, buang hasil kalibrasi yang belum dikirim, lalu periksa lagi.
6. **Periksa semua**, tinjau kartu, lalu **Kirim semua yang siap**. Kartu yang ditahan atau perlu dicek manual tidak ikut terkirim.
7. Unduh **CSV** untuk rekap.

Setiap kiriman dinilai sekali. Kiriman yang repositorinya belum terbaca (privat, kosong, salah tautan) boleh dicek ulang setelah diperbaiki.

### Status kartu

| Status | Arti |
|---|---|
| Siap dikirim (AI) | Umpan balik AI sudah ada dan boleh disunting |
| Siap dikirim (templat) | Templat untuk kasus pasti, misalnya tidak mengumpulkan |
| Perlu dicek manual | Templat disiapkan, tetapi tidak dikirim otomatis |
| Tersimpan di Moodle | Umpan balik sudah tersimpan |
| Sudah ada komentar | Moodle sudah berisi komentar lain, jadi kiriman dilewati |
| Gagal | Lihat pesan di kartu, lalu periksa ulang |

Kartu yang berkas atau tangkapan layarnya identik dengan milik mahasiswa lain ditahan dan tidak ikut **Kirim semua** sampai Anda menyetujui atau menghapus catatan kemiripannya. Rincian butir, catatan untuk dosen, dan indikasi kemiripan tampil di kartu dan tidak dikirim ke mahasiswa.

### Kasus tanpa AI

| Kasus | Hasil |
|---|---|
| Tidak ada kiriman, tautan profil, repositori tidak dapat dibuka atau kosong | Templat sesuai kasusnya |
| Berkas wajib hanya ada di zip, *submodule*, atau dokumen pengganti | Templat bentuk kiriman tidak sesuai |
| Commit terakhir di folder tugas lewat web GitHub (bila `tolak_unggah_web` aktif) | Templat kumpul ulang lewat Git |
| Ada berkas atau tautan selain GitHub | Perlu dicek manual |

Teks templat dapat diubah di menu Templat.

### Menutup penilaian

**Tutup penilaian (nilai 0)** memberi nilai 0 dan komentar penutup kepada peserta yang nilainya masih kosong. Panel menampilkan daftar yang akan ditutup dan yang dilewati sebelum Anda menyetujui.

## 4. Kuis uraian

Di halaman kuis, **Periksa esai** membaca jawaban dari laporan penilaian manual Moodle.

1. Muat modul, lalu susun rubrik dari soal dan modul. Rubrik berisi butir berpoin per soal, dan jumlah poin sama dengan nilai maksimum soal.
2. Uji pada beberapa jawaban, perbaiki rubrik, lalu buang hasil uji coba.
3. **Nilai semua**, tinjau kartu bertanda cek dosen atau ditahan, lalu **Simpan semua yang siap**. Panel membaca ulang Moodle untuk memastikan nilai dan umpan balik tersimpan.

Untuk butir yang terpenuhi, AI wajib mengutip jawaban, dan program memeriksa kutipan itu ada. Jawaban yang identik antarmahasiswa ditahan. Jawaban kosong yang masih ditandai perlu dinilai diberi 0 tanpa AI. Umpan balik per jawaban terlihat mahasiswa bila opsi tinjauan kuis **Umpan balik spesifik** aktif.

## 5. Pengaturan penting

| Pengaturan | Bawaan | Keterangan |
|---|---|---|
| Sapaan | "Anda" | Disimpan per mata kuliah |
| Aturan umum dosen | Aturan tugas repositori | Berlaku untuk semua tugas di satu mata kuliah. Aturan kunci lebih diutamakan |
| Konsensus (pemeriksaan silang) | Aktif di OpenRouter | Butir yang dipotong atau diragukan diperiksa model keluarga lain tanpa melihat keputusan pertama. Model ketiga memutus bila berbeda |
| Isi juga kolom nilai | Mati | Bila mati, hanya umpan balik yang disimpan |
| Kirim notifikasi | Mati | |
| Timpa | Mati | Umpan balik yang ditulis dosen secara manual tidak tertimpa |

Pengaturan bertanda ◆ disimpan per mata kuliah. Kunci layanan, token, dan model berlaku untuk semua mata kuliah.

## 6. Model dan biaya

Model bawaan untuk OpenRouter tercantum di `BAWAAN` di awal skrip, dan harga acuannya ada di [harga-model.json](harga-model.json). Harga dan ketersediaan model berubah. Jalankan Diagnosa sebelum semester dimulai, dan bandingkan beberapa model pada karya yang sama dengan fitur **Bandingkan model** sebelum memilih. Untuk layanan lain, isi model penilai di Pengaturan.

## 7. Privasi

Ringkasan: nama, email, dan nilai dari Moodle tidak dikirim. NPM dan akun GitHub pada nama repositori dan di dalam berkas disamarkan. Isi tugas dan tangkapan layar dikirim apa adanya. Rincian ada di [dokumen/03-pelindungan-data.md](../../dokumen/03-pelindungan-data.md).

## 8. Fungsi untuk pengujian

Skrip dapat dimuat di Node.js (`require('./periksa-tugas-ai.user.js')`). Bagian logika penilaian diekspor lewat objek uji, dan dipakai ulang oleh [alat baris perintah](../cli/README.md).

## Perubahan versi 1.16.0

- Layanan AI apa pun yang kompatibel dengan OpenAI dapat dipakai lewat pengaturan Alamat API. Parameter yang ditolak layanan (misalnya `temperature` atau `max_tokens`) disesuaikan otomatis.
- NPM dan akun GitHub disamarkan pada nama repositori, tautan, nama berkas gambar, dan isi berkas sebelum dikirim ke AI. Nama asli tetap dipakai pada umpan balik untuk mahasiswa.
- Modul PDF ditolak dengan pesan, karena teksnya tidak dapat dibaca andal tanpa pustaka PDF.
- Kepala skrip dan contoh perintah tidak lagi terikat pada satu perguruan tinggi.
