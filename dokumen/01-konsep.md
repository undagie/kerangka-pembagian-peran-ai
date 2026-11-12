# Konsep: Pembagian Peran Program, AI, dan Dosen

Kerangka ini memakai satu prinsip: **program untuk fakta, AI untuk draf berbukti, dosen untuk keputusan**. Setiap pekerjaan penilaian diberikan kepada pihak yang paling dapat dipertanggungjawabkan untuk pekerjaan itu.

| Pekerjaan | Dikerjakan | Alasan |
|---|---|---|
| Berkas ada atau tidak, nama dan lokasi persis, berkas terlarang, jumlah dan cara *commit*, berkas identik antarmahasiswa | Program | Hasilnya pasti dan selalu sama. AI dilarang membantah fakta ini. |
| Status setiap butir kunci beserta bukti (berkas dan baris, nomor gambar, atau kutipan jawaban) | AI | Membaca isi karya dan menilai makna adalah kekuatan AI. Bukti membuat setiap klaim dapat diperiksa. |
| Memeriksa bukti AI: kutipan harus benar-benar ada, klaim kesalahan harus menunjuk baris dan aturan kunci | Program | Klaim tanpa bukti dibatalkan secara otomatis. |
| Menghitung nilai dari poin butir | Program | Angka selalu cocok dengan rincian yang dibaca mahasiswa. |
| Membaca umpan balik, menyunting, menetapkan nilai, memutuskan dugaan pelanggaran | Dosen | Panduan GenAI (Kemdiktisaintek, 2025) menegaskan AI tidak menjadi pengambil keputusan yang menyangkut manusia. |

## Alur satu tugas

```
Kunci atau rubrik tertulis (sama untuk semua kelas)
        │
        ▼
Program membaca kiriman ──► fakta pasti (berkas, commit, kemiripan)
        │                         │
        │      kiriman bermasalah ─┴─► templat tanpa AI (tidak mengumpulkan, unggah web, bentuk tidak sesuai)
        ▼
AI menilai setiap butir dengan bukti   (identitas disamarkan, fakta program tidak boleh dibantah)
        │
        ▼
Program memeriksa bukti, menghitung nilai, menahan kiriman yang identik
        │
        ▼
Dosen membaca, menyunting, menetapkan nilai ──► LMS
        │
        ▼
Audit buta pada sampel acak (MAE, ICC, huruf mutu sama)
```

## Mekanisme yang menjaga mutu

1. **Satu kunci untuk semua.** Kunci memuat kriteria, butir berpoin, berkas wajib, kunci jawaban, dan aturan tambahan. Kunci yang sama dipakai untuk seluruh kelas paralel. Ini menjawab tuntutan penilaian yang berkeadilan dan objektif pada Permendikbudristek 53/2023 Pasal 26 ayat (2).
2. **Butir berpoin.** Setiap kriteria dipecah menjadi butir yang terpenuhi atau tidak. Tidak ada "setengah nilai" yang ditebak AI.
3. **Cek program.** Butir yang dapat dihitung diberi `cek` (misalnya `ada:p01/hello.cpp` atau `isi:**/*.py~def rerata`). Hasil program mengalahkan jawaban AI.
4. **Bukti wajib.** AI harus menyebut berkas dan baris, nomor gambar, atau kutipan persis. Kutipan uraian dicocokkan program dengan jawaban asli. Butir dengan kutipan palsu dibatalkan dan kiriman ditandai "cek dosen".
5. **Pemeriksaan silang (pilihan).** Butir yang dipotong atau diragukan diperiksa model dari keluarga lain tanpa melihat keputusan pertama. Model ketiga memutus bila keduanya berbeda. Panel model yang beragam lebih dekat dengan penilaian manusia dan mengurangi bias satu model (Verga dkk., 2024).
6. **Kemiripan dihitung program.** Berkas yang wajib karya sendiri dan tangkapan layar yang byte-nya sama dibandingkan antarmahasiswa. Kiriman yang identik ditahan sampai dosen memutuskan. AI tidak diminta menebak apakah karya ditulis AI, karena alat pendeteksi teks AI belum akurat (Panduan GenAI, 2025).
7. **Templat tanpa AI.** Kiriman kosong, tautan rusak, berkas dalam zip, atau unggahan lewat web diberi templat tetap, sehingga AI tidak menilai sesuatu yang tidak ada.
8. **Gaya umpan balik.** Pembersih otomatis membuang emoji, tanda pisah panjang, basa-basi, dan permintaan kumpul ulang. Umpan balik formatif ditulis sebagai masukan untuk tugas berikutnya, sesuai Pasal 27 ayat (2).
9. **Audit buta.** Sebelum saran nilai dipakai untuk tugas berbobot, dosen menilai sendiri sampel acak tanpa melihat saran alat. Ukurannya MAE, ICC(2,1), dan kesamaan huruf mutu. Lihat [audit/README.md](../audit/README.md).

## Tiga cara memakai

| Cara | Cocok untuk | Yang dipakai |
|---|---|---|
| Panel di Moodle | Dosen yang LMS-nya Moodle dan tugasnya berupa tautan repositori GitHub atau kuis uraian | [alat/moodle](../alat/moodle/README.md) |
| Alat baris perintah dengan API | LMS apa pun. Kiriman diunduh ke folder, dinilai lewat layanan AI yang kompatibel dengan OpenAI | [alat/cli](../alat/cli/README.md) |
| Alat baris perintah dengan agen AI | Dosen yang memakai agen AI (Claude Code, Codex, Gemini CLI, GitHub Copilot, atau antarmuka obrolan) | [agen/README.md](../agen/README.md) |

Ketiga cara memakai mesin penilaian yang sama. Alat baris perintah memuat skrip Moodle sebagai pustaka dan menyajikan folder lokal seolah-olah repositori GitHub, sehingga fakta yang dihitung sama persis.

## Kebijakan yang menyertai

Alat tidak berdiri sendiri. Mahasiswa perlu tahu label AI setiap tugas, data yang dikirim, dan hak mereka. Label AI 0, AI 1, dan AI 2 adalah penyederhanaan tiga tingkat dari gagasan skala asesmen AI (Perkins dkk., 2024). Templat dokumennya ada di [kebijakan/](../kebijakan/README.md): adendum kontrak dan pengumuman, surat edaran institusi, surat ke unit TI, kuesioner, dan daftar periksa kesiapan.

## Rujukan

- Kementerian Pendidikan Tinggi, Sains, dan Teknologi. (2025). *Panduan penggunaan generative artificial intelligence (GenAI) pada pembelajaran di perguruan tinggi* (Ed. ke-1, cet. ke-2).
- Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 53 Tahun 2023 tentang Penjaminan Mutu Pendidikan Tinggi.
- Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.
- Perkins, M., Furze, L., Roe, J., & MacVaugh, J. (2024). The Artificial Intelligence Assessment Scale (AIAS): A framework for ethical integration of generative AI in educational assessment. *Journal of University Teaching and Learning Practice, 21*(6).
- Shrout, P. E., & Fleiss, J. L. (1979). Intraclass correlations: Uses in assessing rater reliability. *Psychological Bulletin, 86*(2), 420–428.
- Verga, P., Hofstätter, S., Althammer, S., Su, Y., Piktus, A., Arkhangorodsky, A., Xu, M., White, N., & Lewis, P. (2024). *Replacing judges with juries: Evaluating LLM generations with a panel of diverse models* (arXiv:2404.18796).
