# Panduan Adopsi untuk Mata Kuliah Baru

Panduan ini menyusun langkah dari sebelum semester sampai evaluasi akhir. Satu mata kuliah cukup memulai dari satu tugas, lalu menambah tugas lain setelah kunci pertama terkalibrasi.

## 0. Pilih cara memakai

| Keadaan Anda | Pakai |
|---|---|
| LMS Moodle, tugas berupa tautan repositori GitHub atau kuis uraian | Panel Moodle ([alat/moodle](../alat/moodle/README.md)) |
| LMS lain (Google Classroom, Canvas, Edmodo, LMS kampus) atau kiriman berupa berkas | Alat baris perintah ([alat/cli](../alat/cli/README.md)) |
| Anda sudah memakai agen AI di komputer atau langganan antarmuka obrolan | Alat baris perintah dengan mode agen ([agen/README.md](../agen/README.md)) |

Kebutuhan dasar: Node.js 18 atau lebih baru untuk alat baris perintah, Python 3.10 atau lebih baru untuk skrip audit, dan Git bila kiriman berupa repositori.

## 1. Sebelum semester

1. Tetapkan label AI setiap tugas di RPS (lampiran RPS di [kebijakan/01](../kebijakan/01-adendum-kontrak-dan-pengumuman.md)). Bila ragu, mulai dengan AI 1.
2. Pilih layanan AI. Periksa ketentuan datanya: penyedia tidak boleh menyimpan atau memakai permintaan untuk melatih model. Di OpenRouter, alat mengirim `data_collection: "deny"` pada setiap permintaan. Untuk layanan lain, pastikan lewat kontrak atau pengaturan akun.
3. Pasang batas kredit pada kunci API (*API key*). Biaya satu kelas biasanya kecil, tetapi batas mencegah tagihan membengkak bila ada kesalahan.
4. Ajukan alat dan aliran datanya ke unit pengelola TI ([kebijakan/03](../kebijakan/03-surat-permohonan-unit-ti.md)).

## 2. Pertemuan pertama

1. Tayangkan pengumuman dan adendum kontrak ([kebijakan/01](../kebijakan/01-adendum-kontrak-dan-pengumuman.md)). Sebut data yang dikirim, hak tinjauan ulang, hak diperiksa tanpa AI, dan jenjang sanksi.
2. Minta mahasiswa memakai kode atau NPM sesuai ketentuan pengumpulan. Bila tugas memakai repositori, jelaskan pola nama repositori dan izinkan repositori privat dengan dosen sebagai kolaborator.
3. Bagikan templat LOG-AI untuk tugas AI 1 dan AI 2.

## 3. Setiap tugas

1. **Tulis kunci atau rubrik.** Mulai dari contoh di [contoh/kunci](../contoh/kunci) atau [contoh/rubrik](../contoh/rubrik). Panel Moodle dapat menyusun draf kunci dari modul. Agen AI juga dapat menyusunnya dari modul dengan skema di [skema/](../skema). Panduan menulis kunci ada di [04-kunci-dan-rubrik.md](04-kunci-dan-rubrik.md).
2. **Validasi.** Jalankan `node alat/cli/nilai.js cek kunci.json` sampai tidak ada galat.
3. **Kalibrasi pada 3–5 karya** yang beragam (bagus, sedang, bermasalah). Baca rincian butir, bukti, dan umpan balik. Perjelas kunci bila ada butir yang dinilai berbeda dari keputusan Anda, lalu ulangi pada karya yang sama.
4. **Nilai seluruh kelas.** Baca setiap umpan balik sebelum dikirim. Utamakan kiriman berstatus "ditahan" dan "cek dosen".
5. **Kirim ke LMS.** Panel Moodle menyimpan langsung ke kolom umpan balik. Alat baris perintah menulis `hasil/rekap.csv` dan satu berkas `.md` per kiriman untuk disalin atau diimpor ke LMS.
6. **Catat waktu terbit** umpan balik (selisih hari dari tenggat). Angka ini berguna untuk evaluasi.

## 4. Sebelum tugas berbobot pertama

Jalankan audit buta pada paling sedikit 20 karya acak ([audit/README.md](../audit/README.md)). Bila belum memenuhi ambang, saran nilai hanya dipakai sebagai bahan umpan balik, dan nilai ditetapkan dosen sendiri.

## 5. Selama semester

1. Audit 10% karya acak pada setiap tugas dengan `pilih_sampel.py --per-tugas`.
2. Layani permintaan tinjauan ulang dalam batas waktu yang diumumkan. Catat jumlahnya.
3. Dugaan pelanggaran label AI selalu didahului klarifikasi. Hasil alat tidak menjadi satu-satunya dasar keputusan.

## 6. Akhir semester

1. Sebar kuesioner mahasiswa ([kebijakan/04](../kebijakan/04-kuesioner-mahasiswa.md)).
2. Rangkum: jumlah tugas, waktu terbit rata-rata, hasil audit, jumlah tinjauan ulang, biaya layanan AI, dan hasil kuesioner.
3. Perbaiki kunci untuk semester berikutnya. Simpan kunci di repositori privat mata kuliah bila kunci memuat jawaban yang akan dipakai lagi.

## Penyimpanan berkas

| Berkas | Simpan di | Jangan |
|---|---|---|
| Kunci dan rubrik | Repositori privat mata kuliah | Repositori publik bila jawaban akan dipakai lagi |
| Kiriman mahasiswa, `hasil/`, `paket/`, `jawaban/` | Penyimpanan institusi | Repositori ini, layanan berbagi berkas publik |
| Peta identitas (`kode;npm;repo`) | Komputer dosen saja | Folder yang dibaca agen AI |
| Kunci API | Variabel lingkungan atau pengaturan peramban | Berkas yang di-*commit* |
| Lembar audit dan nilai terbit | Penyimpanan institusi | Repositori publik |
