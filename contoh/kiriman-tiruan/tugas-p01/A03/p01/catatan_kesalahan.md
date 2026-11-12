# Catatan Kesalahan (kiriman tiruan untuk pengujian)

| Berkas | Jenis kesalahan | Pesan yang muncul | Cara saya mengetahuinya |
|---|---|---|---|
| k1_sintaks.cpp | Sintaks | error: expected ',' or ';' before 'std' | Build gagal dan berkas .exe tidak terbentuk |
| k2_nama.cpp | Nama belum dikenal | 'Nilai' was not declared in this scope | Compiler menunjuk baris yang memakai Nilai |
| k3_runtime.cpp | Runtime | tidak ada pesan compiler | Program berhenti saat jumlah mahasiswa diisi 0 |
| k4_logika.cpp | Logika | tidak ada pesan | Hasilnya 81, padahal versi Python mencetak 81.67 |

Kesalahan yang paling berbahaya adalah kesalahan logika, karena tidak ada pesan yang memperingatkan.
