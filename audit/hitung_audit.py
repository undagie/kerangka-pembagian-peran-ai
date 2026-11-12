"""Menghitung kesesuaian nilai yang terbit (disusun dengan bantuan AI) dengan penilaian buta dosen.

Pemakaian:
    python audit/hitung_audit.py <lembar_audit.csv> <nilai_terbit_TERTUTUP.csv> [opsi]

Opsi:
    --skala "80:A,75:B+,70:B,65:C+,60:C,40:D,0:E"   batas bawah huruf mutu (ikuti kontrak perkuliahan Anda)
    --mae 5          ambang selisih mutlak rata-rata paling besar (poin)
    --icc 0.75       ambang ICC(2,1) kesepakatan mutlak paling kecil
    --huruf 0.9      bagian karya yang huruf mutunya harus sama, paling kecil (0,9 = 18 dari 20)
    --keluar hasil_audit.md

Ukuran: MAE, bias, batas kesesuaian Bland-Altman, korelasi Pearson, ICC(2,1) dan ICC(3,1) (Shrout & Fleiss, 1979),
kesamaan huruf mutu, dan kappa Cohen. Interval kepercayaan 95% dihitung dengan bootstrap. Hanya pustaka standar Python
3.10 atau lebih baru yang dipakai.
"""
import argparse
import csv
import random
import statistics as st
from pathlib import Path

SKALA_BAWAAN = "80:A,75:B+,70:B,65:C+,60:C,40:D,0:E"


def baca_csv(berkas):
    teks = Path(berkas).read_text(encoding="utf-8-sig")
    kepala = teks.splitlines()[0]
    pemisah = ";" if kepala.count(";") >= kepala.count(",") else ","
    return [{k.strip().lower(): (v or "").strip() for k, v in b.items()} for b in csv.DictReader(teks.splitlines(), delimiter=pemisah)]


def angka(s):
    try:
        return float(str(s).replace(",", "."))
    except ValueError:
        return None


def baca_skala(teks):
    skala = []
    for bagian in teks.split(","):
        batas, huruf = bagian.split(":")
        skala.append((float(batas), huruf.strip()))
    return sorted(skala, reverse=True)


def huruf(x, skala):
    for batas, h in skala:
        if x >= batas:
            return h
    return skala[-1][1]


def icc(pasangan):
    """ICC(2,1) kesepakatan mutlak dan ICC(3,1) konsistensi untuk dua penilai (Shrout & Fleiss, 1979)."""
    n, k = len(pasangan), 2
    rerata_total = st.mean(v for p in pasangan for v in p)
    rerata_baris = [st.mean(p) for p in pasangan]
    rerata_kolom = [st.mean(p[j] for p in pasangan) for j in range(k)]
    ss_baris = k * sum((m - rerata_total) ** 2 for m in rerata_baris)
    ss_kolom = n * sum((m - rerata_total) ** 2 for m in rerata_kolom)
    ss_total = sum((v - rerata_total) ** 2 for p in pasangan for v in p)
    ss_galat = ss_total - ss_baris - ss_kolom
    msr = ss_baris / (n - 1)
    msc = ss_kolom / (k - 1)
    mse = ss_galat / ((n - 1) * (k - 1))
    icc2 = (msr - mse) / (msr + (k - 1) * mse + k * (msc - mse) / n) if msr + mse else float("nan")
    icc3 = (msr - mse) / (msr + (k - 1) * mse) if msr + mse else float("nan")
    return icc2, icc3


def kappa(a, b, kategori, berbobot=False):
    idx = {h: i for i, h in enumerate(kategori)}
    m, n = len(kategori), len(a)
    bobot = (lambda i, j: 1 - abs(i - j) / (m - 1)) if berbobot else (lambda i, j: 1.0 if i == j else 0.0)
    po = sum(bobot(idx[x], idx[y]) for x, y in zip(a, b)) / n
    pa = [sum(1 for x in a if x == h) / n for h in kategori]
    pb = [sum(1 for y in b if y == h) / n for h in kategori]
    pe = sum(pa[i] * pb[j] * bobot(i, j) for i in range(m) for j in range(m))
    return (po - pe) / (1 - pe) if pe < 1 else float("nan")


def bootstrap(pasangan, fungsi, ulang=2000, seed=20261101):
    acak = random.Random(seed)
    nilai = []
    for _ in range(ulang):
        contoh = [pasangan[acak.randrange(len(pasangan))] for _ in pasangan]
        try:
            v = fungsi(contoh)
        except (ZeroDivisionError, st.StatisticsError):
            continue
        if v == v:
            nilai.append(v)
    nilai.sort()
    return nilai[int(0.025 * len(nilai))], nilai[int(0.975 * len(nilai)) - 1]


def koma(x, d=2):
    return f"{x:.{d}f}".replace(".", ",")


def hitung(baris, skala, ambang_mae, ambang_icc, ambang_huruf):
    """baris: daftar (kode, tugas, nilai_terbit, nilai_dosen, menit atau None)."""
    n = len(baris)
    pasangan = [(t, d) for _, _, t, d, _ in baris]
    selisih = [d - t for t, d in pasangan]
    mae = st.mean(abs(x) for x in selisih)
    bias = st.mean(selisih)
    sd = st.stdev(selisih)
    icc2, icc3 = icc(pasangan)
    huruf_t = [huruf(t, skala) for t, _ in pasangan]
    huruf_d = [huruf(d, skala) for _, d in pasangan]
    kategori = [h for _, h in skala]
    sama = sum(x == y for x, y in zip(huruf_t, huruf_d))
    menit = [m for *_, m in baris if m is not None]
    try:
        r = st.correlation([t for t, _ in pasangan], [d for _, d in pasangan])
    except st.StatisticsError:
        r = float("nan")
    hasil = {
        "n": n,
        "mae": mae,
        "ik_mae": bootstrap(pasangan, lambda p: st.mean(abs(d - t) for t, d in p)),
        "bias": bias,
        "loa": (bias - 1.96 * sd, bias + 1.96 * sd),
        "dalam5": sum(abs(x) <= 5 for x in selisih),
        "dalam10": sum(abs(x) <= 10 for x in selisih),
        "pearson": r,
        "icc2": icc2,
        "ik_icc": bootstrap(pasangan, lambda p: icc(p)[0]),
        "icc3": icc3,
        "huruf_sama": sama,
        "kappa": kappa(huruf_t, huruf_d, kategori),
        "kappa_bobot": kappa(huruf_t, huruf_d, kategori, berbobot=True),
        "menit": st.mean(menit) if menit else None,
        "per_tugas": {},
    }
    for _, tugas, t, d, _ in baris:
        hasil["per_tugas"].setdefault(tugas, []).append(d - t)
    hasil["lulus"] = mae <= ambang_mae and icc2 >= ambang_icc and sama >= ambang_huruf * n
    return hasil


def laporan(h, ambang_mae, ambang_icc, ambang_huruf):
    n = h["n"]
    perlu_huruf = -(-ambang_huruf * n // 1)
    teks = [
        "# Hasil Audit Buta",
        "",
        f"Karya yang lengkap dinilai: {n}.",
        "",
        "| Ukuran | Nilai |",
        "|---|---|",
        f"| MAE (selisih mutlak rata-rata) | {koma(h['mae'])} poin (IK 95% bootstrap {koma(h['ik_mae'][0])}–{koma(h['ik_mae'][1])}) |",
        f"| Bias (dosen dikurangi terbit) | {koma(h['bias'])} poin |",
        f"| Batas kesesuaian Bland-Altman | {koma(h['loa'][0])} sampai {koma(h['loa'][1])} poin |",
        f"| Selisih paling banyak 5 poin | {h['dalam5']} dari {n} karya |",
        f"| Selisih paling banyak 10 poin | {h['dalam10']} dari {n} karya |",
        f"| Korelasi Pearson | {koma(h['pearson'])} |",
        f"| ICC(2,1) kesepakatan mutlak | {koma(h['icc2'])} (IK 95% bootstrap {koma(h['ik_icc'][0])}–{koma(h['ik_icc'][1])}) |",
        f"| ICC(3,1) konsistensi | {koma(h['icc3'])} |",
        f"| Huruf mutu sama | {h['huruf_sama']} dari {n} karya |",
        f"| Kappa Cohen huruf mutu (biasa / berbobot linear) | {koma(h['kappa'])} / {koma(h['kappa_bobot'])} |",
        f"| Lama menilai per karya | {koma(h['menit'], 1) + ' menit' if h['menit'] is not None else 'tidak diisi'} |",
        "",
        "Selisih rata-rata per tugas: "
        + "; ".join(f"{t} {koma(st.mean(v))} poin ({len(v)} karya)" for t, v in sorted(h["per_tugas"].items()))
        + ".",
        "",
        f"Ambang: MAE paling besar {koma(ambang_mae, 1)} poin, ICC(2,1) paling kecil {koma(ambang_icc)}, "
        f"dan huruf mutu sama pada sedikitnya {int(perlu_huruf)} dari {n} karya. "
        f"Hasil: {'memenuhi' if h['lulus'] else 'belum memenuhi'} ambang.",
    ]
    if not h["lulus"]:
        teks += [
            "",
            "Saran nilai dari alat belum boleh langsung dipakai untuk tugas berbobot. Tinjau karya dengan selisih terbesar, "
            "perjelas kunci, lalu ulangi audit pada sampel baru.",
        ]
    return "\n".join(teks) + "\n"


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("lembar")
    p.add_argument("terbit")
    p.add_argument("--skala", default=SKALA_BAWAAN)
    p.add_argument("--mae", type=float, default=5.0)
    p.add_argument("--icc", type=float, default=0.75)
    p.add_argument("--huruf", type=float, default=0.9)
    p.add_argument("--keluar", default="hasil_audit.md")
    a = p.parse_args()

    terbit = {b["kode"]: (b.get("tugas", ""), angka(b.get("nilai_terbit"))) for b in baca_csv(a.terbit)}
    baris = []
    for b in baca_csv(a.lembar):
        dosen = angka(b.get("nilai_dosen"))
        if b.get("kode") not in terbit or dosen is None or terbit[b["kode"]][1] is None:
            continue
        tugas, nilai_terbit = terbit[b["kode"]]
        baris.append((b["kode"], tugas, nilai_terbit, dosen, angka(b.get("menit"))))
    if len(baris) < 5:
        raise SystemExit(f"Baru {len(baris)} karya yang lengkap. Isi paling sedikit 5 (sebaiknya 20), lalu jalankan lagi.")
    h = hitung(baris, baca_skala(a.skala), a.mae, a.icc, a.huruf)
    teks = laporan(h, a.mae, a.icc, a.huruf)
    Path(a.keluar).write_text(teks, encoding="utf-8")
    print(teks)


if __name__ == "__main__":
    main()
