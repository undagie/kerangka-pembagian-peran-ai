# Pelindungan Data

Karya mahasiswa yang dinilai dengan bantuan AI dikirim ke layanan di luar perguruan tinggi. Dokumen ini menjelaskan data yang dikirim, data yang tidak dikirim, dan pengaturan yang menjaganya. Dasarnya adalah Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi dan Panduan Penggunaan GenAI (Kemdiktisaintek, 2025).

## Data yang dikirim dan tidak dikirim

| Data | Dikirim ke layanan AI? | Keterangan |
|---|---|---|
| Isi berkas tugas (kode, README, teks) | Ya | Diberi nomor baris supaya AI dapat menunjuk bukti |
| Tangkapan layar tugas | Ya, bila kunci meminta (`gambar.maks` lebih dari 0) | Gambar tidak dapat disamarkan. Isinya terkirim apa adanya |
| Jawaban uraian | Ya | Hanya teks jawaban, tanpa identitas |
| Nama, email, nilai dari LMS | Tidak | Dipakai di peramban atau komputer dosen saja |
| NPM | Tidak | Pada tugas repositori, NPM pada nama repositori dan di dalam berkas diganti `[NPM]` sebelum dikirim |
| Akun GitHub mahasiswa | Tidak | Diganti `[akun-github]` pada nama repositori dan tautan |
| Kode kiriman pada alat baris perintah | Tidak | Kode hanya menjadi nama berkas hasil |
| Nama atau identitas yang ditulis mahasiswa sendiri di berkas, gambar, atau jawaban | Ya | Program tidak mengenali nama orang. Minta mahasiswa tidak menulisnya kecuali diwajibkan |

Pemeriksaan yang memerlukan NPM, misalnya pola nama repositori `pt-{NPM}` atau pola `isi:` dengan `{NPM}`, dijalankan program di komputer dosen. Yang dikirim ke AI hanya hasilnya, misalnya "nama repositori sesuai pola: TERPENUHI".

## Pengaturan layanan AI

1. **OpenRouter.** Setiap permintaan memakai `provider.data_collection: "deny"`, sehingga hanya penyedia yang tidak menyimpan atau memakai data permintaan untuk melatih model yang dipilih. Bila model yang dipilih tidak punya penyedia seperti itu, permintaan ditolak. Ganti modelnya, jangan hapus pengaturan ini.
2. **Layanan lain yang kompatibel dengan OpenAI** (misalnya layanan AI kampus atau penyedia model langsung). Alat tidak dapat memaksakan pengaturan data. Pastikan ketentuan layanan atau kontrak menyatakan data tidak disimpan dan tidak dipakai untuk melatih model. Sebut layanan itu di pengumuman kepada mahasiswa.
3. **Model yang berjalan di komputer sendiri** (misalnya lewat server lokal yang kompatibel dengan OpenAI). Data tidak keluar dari komputer dosen. Mutu penilaian tetap harus dibuktikan dengan audit buta.
4. **Agen AI.** Agen membaca paket permintaan dan mengirimnya ke penyedia model agen itu. Aturannya sama dengan layanan AI lain. Periksa pengaturan data akun agen Anda, dan jangan biarkan agen membaca folder kiriman asli atau peta identitas. Lihat [agen/README.md](../agen/README.md).

## Pengiriman ke luar negeri

Sebagian besar penyedia model berada di luar negeri. UU 27/2022 meminta pengiriman data pribadi ke luar negeri disertai pelindungan yang memadai. Penyamaran identitas, pengaturan `data_collection: "deny"`, dan pemberitahuan tertulis kepada mahasiswa adalah bagian dari pelindungan itu. Keputusan akhirnya ada pada unit pengelola TI perguruan tinggi ([kebijakan/03](../kebijakan/03-surat-permohonan-unit-ti.md)).

## Repositori mahasiswa

NPM pada nama repositori publik dapat dibaca siapa pun. Izinkan repositori privat dengan akun dosen sebagai kolaborator. Token GitHub dosen perlu izin membaca repositori yang dibagikan kepadanya.

## Kunci dan token

- Panel Moodle menyimpan kunci API dan token GitHub di penyimpanan lokal peramban dosen, tidak di LMS.
- Alat baris perintah membaca kunci dari variabel lingkungan `AI_API_KEY`. Jangan menulis kunci di berkas yang di-*commit*. Berkas `.env*` dikecualikan oleh `.gitignore` repositori ini.
- Pasang batas kredit pada setiap kunci API.

## Hasil penilaian

Folder `hasil/`, `paket/`, dan `jawaban/` berisi karya dan nilai mahasiswa. Simpan di penyimpanan institusi dan hapus bila tidak diperlukan lagi. Jangan mengunggahnya ke repositori publik, termasuk *fork* repositori ini.

## Hak mahasiswa

Mahasiswa berhak tahu data yang dikirim, meminta tinjauan ulang langsung oleh dosen, dan meminta karyanya diperiksa tanpa AI. Hak ini dicantumkan di adendum kontrak ([kebijakan/01](../kebijakan/01-adendum-kontrak-dan-pengumuman.md)).

## Data untuk publikasi

Bila hasil penerapan dilaporkan dalam forum ilmiah, pakai data agregat saja, jangan menyebut nama atau NPM, dan minta persetujuan tertulis pimpinan sesuai ketentuan perguruan tinggi.
