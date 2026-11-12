# Alat Baris Perintah

Alat ini menilai kiriman yang sudah diunduh ke folder, dari LMS apa pun. Mesin penilaiannya sama dengan panel Moodle: alat memuat `../moodle/periksa-tugas-ai.user.js` sebagai pustaka dan menyajikan folder lokal seolah-olah repositori GitHub lewat [github-lokal.js](github-lokal.js).

Kebutuhan: Node.js 18 atau lebih baru. Git diperlukan bila kiriman berupa salinan repositori. Tidak ada paket npm yang perlu dipasang.

## Perintah

```bash
node alat/cli/nilai.js cek <kunci.json|rubrik.json>
node alat/cli/nilai.js siapkan <kunci.json|rubrik.json> <folder-kiriman> [--keluar paket]
node alat/cli/nilai.js nilai <kunci.json|rubrik.json> <folder-kiriman> [--jawaban jawaban] [--keluar hasil]
```

| Perintah | Fungsi |
|---|---|
| `cek` | Memvalidasi kunci atau rubrik |
| `siapkan` | Menulis paket permintaan untuk agen AI (`paket/<id>/prompt.md` dan gambar). Lihat [agen/README.md](../../agen/README.md) |
| `nilai` | Menilai seluruh kiriman. Dengan `--jawaban`, memakai jawaban JSON dari agen. Tanpa `--jawaban`, memanggil layanan AI lewat API |

## Bentuk folder kiriman

```
kiriman/                 kunci tugas: satu subfolder per kiriman
  A01/                   salinan repositori (git clone) atau isi berkas tugas
  A02/

jawaban-kuis/            rubrik satu soal: satu berkas per kiriman
  A01.txt
  A02.docx

jawaban-kuis/            rubrik beberapa soal: satu subfolder per kiriman
  A01/1.txt
  A01/2.txt
```

Pakai kode anonim sebagai nama folder atau berkas. Kode tidak dikirim ke AI. Jawaban diterima dalam `.txt`, `.md`, atau `.docx`. PDF ditolak dengan pesan. Ubah dulu ke `.txt`.

## Opsi

| Opsi | Fungsi |
|---|---|
| `--keluar <folder>` | Folder keluaran. Bawaan `paket` untuk `siapkan` dan `hasil` untuk `nilai` |
| `--jawaban <folder>` | Folder jawaban agen (`<id>.json`) |
| `--modul <berkas>` | Teks modul (`.docx`, `.md`, `.txt`) sebagai acuan AI |
| `--aturan <berkas>` | Aturan umum dosen, satu aturan per baris |
| `--identitas <csv>` | Peta `kode;npm;repo` untuk cek `repo` dan pola `{NPM}`. Hanya dibaca di komputer dosen. NPM dan akun disamarkan sebelum dikirim |
| `--batas <waktu>` | Batas waktu ISO, misalnya `2026-10-05T23:59:00+08:00`, untuk `versi_dinilai: "sebelum_batas"` |
| `--sapaan <kata>` | `Anda` (bawaan) atau `kamu` |
| `--hanya <kode,...>` | Hanya kiriman dengan kode ini, misalnya untuk kalibrasi |

## Mode API

```bash
export AI_API_KEY=...                              # atau OPENROUTER_API_KEY
export AI_BASE_URL=https://openrouter.ai/api/v1    # bawaan; ganti untuk layanan lain
export AI_MODEL=...                                # wajib bila bukan OpenRouter
export AI_MODEL_JURI=""                            # kosongkan untuk menilai tanpa pemeriksaan silang
node alat/cli/nilai.js nilai kunci.json kiriman --hanya A01,A02,A03
```

Di Windows PowerShell, pakai `$env:AI_API_KEY = "..."`. Jangan menulis kunci di berkas yang di-*commit*.

| Variabel | Arti |
|---|---|
| `AI_API_KEY` | Kunci layanan AI |
| `AI_BASE_URL` | Alamat layanan kompatibel OpenAI, bawaan OpenRouter |
| `AI_MODEL` | Model penilai |
| `AI_MODEL_JURI` | Model pemeriksa kedua dan ketiga, dipisah koma. Bawaan OpenRouter memakai dua model keluarga lain. Untuk layanan lain bawaannya kosong (satu model) |
| `AI_PARALEL` | Jumlah kiriman yang dinilai bersamaan, bawaan 3 |

## Hasil

| Berkas | Isi |
|---|---|
| `hasil/<kode>.md` | Status, saran nilai, umpan balik untuk mahasiswa, rincian butir, dan catatan untuk dosen |
| `hasil/<kode>.json` | Data lengkap untuk diolah lebih lanjut |
| `hasil/rekap.csv` | Satu baris per kiriman, pemisah titik koma, siap dibuka di spreadsheet |

| Status | Arti |
|---|---|
| siap dibaca dosen | Tidak ada tanda khusus. Tetap dibaca sebelum dikirim |
| cek dosen | Ada bukti yang dibatalkan program atau butir yang perlu diputuskan dosen |
| ditahan | Berkas, jawaban, atau gambar identik dengan kiriman lain |
| templat | Dinilai tanpa AI, misalnya kiriman kosong atau bentuk tidak sesuai |
| gagal | Jawaban agen belum ada atau bukan JSON, atau panggilan API gagal. Ulangi untuk kode itu dengan `--hanya` |

Saran nilai dihitung program dari butir. Dosen menetapkan nilai akhir dan menyalin umpan balik ke LMS.
