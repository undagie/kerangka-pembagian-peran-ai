# Batasan

Batasan berikut perlu diketahui sebelum alat dipakai dan perlu disebut jujur dalam laporan.

## Penilaian

- **AI membaca kode, tidak menjalankannya.** Perkiraan galat kompilasi atau keluaran program adalah perkiraan. Tinjau butir seperti ini saat kalibrasi.
- **Kasus batas dapat berbeda bila dinilai ulang.** Butir yang dicek program selalu sama. Butir yang dinilai AI pada kasus batas dapat berubah. Makin tegas rumusan butir, makin kecil perbedaannya.
- **Mode satu agen tidak punya pemeriksaan silang.** Pada mode agen (`--jawaban`), setiap butir dinilai satu model. Program tetap memeriksa bukti dan fakta, tetapi pemeriksaan silang antarmodel tidak terjadi. Catatan dosen menyebutnya.
- **Saran nilai belum teruji sebelum audit.** Tanpa audit buta, tidak ada bukti bahwa saran nilai cukup dekat dengan penilaian dosen untuk mata kuliah Anda.
- **Berkas besar dipotong.** Setiap berkas dipotong sampai batas karakter tertentu sebelum dikirim ke AI. Berkas wajib dan README mendapat batas lebih besar. Cek `isi:` selalu membaca berkas utuh.

## Kemiripan

- **Hanya yang identik.** Program mencocokkan berkas dan gambar yang sama persis, bukan parafrase atau kode yang diubah nama variabelnya.
- **Bukan pendeteksi AI.** Alat tidak menilai apakah karya ditulis dengan AI. Alat pendeteksi teks AI belum akurat dan tidak boleh menjadi satu-satunya dasar keputusan (Panduan GenAI, 2025).

## Data

- **Gambar tidak disamarkan.** Tangkapan layar yang memuat nama atau NPM terkirim apa adanya.
- **Nama di dalam berkas tidak disamarkan.** Program menyamarkan NPM dan akun GitHub, tetapi tidak mengenali nama orang.
- **PDF belum dibaca.** Modul dan jawaban PDF ditolak dengan pesan. Ubah ke `.txt` atau `.docx`.
- **Isi arsip tidak dibaca.** Berkas di dalam `.zip`, folder *submodule*, atau dokumen pengganti berkas kode dianggap tidak ada, dan kiriman diberi templat bentuk tidak sesuai.

## Teknis

- **Panel Moodle bergantung pada layanan web Moodle** (`lib/ajax/service.php`). Panel dikembangkan dan dipakai pada Moodle perguruan tinggi asal. Versi Moodle lain dan tema yang sangat berbeda belum diuji, jadi jalankan Diagnosa dan periksa beberapa kiriman lebih dulu.
- **Penyimpanan peramban terbatas** sekitar 5 MB per situs. Hapus hasil tersimpan untuk tugas lama.
- **Batas laju GitHub.** Tanpa token, GitHub membatasi 60 permintaan per jam per alamat IP. Pakai token baca saja untuk kelas besar.
- **Layanan selain OpenRouter** tidak memakai fitur khusus OpenRouter: pemilihan penyedia, laporan biaya, dan pemantau harga. Kolom biaya di hasil kosong.

## Bukti dampak

Bukti dari perguruan tinggi asal berasal dari satu semester, sedikit mata kuliah, dan dosen yang sama dengan pengembang alat. Ulangi audit buta dan kuesioner di mata kuliah Anda sebelum mengklaim hasil yang sama.
