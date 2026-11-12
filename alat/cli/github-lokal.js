'use strict';
// GitHub tiruan untuk folder lokal. Pembaca repositori alat Moodle (ambilRepo) dipakai apa adanya pada salinan
// repositori (git clone) atau folder kiriman biasa, sehingga fakta yang dihitung sama dengan di Moodle.
// Hanya permintaan ke api.github.com dan raw.githubusercontent.com untuk pemilik "lokal" yang dilayani;
// permintaan lain (mis. ke layanan AI) diteruskan ke fetch asli.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const PEMILIK = 'lokal';
const NAMA = 'kiriman';
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp' };

let aktif = null; // folder kiriman yang sedang dibaca
let namaAktif = NAMA; // nama repositori yang dilaporkan (dari --identitas bila ada)
let fetchAsli = null;

const adaGit = (folder = aktif) => !!folder && fs.existsSync(path.join(folder, '.git'));
const git = (args, biner) =>
  execFileSync('git', ['-C', aktif, '-c', 'core.quotepath=off', ...args], {
    encoding: biner ? 'buffer' : 'utf8',
    maxBuffer: 512 * 1048576,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
const shaBlob = (buf) => crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

// Daftar berkas bentuk "git tree": blob untuk berkas, tree untuk folder, commit untuk repositori bersarang (submodule).
function pohonFolder(dasar = '') {
  const hasil = [];
  for (const e of fs.readdirSync(path.join(aktif, dasar), { withFileTypes: true })) {
    const rel = dasar ? dasar + '/' + e.name : e.name;
    if (e.isDirectory()) {
      if (e.name === '.git') continue;
      if (fs.existsSync(path.join(aktif, rel, '.git'))) {
        hasil.push({ path: rel, mode: '160000', type: 'commit', sha: '0'.repeat(40) });
        continue;
      }
      hasil.push({ path: rel, mode: '040000', type: 'tree' });
      hasil.push(...pohonFolder(rel));
    } else if (e.isFile()) {
      const buf = fs.readFileSync(path.join(aktif, rel));
      hasil.push({ path: rel, mode: '100644', type: 'blob', size: buf.length, sha: shaBlob(buf) });
    }
  }
  return hasil;
}

function pohonGit(ref) {
  return git(['ls-tree', '-r', '-t', '-l', '-z', ref])
    .split('\0')
    .filter(Boolean)
    .map((baris) => {
      const [kepala, p] = baris.split('\t');
      const [mode, type, sha, size] = kepala.trim().split(/\s+/);
      return Object.assign({ path: p, mode, type, sha }, type === 'blob' ? { size: Number(size) } : {});
    });
}

// Daftar commit bentuk API GitHub. Commit lewat web GitHub dikenali dari email committer noreply@github.com, sama
// dengan pelaku "web-flow" di API GitHub.
function daftarCommit(q) {
  const per = Math.min(100, Number(q.get('per_page')) || 30);
  const args = ['log', q.get('sha') || 'HEAD', '-n', String(per + 1), '--format=%H%x1f%cI%x1f%aI%x1f%ce%x1f%B%x1e'];
  if (q.get('until')) args.push('--until=' + q.get('until'));
  if (q.get('path')) args.push('--', q.get('path'));
  const semua = git(args)
    .split('\x1e')
    .map((s) => s.replace(/^\n/, ''))
    .filter((s) => s.trim())
    .map((s) => {
      const [sha, cI, aI, ce, pesan] = s.split('\x1f');
      return {
        sha,
        commit: { message: String(pesan || '').trim(), author: { date: aI }, committer: { date: cI, email: ce } },
        committer: { login: String(ce).toLowerCase() === 'noreply@github.com' ? 'web-flow' : '' },
      };
    });
  return { data: semua.slice(0, per), lanjut: semua.length > per };
}

const jawab = (status, isi, kepala = {}) =>
  new Response(typeof isi === 'string' || Buffer.isBuffer(isi) ? isi : JSON.stringify(isi), {
    status,
    headers: Object.assign({ 'content-type': 'application/json' }, kepala),
  });

async function layani(url, opsi) {
  const u = new URL(String(url));
  const api = new RegExp('^/repos/' + PEMILIK + '/[^/]+').exec(u.pathname);
  if (u.host === 'api.github.com' && api) {
    if (!aktif) return jawab(404, { message: 'Not Found' });
    const sisa = u.pathname.slice(api[0].length);
    if (sisa === '') {
      return jawab(200, { full_name: `${PEMILIK}/${namaAktif}`, default_branch: 'HEAD', fork: false, parent: null, language: '', description: '' });
    }
    let m = /^\/git\/trees\/(.+)$/.exec(sisa);
    if (m) {
      const ref = decodeURIComponent(m[1]);
      if (adaGit()) {
        try {
          return jawab(200, { sha: ref, tree: pohonGit(ref), truncated: false });
        } catch (e) {
          return jawab(409, { message: 'Git Repository is empty.' });
        }
      }
      return jawab(200, { sha: ref, tree: pohonFolder(), truncated: false });
    }
    if (sisa === '/commits') {
      if (!adaGit()) return jawab(200, []);
      try {
        const { data, lanjut } = daftarCommit(u.searchParams);
        return jawab(200, data, lanjut ? { link: `<${u.href}&page=2>; rel="next"` } : {});
      } catch (e) {
        return jawab(409, { message: 'Git Repository is empty.' });
      }
    }
    m = /^\/commits\/([0-9a-f]{7,40})$/i.exec(sisa);
    if (m && adaGit()) {
      const files = git(['show', '--name-only', '--format=', m[1]])
        .split('\n')
        .filter(Boolean)
        .map((filename) => ({ filename }));
      return jawab(200, { sha: m[1], files });
    }
    return jawab(404, { message: 'Not Found' });
  }
  const raw = new RegExp('^/' + PEMILIK + '/[^/]+/').exec(u.pathname);
  if (u.host === 'raw.githubusercontent.com' && raw) {
    if (!aktif) return jawab(404, '404: Not Found');
    const [ref, ...bagian] = u.pathname.slice(raw[0].length).split('/').map(decodeURIComponent);
    const p = bagian.join('/');
    const ext = (/\.([a-z0-9]+)$/i.exec(p) || [])[1] || '';
    const kepala = { 'content-type': MIME[ext.toLowerCase()] || 'text/plain; charset=utf-8' };
    try {
      if (adaGit()) return jawab(200, git(['show', `${ref}:${p}`], true), kepala);
      const penuh = path.resolve(aktif, p);
      if (!penuh.startsWith(path.resolve(aktif) + path.sep)) return jawab(404, '404: Not Found');
      return jawab(200, fs.readFileSync(penuh), kepala);
    } catch (e) {
      return jawab(404, '404: Not Found');
    }
  }
  return fetchAsli(url, opsi);
}

// Pasang sekali; atur(folder) memilih kiriman yang dibaca berikutnya. Kiriman dibaca satu per satu.
function pasang() {
  if (!fetchAsli) {
    fetchAsli = global.fetch;
    global.fetch = layani;
  }
}
function atur(folder, nama) {
  aktif = folder ? path.resolve(folder) : null;
  namaAktif = nama || NAMA;
}
function lepas() {
  if (fetchAsli) global.fetch = fetchAsli;
  fetchAsli = null;
  aktif = null;
}

module.exports = { pasang, atur, lepas, adaGit, PEMILIK, NAMA };
