"""Uji perangkat audit. Jalankan dari akar repositori: python -m unittest uji/audit_test.py"""
import csv
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(AKAR / "audit"))

import hitung_audit as ha  # noqa: E402
import pilih_sampel as ps  # noqa: E402


class UjiHitung(unittest.TestCase):
    def test_icc_selisih_tetap(self):
        # Dosen selalu 5 poin di atas: konsistensi sempurna, kesepakatan mutlak turun.
        icc2, icc3 = ha.icc([(10, 15), (20, 25), (30, 35)])
        self.assertAlmostEqual(icc2, 0.8889, places=4)
        self.assertAlmostEqual(icc3, 1.0, places=6)

    def test_icc_sama_persis(self):
        icc2, icc3 = ha.icc([(60, 60), (70, 70), (80, 80), (90, 90)])
        self.assertAlmostEqual(icc2, 1.0)
        self.assertAlmostEqual(icc3, 1.0)

    def test_huruf_dan_kappa(self):
        skala = ha.baca_skala(ha.SKALA_BAWAAN)
        self.assertEqual(ha.huruf(80, skala), "A")
        self.assertEqual(ha.huruf(79.9, skala), "B+")
        self.assertEqual(ha.huruf(10, skala), "E")
        kategori = [h for _, h in skala]
        self.assertAlmostEqual(ha.kappa(["A", "B", "C"], ["A", "B", "C"], kategori), 1.0)

    def test_hitung_lulus_dan_gagal(self):
        skala = ha.baca_skala(ha.SKALA_BAWAAN)
        dekat = [(f"K{i}", "T1", 50 + i * 2, 50 + i * 2 + (1 if i % 2 else -1), 3) for i in range(20)]
        h = ha.hitung(dekat, skala, 5, 0.75, 0.9)
        self.assertLess(h["mae"], 5)
        jauh = [(f"K{i}", "T1", 50 + i * 2, 50 + i * 2 + 15, None) for i in range(20)]
        h2 = ha.hitung(jauh, skala, 5, 0.75, 0.9)
        self.assertFalse(h2["lulus"])
        self.assertIn("belum memenuhi", ha.laporan(h2, 5, 0.75, 0.9))


class UjiPilih(unittest.TestCase):
    def test_seed_sama_hasil_sama_dan_per_tugas(self):
        karya = [{"kode": f"K{i:02d}", "tugas": f"T{i % 3}", "nilai_terbit": "70"} for i in range(30)]
        a = ps.pilih(karya, jumlah=20, seed=20261101)
        b = ps.pilih(list(reversed(karya)), jumlah=20, seed=20261101)
        self.assertEqual([k["kode"] for k in a], [k["kode"] for k in b])
        per = ps.pilih(karya, per_tugas=2)
        self.assertEqual(len(per), 6)

    def test_alur_berkas(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            daftar = d / "daftar.csv"
            with open(daftar, "w", encoding="utf-8", newline="") as f:
                w = csv.writer(f, delimiter=";")
                w.writerow(["kode", "tugas", "nilai_terbit"])
                for i in range(25):
                    w.writerow([f"K{i:02d}", "T1", 60 + i])
            keluar = d / "audit"
            subprocess.run([sys.executable, str(AKAR / "audit/pilih_sampel.py"), str(daftar), "--keluar", str(keluar)], check=True, capture_output=True)
            lembar = list(csv.DictReader((keluar / "lembar_audit.csv").read_text(encoding="utf-8-sig").splitlines(), delimiter=";"))
            self.assertEqual(len(lembar), 20)
            self.assertNotIn("nilai_terbit", lembar[0])
            terbit = {b["kode"]: float(b["nilai_terbit"]) for b in csv.DictReader((keluar / "nilai_terbit_TERTUTUP.csv").read_text(encoding="utf-8-sig").splitlines(), delimiter=";")}
            with open(keluar / "lembar_audit.csv", "w", encoding="utf-8-sig", newline="") as f:
                w = csv.writer(f, delimiter=";")
                w.writerow(["kode", "tugas", "nilai_dosen", "menit", "catatan"])
                for b in lembar:
                    w.writerow([b["kode"], b["tugas"], str(terbit[b["kode"]] + 1).replace(".", ","), "4", ""])
            hasil = d / "hasil.md"
            subprocess.run([sys.executable, str(AKAR / "audit/hitung_audit.py"), str(keluar / "lembar_audit.csv"), str(keluar / "nilai_terbit_TERTUTUP.csv"), "--keluar", str(hasil)], check=True, capture_output=True)
            teks = hasil.read_text(encoding="utf-8")
            self.assertIn("| MAE (selisih mutlak rata-rata) | 1,00 poin", teks)
            self.assertIn("memenuhi ambang", teks)


if __name__ == "__main__":
    unittest.main()
