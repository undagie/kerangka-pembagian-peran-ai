# Pembagian Peran AI dalam Penilaian Tugas

Kerangka terbuka untuk memeriksa tugas mahasiswa dengan bantuan AI tanpa menyerahkan keputusan kepada AI. Prinsipnya satu: **program untuk fakta, AI untuk draf berbukti, dosen untuk keputusan**.

- **Program** menghitung yang pasti: berkas ada atau tidak, nama dan lokasi persis, riwayat *commit*, berkas yang identik antarmahasiswa. Program juga memeriksa bukti AI dan menghitung nilai.
- **AI** memberi status setiap butir kunci beserta bukti: berkas dan baris, nomor gambar, atau kutipan persis dari jawaban.
- **Dosen** membaca setiap umpan balik, menetapkan nilai, dan memutuskan dugaan pelanggaran.

Kerangka ini berisi alat, templat kebijakan, skema, dan perangkat audit. Semuanya dapat dipakai untuk mata kuliah apa pun, LMS apa pun, dan layanan atau agen AI apa pun yang kompatibel dengan OpenAI Chat Completions.

## Isi repositori

| Folder | Isi |
|---|---|
| [alat/moodle](alat/moodle/README.md) | Panel *userscript* untuk Moodle: tugas repositori GitHub dan kuis uraian |
| [alat/cli](alat/cli/README.md) | Alat baris perintah untuk kiriman yang diunduh dari LMS mana pun, lewat API atau agen AI |
| [agen](agen/README.md) | Alur dan perintah siap tempel untuk agen AI |
| [kebijakan](kebijakan/README.md) | Templat adendum kontrak dan pengumuman, surat edaran, surat ke unit TI, kuesioner, daftar periksa kesiapan |
| [dokumen](dokumen) | Konsep, panduan adopsi, pelindungan data, menulis kunci, ragam mata kuliah, batasan |
| [skema](skema) | Skema JSON kunci, rubrik, dan jawaban AI |
| [audit](audit/README.md) | Pemilih sampel dan penghitung kesesuaian AI dengan dosen (MAE, ICC, kappa) |
| [contoh](contoh) | Contoh kunci dan rubrik, serta kiriman tiruan untuk uji |
| [uji](uji) | Uji otomatis |

## Mulai cepat

Kebutuhan: Node.js 18 atau lebih baru, Python 3.10 atau lebih baru (untuk audit), dan Git.

```bash
git clone https://github.com/undagie/kerangka-pembagian-peran-ai.git
cd kerangka-pembagian-peran-ai
npm test
```

Coba alat baris perintah pada kiriman tiruan:

```bash
node alat/cli/nilai.js cek contoh/kunci/P01_Dari_Python_ke_Cpp.json
node alat/cli/nilai.js siapkan contoh/kunci/P01_Dari_Python_ke_Cpp.json contoh/kiriman-tiruan/tugas-p01 --keluar paket
```

Buka `paket/A02/prompt.md`. Fakta program sudah tercatat di sana, misalnya `p01/hello.cpp: TIDAK ADA`. Tulis jawaban dengan agen AI ke `jawaban/`, lalu jalankan `nilai` dengan `--jawaban jawaban` ([agen/README.md](agen/README.md)). Atau isi `AI_API_KEY` dan jalankan `nilai` tanpa `--jawaban` ([alat/cli](alat/cli/README.md)).

## Jalur adopsi

1. Baca [konsep](dokumen/01-konsep.md) dan [batasan](dokumen/06-batasan.md).
2. Isi [daftar periksa kesiapan](kebijakan/05-daftar-periksa-kesiapan.md).
3. Ikuti [panduan adopsi](dokumen/02-panduan-adopsi.md): label AI di RPS, pengumuman kepada mahasiswa, kunci dan kalibrasi, audit buta, evaluasi akhir semester.
4. Untuk mata kuliah selain pemrograman, lihat [ragam mata kuliah](dokumen/05-ragam-mata-kuliah.md).

## Dasar kebijakan

Templat dan dokumen merujuk pada tiga sumber. Pertama, Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi. Kedua, Permendikbudristek Nomor 53 Tahun 2023 tentang Penjaminan Mutu Pendidikan Tinggi, Pasal 26 ayat (2) dan Pasal 27. Ketiga, Panduan Penggunaan GenAI pada Pembelajaran di Perguruan Tinggi (Kemdiktisaintek, 2025). Rinciannya ada di [kebijakan/README.md](kebijakan/README.md). Templat bukan nasihat hukum. Sesuaikan dengan peraturan perguruan tinggi Anda.

## Pelindungan data

Nama, email, dan nilai dari LMS tidak dikirim ke layanan AI. NPM dan akun GitHub disamarkan sebelum dikirim. Isi tugas dan tangkapan layar terkirim apa adanya. Di OpenRouter, setiap permintaan memakai `data_collection: "deny"`. Rinciannya ada di [dokumen/03-pelindungan-data.md](dokumen/03-pelindungan-data.md).

Jangan meng-*commit* kiriman mahasiswa, hasil penilaian, daftar nilai, peta identitas, atau kunci API ke repositori ini atau *fork*-nya.

## Kontribusi

Lihat [BERKONTRIBUSI.md](BERKONTRIBUSI.md). Agen AI yang bekerja di repositori ini mengikuti [AGENTS.md](AGENTS.md).

## Lisensi

Dibuat oleh Muhammad Edya Rosadi. Kode berlisensi MIT ([LICENSE](LICENSE)). Templat kebijakan dan dokumen berlisensi CC BY 4.0 ([LISENSI-DOKUMEN.md](LISENSI-DOKUMEN.md)).
