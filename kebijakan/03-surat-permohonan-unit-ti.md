# Surat Permohonan Penilaian Keamanan Informasi

**Catatan penyusun.** Panduan Penggunaan GenAI (Kemdiktisaintek, 2025) meminta pemasukan data mahasiswa ke layanan GenAI dinilai dan disetujui unit yang menangani keamanan informasi perguruan tinggi. Kirim surat ini sesudah pengumuman kepada mahasiswa tayang, supaya unit TI dapat melihat pemberitahuan yang sudah diberikan. Sesuaikan tabel aliran data dengan layanan AI yang benar-benar Anda pakai.

---

**[NAMA PERGURUAN TINGGI]**
**[NAMA UNIT PENGUSUL]**

Nomor : [……]
Lampiran : 1 berkas
Hal : Permohonan penilaian keamanan informasi alat bantu pemeriksaan tugas berbasis AI pada LMS

Yth. Kepala [unit pengelola teknologi informasi]
[Nama Perguruan Tinggi]
di [kota]

Dengan hormat,

Sejak [semester], kami memakai alat bantu berbasis kecerdasan artifisial (AI) untuk menyusun draf pemeriksaan dan umpan balik tugas pada [nama LMS], yaitu pada mata kuliah [daftar mata kuliah] di Program Studi [nama]. Alat ini mengirim isi tugas mahasiswa ke layanan AI di luar perguruan tinggi. Panduan Penggunaan GenAI pada Pembelajaran di Perguruan Tinggi (Kemdiktisaintek, 2025) meminta pemasukan data mahasiswa ke layanan GenAI dinilai dan disetujui unit yang menangani keamanan informasi. Karena itu, kami mengajukan alat ini untuk dinilai.

Aliran data alat kami ringkas sebagai berikut.

| Data | Diproses di | Tujuan | Pelindungan |
|---|---|---|---|
| Isi berkas tugas (kode, README, tangkapan layar) | [Layanan AI, misalnya OpenRouter dan penyedia model] ([lokasi, misalnya luar negeri]) | Draf status kriteria dan draf umpan balik | NPM pada nama repositori dan di dalam berkas disamarkan; [hanya penyedia yang tidak menyimpan atau melatih model dengan data permintaan]; batas kredit |
| Jawaban uraian kuis | [Layanan AI] | Draf status kriteria dan draf umpan balik | Sama dengan baris di atas |
| Nama, NPM, email, nilai | Peramban dosen saja | Mencocokkan identitas dan menyimpan hasil | Tidak dikirim ke layanan AI |
| Kunci layanan AI (*API key*) | Penyimpanan lokal peramban dosen | Memanggil layanan AI | Tidak disimpan di LMS atau repositori |
| Umpan balik | [Nama LMS] melalui akun dosen | Umpan balik kepada mahasiswa | Dibaca dosen sebelum dikirim; tanpa kata sandi tersimpan |

Kami memohon:

1. penilaian keamanan informasi atas alat dan aliran data di atas;
2. persetujuan tertulis atau rekomendasi pengaturan tambahan bila diperlukan;
3. pertimbangan agar alat ini, bila disetujui, dapat menjadi rujukan bagi dosen lain.

Mahasiswa telah diberi tahu secara tertulis melalui pengumuman LMS dan adendum kontrak perkuliahan, termasuk hak meminta pemeriksaan tanpa AI. Dokumentasi teknis alat terlampir. Kami bersedia memaparkan alat ini secara langsung pada waktu yang Bapak/Ibu tentukan.

Atas perhatian dan kerja samanya, kami ucapkan terima kasih.

[Kota], [tanggal]
[Jabatan],

[nama dan gelar]

Tembusan:
1. [Pimpinan bidang akademik];
2. [Dekan];
3. [Ketua Program Studi].

Lampiran: dokumen [pelindungan data](../dokumen/03-pelindungan-data.md) dan README alat versi [nomor versi].
