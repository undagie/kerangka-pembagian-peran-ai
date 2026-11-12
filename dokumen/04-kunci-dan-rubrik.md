# Menulis Kunci dan Rubrik

Ada dua jenis acuan penilaian.

| Jenis | Untuk | Skema | Contoh |
|---|---|---|---|
| Kunci tugas | Tugas berupa repositori atau folder berkas (kode, README, tangkapan layar) | [skema/kunci-tugas.schema.json](../skema/kunci-tugas.schema.json) | [contoh/kunci](../contoh/kunci) |
| Rubrik uraian | Jawaban teks: soal uraian kuis, esai, laporan singkat | [skema/rubrik-uraian.schema.json](../skema/rubrik-uraian.schema.json) | [contoh/rubrik](../contoh/rubrik) |

Alat mengenali jenisnya sendiri: berkas yang berisi daftar `soal` dianggap rubrik. Periksa setiap acuan dengan:

```bash
node alat/cli/nilai.js cek acuan.json
```

## Kunci tugas

### Kolom utama

| Kolom | Isi |
|---|---|
| `judul`, `label_ai` | Identitas tugas dan labelnya, misalnya `"AI 1 (Kuning)"` |
| `folder_fokus` | Folder tugas di dalam repositori, misalnya `"p01"`. Folder pertemuan lain diabaikan |
| `folder_cadangan` | Folder lain yang dibaca hanya bila berkas wajib tidak ditemukan di folder fokus |
| `pola_nama_repo` | Misalnya `"pt-{NPM}"`. Dicocokkan program dengan NPM, tidak dikirim ke AI |
| `berkas_wajib`, `berkas_terlarang` | Jalur atau pola *glob*, misalnya `"p01/hello.cpp"`, `"**/*.exe"` |
| `versi_dinilai` | `"terakhir"` atau `"sebelum_batas"` (commit terakhir sebelum batas waktu) |
| `tolak_unggah_web` | `true` (bawaan): kiriman yang commit terakhirnya di folder tugas dibuat lewat web GitHub diminta dikumpulkan ulang |
| `izinkan_web_dokumen` | `true` bila README, dokumen, dan tangkapan layar boleh diunggah lewat web |
| `perintah_build` | Perintah build sebagai konteks. AI membaca kode, tidak menjalankannya |
| `gambar` | `{ "maks": 4, "keterangan": "apa yang harus terlihat" }`. `maks` 0 berarti gambar tidak dibaca |
| `kunci_jawaban` | Fakta benar yang spesifik: keluaran persis, konstruksi wajib, kesalahan umum |
| `aturan_tambahan` | Aturan khusus tugas ini. Aturan kunci mengalahkan aturan umum dosen |
| `kemiripan` | Berkas yang wajib karya sendiri dan tindakan bila identik |
| `kriteria` | Daftar aspek penilaian dengan butir berpoin |

### Butir berpoin

Pecah setiap kriteria menjadi butir yang terpenuhi atau tidak. Poin kriteria adalah jumlah poin butir yang terpenuhi. Total poin kriteria `sumber: "repo"` sebaiknya 100. Total lain tetap diterima, tetapi nilai dikonversi ke skala 100.

```json
{
  "id": "K4", "aspek": "Git dan deklarasi AI", "bobot": 10,
  "butir": [
    { "id": "K4a", "teks": "Berkas tersimpan di p02/sinilai.cpp", "poin": 3, "cek": "ada:p02/sinilai.cpp" },
    { "id": "K4b", "teks": "Pesan commit untuk P02 bermakna", "poin": 3 },
    { "id": "K4c", "teks": "LOG-AI atau pernyataan tanpa AI ada di README", "poin": 4 }
  ]
}
```

- `teks` tampil ke mahasiswa sebagai "Belum terpenuhi: … (3 poin)". Tulis singkat dan konkret.
- Satu butir berisi satu gagasan. Gagasan yang dapat sebagian benar dipecah menjadi dua butir.
- Kriteria yang dinilai di luar repositori (presentasi, tanya jawab) diberi `"sumber": "lms"`. Kriteria itu tidak dinilai alat.

### Cek program

Butir yang dapat dihitung diberi `cek`. Hasil program mengalahkan jawaban AI dan selalu sama setiap kali diperiksa. Beberapa syarat digabung dengan titik koma, dan semuanya harus terpenuhi.

| Cek | Terpenuhi bila |
|---|---|
| `ada:<glob>` | Berkas ada dengan nama dan lokasi persis (huruf besar dan kecil dibedakan) |
| `tanpa:<glob>` | Tidak ada berkas yang cocok, misalnya `tanpa:**/*.exe` |
| `gitignore:<pola>` | `.gitignore` di akar memuat baris itu |
| `folder:<nama>` | Folder dengan nama persis ada |
| `isi:<glob>~<regex>` | Ada berkas yang cocok dan isinya memuat regex. Tulis `/.../i` untuk mengabaikan huruf besar dan kecil. `{NPM}` dicocokkan di komputer dosen |
| `commit:<n>` | Repositori punya paling sedikit n commit |
| `gambar:<n>` | Paling sedikit n gambar untuk tugas ini |
| `readmegambar:<n>` | README menampilkan paling sedikit n gambar untuk tugas ini |
| `repo` | Nama repositori sesuai `pola_nama_repo` |
| `tanpaweb` | Tidak ada commit lewat web GitHub di folder tugas |

Bila `isi:` tidak menemukan berkas yang cocok, butir diserahkan ke AI, karena keberadaan berkas dinilai di butir struktur (`ada:`). Pakai pola longgar seperti `**/Kartu*.java` supaya salah ketik kecil tetap terbaca.

Pada alat baris perintah, `repo` dan `{NPM}` memerlukan peta identitas (`--identitas`). Tanpa peta itu, butir yang memakainya diserahkan ke AI tanpa data nama repositori.

### Kemiripan

```json
"kemiripan": {
  "berkas": ["p01/catatan_kesalahan.md"],
  "tindakan": "tahan",
  "kalimat": "Isi {berkas} sama persis dengan kiriman mahasiswa lain, padahal bagian ini harus dikerjakan sendiri."
}
```

Masukkan hanya berkas yang wajib karya sendiri, misalnya catatan, refleksi, atau jawaban esai. Kode awal dari modul wajar mirip, jadi jangan dimasukkan. `tindakan: "tahan"` menahan kiriman sampai dosen memutuskan. Tangkapan layar yang byte-nya sama juga dibandingkan, kecuali `"gambar": false`.

## Rubrik uraian

```json
{
  "judul": "Kuis 2",
  "aturan_umum": ["Ejaan dan tata bahasa tidak dinilai."],
  "soal": [{
    "slot": 1, "nama": "U1 Sampel acak", "maks": 10,
    "teks": "Jelaskan pengertian sampel acak sederhana dan beri satu contoh.",
    "jawaban_ideal": "…",
    "butir": [
      { "id": "U1a", "label": "Peluang terpilih sama", "teks": "Menyebut bahwa setiap anggota populasi punya peluang yang sama untuk terpilih", "poin": 4 }
    ],
    "aturan": ["U1a: rumusan 'kesempatan yang sama' diterima."]
  }]
}
```

- `maks` harus sama dengan jumlah poin butir. Di Moodle, `slot` dan `maks` harus sama dengan soal di kuis.
- `label` (3 sampai 8 kata) tampil ke mahasiswa. `teks` adalah kriteria lengkap untuk AI.
- Untuk butir yang terpenuhi, AI wajib mengutip jawaban. Program memeriksa kutipan itu benar-benar ada. Pakai `"kutipan": false` untuk butir yang dinilai menyeluruh, misalnya hasil hitungan.
- Rumuskan butir dari gagasan inti, bukan kata tertentu. Tulis rumusan lain yang diterima di `aturan`.
- Jawaban kosong diberi 0 tanpa AI. Jawaban yang identik antarmahasiswa ditahan.

## Aturan umum dosen

Aturan yang berlaku untuk semua tugas di satu mata kuliah ditulis sekali. Di panel Moodle, aturan ini ada di kotak Aturan umum dosen. Di alat baris perintah, tulis satu aturan per baris di berkas teks lalu pakai `--aturan aturan.txt`. Contoh aturan yang sering dipakai:

1. Beda spasi atau format kecil pada keluaran diabaikan bila nilainya benar.
2. Kesalahan kecil yang tidak mengubah hasil cukup menjadi masukan.
3. Deklarasi AI dinilai ada atau tidaknya. Mengaku memakai AI tidak menurunkan nilai, tetapi dicatat untuk dosen.
4. Pesan commit bermakna bila menyebut pekerjaan atau pertemuannya.

## Kalibrasi

Kunci yang baik lahir dari kalibrasi, bukan dari draf pertama.

1. Nilai 3–5 karya yang beragam.
2. Untuk setiap butir yang hasilnya berbeda dari keputusan Anda, cari penyebabnya: teks butir terlalu umum, kunci jawaban kurang, atau butir sebenarnya dapat dicek program.
3. Perbaiki kunci, lalu nilai ulang karya yang sama sampai sesuai.
4. Simpan kunci akhir dan pakai untuk seluruh kelas paralel.
