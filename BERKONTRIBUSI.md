# Berkontribusi

Terima kasih atas perbaikan Anda. Kontribusi dapat berupa perbaikan kode, contoh kunci untuk mata kuliah lain, templat kebijakan, atau terjemahan.

## Sebelum mengirim perubahan

1. Jalankan uji.

   ```bash
   npm test
   ```

   Perintah itu menjalankan `node --test uji/cli.test.js` dan `python -m unittest uji/audit_test.py`.

2. Bila `SKEMA_NILAI` atau `SKEMA_ESAI` di `alat/moodle/periksa-tugas-ai.user.js` berubah, buat ulang skema jawaban AI.

   ```bash
   npm run skema
   ```

3. Periksa daftar pelindungan data di bawah.

## Daftar pelindungan data

Perubahan tidak diterima bila memuat salah satu hal berikut.

- [ ] Nama, NPM, email, akun GitHub, atau foto mahasiswa, termasuk di contoh, uji, tangkapan layar, dan pesan *commit*.
- [ ] Kiriman mahasiswa sungguhan. Pakai kiriman tiruan di `contoh/kiriman-tiruan/`, dan tandai berkas tiruan dengan jelas.
- [ ] Hasil penilaian, daftar nilai, lembar audit, atau ekspor LMS.
- [ ] Kunci API, token, berkas `.env`, atau pengaturan lokal peramban dan agen.
- [ ] Kunci jawaban yang masih dipakai untuk tugas berbobot di kelas yang sedang berjalan.

## Contoh kunci dan rubrik

Contoh baru diletakkan di `contoh/kunci/` atau `contoh/rubrik/` dan harus lolos `node alat/cli/nilai.js cek`. Uji otomatis memeriksa semua contoh di kedua folder. Tulis judul yang menyebut mata kuliah dan pertemuannya, dan jangan menyebut nama dosen atau mahasiswa.

## Gaya bahasa

Dokumen ditulis dalam bahasa Indonesia baku sesuai EYD V:

- kalimat aktif dan langsung, paling panjang sekitar 35 kata;
- istilah asing dimiringkan pada pemakaian pertama, dan padanan Indonesia dipakai bila ada (unggah, tautan, umpan balik);
- tanpa tanda pisah panjang di umpan balik untuk mahasiswa;
- rujukan peraturan hanya yang sudah diverifikasi dan tercantum di `kebijakan/README.md`.

## Melaporkan masalah

Sertakan versi alat, LMS dan versinya, layanan AI, dan langkah untuk mengulang masalah. Jangan melampirkan data mahasiswa. Bila masalah hanya muncul pada kiriman tertentu, buat kiriman tiruan yang menunjukkan masalah yang sama.
