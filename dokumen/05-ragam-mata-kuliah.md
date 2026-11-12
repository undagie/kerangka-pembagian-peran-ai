# Penerapan pada Ragam Mata Kuliah

Kerangka ini lahir dari praktikum pemrograman, tetapi pembagian perannya berlaku untuk mata kuliah lain. Yang berubah adalah jenis acuan dan bagian yang dapat dicek program.

| Bentuk tugas | Acuan | Yang dicek program | Yang dinilai AI | Yang tetap di tangan dosen |
|---|---|---|---|---|
| Kode dalam repositori | Kunci tugas | Berkas wajib, berkas terlarang, nama repositori, commit, pola isi kode | Kebenaran logika, mutu penjelasan, tangkapan layar keluaran | Keputusan nilai dan dugaan pelanggaran |
| Laporan praktikum (teks atau .docx) | Rubrik uraian, satu soal per bagian laporan | Jawaban kosong, kutipan bukti, laporan identik | Kelengkapan tujuan, metode, analisis, kesimpulan | Kebenaran data hasil pengamatan |
| Esai argumentatif | Rubrik uraian | Kutipan bukti, esai identik | Tesis, argumen, bukti, sanggahan | Orisinalitas gagasan dan klarifikasi |
| Soal uraian kuis | Rubrik uraian | Kutipan bukti, jawaban identik, jawaban kosong | Gagasan inti setiap butir | Butir yang ditandai cek dosen |
| Hitungan atau pembuktian | Rubrik uraian dengan `"kutipan": false` pada butir hasil | Jawaban kosong, jawaban identik | Langkah dan hasil | Butir yang meragukan |
| Desain, gambar, atau proyek visual | Kunci tugas dengan `gambar.maks` | Jumlah gambar, berkas wajib | Unsur yang harus terlihat | Penilaian estetika |
| Presentasi atau tanya jawab | Kriteria `sumber: "lms"` | Tidak ada | Tidak ada | Seluruhnya |

## Contoh rubrik laporan praktikum

Pecah laporan menjadi bagian. Setiap bagian menjadi satu soal dengan slot sendiri. Mahasiswa mengumpulkan satu folder berisi `1.txt`, `2.txt`, dan seterusnya, atau dosen memecah laporan ke berkas itu. Contoh lengkap: [contoh/rubrik/Laporan_Praktikum_Contoh.json](../contoh/rubrik/Laporan_Praktikum_Contoh.json).

```json
{
  "judul": "Laporan Praktikum 3",
  "soal": [
    { "slot": 2, "nama": "Analisis", "maks": 30, "butir": [
      { "id": "L2a", "label": "Membandingkan dengan teori", "teks": "Membandingkan hasil pengamatan dengan nilai teori", "poin": 15 },
      { "id": "L2b", "label": "Menjelaskan sumber galat", "teks": "Menyebut paling sedikit satu sumber galat yang masuk akal", "poin": 15 } ] }
  ]
}
```

## Kiriman yang bukan repositori

Alat baris perintah tetap dapat membaca folder berkas biasa tanpa Git. Satu subfolder untuk satu kiriman. Fakta commit tidak tersedia, jadi jangan memakai cek `commit:` dan `tanpaweb` pada kunci untuk kiriman seperti ini.

Jawaban uraian diterima dalam bentuk `.txt`, `.md`, atau `.docx`. Berkas PDF belum dapat dibaca sebagai teks. Ubah dulu ke `.txt`, misalnya dengan `pdftotext`, atau minta mahasiswa mengumpulkan `.docx`.

## Mengunduh kiriman dari LMS

Sebagian besar LMS dapat mengunduh semua kiriman dalam satu arsip. Ekstrak arsipnya, lalu ganti nama setiap folder atau berkas menjadi kode anonim (misalnya `A01`, `A02`). Simpan peta kode ke NPM di berkas terpisah yang tidak dibaca agen AI. Untuk tugas repositori, salin repositori dengan `git clone` ke subfolder berkode.

## Mata kuliah dengan label AI 2

Pada tugas AI 2, mahasiswa boleh memakai AI untuk menghasilkan sebagian karya. Kunci sebaiknya menilai kemampuan memeriksa dan memperbaiki hasil AI, misalnya:

- LOG-AI memuat cara memeriksa hasil AI;
- bagian hasil AI ditandai;
- ada perbaikan yang dijelaskan, misalnya galat yang ditemukan dan cara memperbaikinya.

Butir seperti ini dapat dinilai AI dari README atau LOG-AI, lalu dikonfirmasi dosen lewat tanya jawab singkat.
