'use strict';
// Uji alat baris perintah dengan kiriman tiruan. Tidak ada permintaan jaringan sungguhan: layanan AI dipalsukan.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const AKAR = path.join(__dirname, '..');
const KUNCI = path.join(AKAR, 'contoh/kunci/P01_Dari_Python_ke_Cpp.json');
const RUBRIK = path.join(AKAR, 'contoh/rubrik/Uraian_Umum_Sampel_Acak.json');
const TUGAS = path.join(AKAR, 'contoh/kiriman-tiruan/tugas-p01');
const URAIAN = path.join(AKAR, 'contoh/kiriman-tiruan/uraian');

// Layanan AI palsu: dipasang sebelum CLI memasang GitHub tiruan, jadi panggilan AI sampai ke sini.
const panggilan = [];
let jawabAI = () => ({});
global.fetch = async (url, opsi) => {
  const badan = JSON.parse(opsi.body);
  panggilan.push({ url: String(url), badan });
  const isi = JSON.stringify(jawabAI(badan));
  return new Response(JSON.stringify({ model: badan.model, choices: [{ message: { content: isi }, finish_reason: 'stop' }] }), { status: 200 });
};

const A = require('../alat/moodle/periksa-tugas-ai.user.js');
const { utama } = require('../alat/cli/nilai.js');
const kunci = A.validasiKunci(JSON.parse(fs.readFileSync(KUNCI, 'utf8'))).kunci;

const sementara = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ppa-'));
const bacaJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// Jawaban agen yang menyatakan SEMUA butir terpenuhi, termasuk butir yang dicek program.
function jawabanSemuaTerpenuhi() {
  return {
    kriteria: kunci.kriteria
      .filter((k) => k.sumber === 'repo')
      .map((k) => ({
        id: k.id,
        butir: (k.butir || []).map((b) => ({ id: b.id, bukti: 'p01/rerata.cpp baris 9', terpenuhi: true, yakin: true })),
        bukti: 'p01/rerata.cpp baris 9',
        status: 'tercapai',
        umpan_balik: 'Bagian ini sudah sesuai dengan ketentuan.',
      })),
    pembuka: 'Repositori memuat berkas tugas P01.',
    hal_baik: 'Perhitungan rata-rata sudah memakai pembagian desimal.',
    masukan: [],
    catatan_dosen: '',
  };
}

test('cek: kunci dan rubrik contoh valid', async () => {
  assert.strictEqual(await utama(['cek', KUNCI]), 0);
  assert.strictEqual(await utama(['cek', RUBRIK]), 0);
});

test('semua contoh kunci dan rubrik lolos cek', async () => {
  for (const dir of ['contoh/kunci', 'contoh/rubrik']) {
    for (const f of fs.readdirSync(path.join(AKAR, dir)).filter((f) => f.endsWith('.json'))) {
      assert.strictEqual(await utama(['cek', path.join(AKAR, dir, f)]), 0, f);
    }
  }
});

test('skema jawaban AI di folder skema sama dengan skema di kode alat', () => {
  const tanpaKepala = (f) => {
    const s = bacaJson(path.join(AKAR, 'skema', f));
    for (const k of ['$schema', '$id', 'title', 'description']) delete s[k];
    return s;
  };
  assert.deepStrictEqual(tanpaKepala('jawaban-ai-tugas.schema.json'), A.SKEMA_NILAI);
  assert.deepStrictEqual(tanpaKepala('jawaban-ai-uraian.schema.json'), A.SKEMA_ESAI);
});

test('siapkan: paket untuk agen tidak memuat kode kiriman di pesan yang dikirim', async () => {
  const keluar = path.join(sementara(), 'paket');
  await utama(['siapkan', KUNCI, TUGAS, '--keluar', keluar]);
  for (const kode of ['A01', 'A02', 'A03']) {
    const p = bacaJson(path.join(keluar, kode, 'permintaan.json'));
    assert.ok(!JSON.stringify(p.messages).includes(kode), `kode ${kode} tidak boleh ada di pesan`);
    assert.ok(fs.readFileSync(path.join(keluar, kode, 'prompt.md'), 'utf8').includes('## Skema JSON jawaban'));
  }
  const pesanA02 = JSON.stringify(bacaJson(path.join(keluar, 'A02', 'permintaan.json')).messages);
  assert.ok(pesanA02.includes('p01/hello.cpp: TIDAK ADA'), 'fakta berkas wajib dihitung program');
  assert.ok(pesanA02.includes('p01/heloo.exe'), 'fakta berkas terlarang dihitung program');
});

test('nilai --jawaban: hasil program mengalahkan klaim agen, kemiripan menahan kartu', async () => {
  const dir = sementara();
  const jawaban = path.join(dir, 'jawaban');
  fs.mkdirSync(jawaban);
  for (const kode of ['A01', 'A02', 'A03']) fs.writeFileSync(path.join(jawaban, kode + '.json'), JSON.stringify(jawabanSemuaTerpenuhi()));
  await utama(['nilai', KUNCI, TUGAS, '--jawaban', jawaban, '--keluar', path.join(dir, 'hasil')]);
  const h = (kode) => bacaJson(path.join(dir, 'hasil', kode + '.json'));
  const butir = (r, id) => r.rincian.flatMap((x) => x.butir || []).find((b) => b.id === id);
  // A02 tidak punya hello.cpp, menyimpan .exe, dan tanpa .gitignore: butir itu gagal walau agen menyatakan terpenuhi.
  for (const id of ['K1b', 'K5a', 'K5b']) assert.strictEqual(butir(h('A02'), id).terpenuhi, false, id);
  assert.ok(h('A02').nilai < h('A01').nilai, 'nilai A02 lebih rendah dari A01');
  assert.strictEqual(h('A01').nilai, 100);
  // catatan_kesalahan.md A01 dan A03 identik: kartu ditahan dan kalimat kemiripan ditambahkan.
  assert.strictEqual(h('A03').status, 'ditahan');
  assert.ok(h('A03').komentar.includes('sama persis dengan kiriman mahasiswa lain'));
  const rekap = fs.readFileSync(path.join(dir, 'hasil', 'rekap.csv'), 'utf8');
  assert.ok(rekap.startsWith('﻿Kode;Status;Saran nilai'));
  // Baris rekap dipisah CRLF; baris baru di dalam komentar (LF) tetap berada di dalam sel bertanda kutip.
  assert.strictEqual(rekap.trim().split('\r\n').length, 4);
});

test('nilai --identitas: cek nama repositori lokal, NPM disamarkan di pesan AI', async () => {
  const dir = sementara();
  const peta = path.join(dir, 'identitas.csv');
  fs.writeFileSync(peta, 'kode;npm;repo\nA01;2399990001;pt-2399990001\nA02;2399990002;tugas-pt\n');
  const keluar = path.join(dir, 'paket');
  await utama(['siapkan', KUNCI, TUGAS, '--keluar', keluar, '--identitas', peta, '--hanya', 'A01,A02']);
  const pesan = (kode) => JSON.stringify(bacaJson(path.join(keluar, kode, 'permintaan.json')).messages);
  assert.ok(!pesan('A01').includes('2399990001'), 'NPM tidak boleh terkirim');
  assert.ok(pesan('A01').includes('[akun-github]/pt-[NPM]'));
  assert.ok(/K1a[^"]*TERPENUHI/.test(pesan('A01')), 'nama repositori A01 sesuai pola');
  assert.ok(/K1a[^"]*TIDAK terpenuhi/.test(pesan('A02')), 'nama repositori A02 tidak sesuai pola');
});

test('GitHub tiruan membaca riwayat git: jumlah commit dan commit lewat web', async () => {
  const dir = sementara();
  const repo = path.join(dir, 'kiriman', 'B01');
  fs.cpSync(path.join(TUGAS, 'A01'), repo, { recursive: true });
  const git = (...a) => execFileSync('git', ['-C', repo, ...a], { stdio: 'ignore', env: Object.assign({}, process.env, { GIT_COMMITTER_EMAIL: 'noreply@github.com', GIT_COMMITTER_NAME: 'GitHub', GIT_AUTHOR_NAME: 'uji', GIT_AUTHOR_EMAIL: 'uji@contoh.test' }) });
  git('init', '-q');
  git('add', '.');
  git('-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'Add files via upload');
  const keluar = path.join(dir, 'paket');
  await utama(['siapkan', KUNCI, path.join(dir, 'kiriman'), '--keluar', keluar]);
  // Commit terakhir di folder tugas lewat web dan kunci menolak unggah web: tidak ada paket AI, diganti templat.
  assert.ok(kunci.tolak_unggah_web);
  assert.ok(!fs.existsSync(path.join(keluar, 'B01')), 'kiriman unggah web tidak dikirim ke AI');
  await utama(['nilai', KUNCI, path.join(dir, 'kiriman'), '--jawaban', path.join(dir, 'kosong'), '--keluar', path.join(dir, 'hasil')]);
  const h = bacaJson(path.join(dir, 'hasil', 'B01.json'));
  assert.strictEqual(h.status, 'templat');
  assert.ok(/web GitHub|lewat web/i.test(h.komentar));
});

test('nilai lewat API layanan lain: alamat, model, dan kolom khusus OpenRouter', async () => {
  const dir = sementara();
  Object.assign(process.env, { AI_API_KEY: 'uji', AI_BASE_URL: 'https://ai.kampus.test/v1', AI_MODEL: 'model-kampus', AI_MODEL_JURI: '' });
  panggilan.length = 0;
  jawabAI = () => jawabanSemuaTerpenuhi();
  try {
    await utama(['nilai', KUNCI, TUGAS, '--hanya', 'A01', '--keluar', path.join(dir, 'hasil')]);
  } finally {
    for (const k of ['AI_API_KEY', 'AI_BASE_URL', 'AI_MODEL', 'AI_MODEL_JURI']) delete process.env[k];
    A.aturPenyedia(null);
  }
  assert.ok(panggilan.length >= 1);
  for (const p of panggilan) {
    assert.strictEqual(p.url, 'https://ai.kampus.test/v1/chat/completions');
    assert.strictEqual(p.badan.model, 'model-kampus');
    assert.ok(!('provider' in p.badan) && !('usage' in p.badan) && !('reasoning' in p.badan), 'kolom khusus OpenRouter tidak dikirim');
  }
  assert.strictEqual(bacaJson(path.join(dir, 'hasil', 'A01.json')).nilai, 100);
});

test('jawaban dan modul PDF ditolak dengan pesan jelas, bukan dikirim sebagai isi biner', async () => {
  const dir = sementara();
  fs.writeFileSync(path.join(dir, 'P01.pdf'), '%PDF-1.4\n' + 'x'.repeat(50));
  await assert.rejects(utama(['siapkan', RUBRIK, dir, '--keluar', path.join(dir, 'paket')]), /PDF belum dapat dibaca/);
  await assert.rejects(A.teksModul(new Uint8Array(8), 'modul.pdf'), /PDF belum dapat dibaca/);
});

test('uraian --jawaban: kutipan palsu dibatalkan program, jawaban kosong 0, jawaban identik ditahan', async () => {
  const dir = sementara();
  const jawaban = path.join(dir, 'jawaban');
  fs.mkdirSync(jawaban);
  const semua = (kutipan) => ({
    butir: ['U1a', 'U1b', 'U1c'].map((id) => ({ id, alasan: 'ada di jawaban', kutipan, terpenuhi: true })),
    umpan_balik: 'Jawaban sudah menjelaskan pengertian sampel acak.',
    catatan_dosen: '',
  });
  fs.writeFileSync(path.join(jawaban, 'U01__1.json'), JSON.stringify(semua('setiap anggota populasi punya peluang yang sama untuk terpilih')));
  // Kutipan yang tidak ada di jawaban U02: program membatalkan butir itu.
  fs.writeFileSync(path.join(jawaban, 'U02__1.json'), JSON.stringify(semua('bias pemilihan berkurang dan sampel lebih mewakili populasi')));
  fs.writeFileSync(path.join(jawaban, 'U03__1.json'), JSON.stringify(semua('setiap anggota populasi punya peluang yang sama untuk terpilih')));
  await utama(['nilai', RUBRIK, URAIAN, '--jawaban', jawaban, '--keluar', path.join(dir, 'hasil')]);
  const h = (kode) => bacaJson(path.join(dir, 'hasil', kode + '.json'));
  assert.strictEqual(h('U01').nilai, 10);
  assert.strictEqual(h('U02').nilai, 0, 'kutipan U02 tidak ada di jawabannya');
  assert.strictEqual(h('U02').status, 'cek dosen');
  assert.strictEqual(h('U03').status, 'ditahan');
  assert.strictEqual(h('U04').nilai, 0);
});
