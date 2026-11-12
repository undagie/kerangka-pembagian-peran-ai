"""Memilih sampel acak untuk audit buta dan memisahkan nilai yang terbit dari lembar penilaian dosen.

Pemakaian:
    python audit/pilih_sampel.py <daftar-karya.csv> [--per-tugas 5 | --jumlah 20] [--seed 20261101] [--keluar audit-keluaran]

Masukan (pemisah ; atau ,): kolom kode, tugas, nilai_terbit. Pakai kode anonim, bukan nama atau NPM.
Keluaran:
    lembar_audit.csv              diisi dosen tanpa melihat nilai terbit (kolom nilai_dosen dan menit)
    nilai_terbit_TERTUTUP.csv     nilai yang terbit untuk karya yang sama; dibuka sesudah semua lembar terisi
"""
import argparse
import csv
import random
from pathlib import Path


def baca_csv(berkas):
    teks = Path(berkas).read_text(encoding="utf-8-sig")
    pemisah = ";" if teks.splitlines()[0].count(";") >= teks.splitlines()[0].count(",") else ","
    baris = list(csv.DictReader(teks.splitlines(), delimiter=pemisah))
    return [{k.strip().lower(): (v or "").strip() for k, v in b.items()} for b in baris]


def pilih(karya, per_tugas=None, jumlah=None, seed=20261101):
    acak = random.Random(seed)
    if per_tugas:
        hasil = []
        for tugas in sorted({k["tugas"] for k in karya}):
            kelompok = sorted((k for k in karya if k["tugas"] == tugas), key=lambda k: k["kode"])
            hasil += acak.sample(kelompok, min(per_tugas, len(kelompok)))
        return hasil
    urut = sorted(karya, key=lambda k: (k["tugas"], k["kode"]))
    return acak.sample(urut, min(jumlah or 20, len(urut)))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("daftar")
    p.add_argument("--per-tugas", type=int)
    p.add_argument("--jumlah", type=int, default=20)
    p.add_argument("--seed", type=int, default=20261101)
    p.add_argument("--keluar", default="audit-keluaran")
    a = p.parse_args()

    karya = [k for k in baca_csv(a.daftar) if k.get("kode") and k.get("nilai_terbit")]
    for kolom in ("kode", "tugas", "nilai_terbit"):
        if karya and kolom not in karya[0]:
            raise SystemExit(f"Kolom {kolom} tidak ada di {a.daftar}.")
    sampel = pilih(karya, a.per_tugas, a.jumlah, a.seed)
    # Urutan lembar diacak ulang supaya dosen tidak menilai per tugas berurutan.
    random.Random(a.seed + 1).shuffle(sampel)

    keluar = Path(a.keluar)
    keluar.mkdir(parents=True, exist_ok=True)
    with open(keluar / "lembar_audit.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["kode", "tugas", "nilai_dosen", "menit", "catatan"])
        for k in sampel:
            w.writerow([k["kode"], k["tugas"], "", "", ""])
    with open(keluar / "nilai_terbit_TERTUTUP.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["kode", "tugas", "nilai_terbit"])
        for k in sorted(sampel, key=lambda k: k["kode"]):
            w.writerow([k["kode"], k["tugas"], k["nilai_terbit"]])
    cara = f"{a.per_tugas} karya per tugas" if a.per_tugas else f"{len(sampel)} karya"
    print(f"Sampel {cara} (seed {a.seed}) ditulis ke {keluar}/. Jangan buka nilai_terbit_TERTUTUP.csv sebelum lembar terisi.")


if __name__ == "__main__":
    main()
