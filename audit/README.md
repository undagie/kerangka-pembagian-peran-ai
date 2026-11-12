# Audit Buta

Audit buta membandingkan nilai yang terbit (disusun dengan bantuan alat) dengan nilai yang diberikan dosen tanpa melihat saran alat. Audit menjawab satu pertanyaan: apakah saran nilai cukup dekat dengan penilaian dosen untuk dipakai pada tugas berbobot. Permendikbudristek Nomor 53 Tahun 2023 Pasal 26 ayat (2) meminta penilaian yang valid dan reliabel. Audit inilah buktinya.

Kedua skrip hanya memakai pustaka standar Python 3.10 atau lebih baru.

## Langkah

1. Siapkan daftar karya dengan kolom `kode;tugas;nilai_terbit`. Pakai kode anonim, misalnya kode dari `rekap.csv` alat baris perintah. Jangan memakai nama atau NPM. Contoh: [contoh/daftar-karya-tiruan.csv](contoh/daftar-karya-tiruan.csv).

2. Pilih sampel acak.

   ```bash
   python audit/pilih_sampel.py daftar-karya.csv --jumlah 20 --keluar audit-keluaran
   ```

   Pakai `--per-tugas 5` untuk mengambil jumlah yang sama dari setiap tugas. Seed bawaan 20261101 membuat pilihan dapat diulang. Catat seed yang Anda pakai di laporan.

3. Simpan `audit-keluaran/nilai_terbit_TERTUTUP.csv` di tempat yang tidak Anda buka selama menilai, atau minta rekan menyimpannya.

4. Nilai setiap karya di `lembar_audit.csv` dari karya aslinya, tanpa membuka umpan balik alat. Isi `nilai_dosen` dan, bila mau, `menit` (lama menilai). Pemisah desimal boleh koma.

5. Hitung kesesuaian.

   ```bash
   python audit/hitung_audit.py audit-keluaran/lembar_audit.csv audit-keluaran/nilai_terbit_TERTUTUP.csv --keluar hasil_audit.md
   ```

## Ukuran dan ambang bawaan

| Ukuran | Arti | Ambang bawaan | Opsi |
|---|---|---|---|
| MAE | Selisih mutlak rata-rata, dalam poin skala 0–100 | paling besar 5 | `--mae` |
| ICC(2,1) | Kesepakatan mutlak dua penilai (Shrout & Fleiss, 1979) | paling kecil 0,75 | `--icc` |
| Huruf mutu sama | Bagian karya yang huruf mutunya sama | paling kecil 0,9 (18 dari 20) | `--huruf` |

Laporan juga memuat bias, batas kesesuaian Bland-Altman, korelasi Pearson, ICC(3,1), kappa Cohen (biasa dan berbobot linear), dan selisih rata-rata per tugas. Interval kepercayaan 95% untuk MAE dan ICC(2,1) dihitung dengan bootstrap 2.000 ulangan.

Skala huruf mutu bawaan adalah `80:A,75:B+,70:B,65:C+,60:C,40:D,0:E`. Ganti dengan `--skala` sesuai peraturan akademik Anda.

## Membaca hasil

- MAE kecil tetapi bias besar (misalnya dosen selalu 4 poin lebih tinggi) menandakan kunci terlalu ketat atau terlalu longgar secara merata. Perbaiki bobot atau batas butir.
- ICC(3,1) tinggi tetapi ICC(2,1) rendah menandakan urutan karya sudah sama, tetapi besar nilainya bergeser. Penyebabnya sama dengan bias.
- Selisih besar pada sedikit karya biasanya berasal dari butir yang tidak dapat dibuktikan dari berkas. Pindahkan butir itu ke `sumber: "lms"` atau tambahkan `cek` program.
- Bila ambang belum terpenuhi, perjelas kunci lalu ulangi audit pada sampel baru, bukan sampel yang sama.

## Audit berjalan

Sesudah lolos audit awal, audit 10% karya acak pada setiap tugas dengan `--per-tugas`. Simpan setiap `hasil_audit.md` sebagai dokumen mutu mata kuliah.

## Data

Lembar audit dan berkas nilai terbit berisi nilai mahasiswa. Simpan di penyimpanan institusi, jangan diunggah ke repositori publik, dan jangan memetakan kode ke NPM di berkas yang sama. Berkas `.gitignore` repositori ini sudah mengecualikan `audit-keluaran/` dan `hasil_audit.md`.
