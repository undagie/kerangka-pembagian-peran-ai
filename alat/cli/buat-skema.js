#!/usr/bin/env node
'use strict';
// Menulis ulang skema/jawaban-ai-*.schema.json dari skema yang dipakai alat saat memanggil AI.
const fs = require('fs');
const path = require('path');
const A = require('../moodle/periksa-tugas-ai.user.js');

const DAFTAR = [
  ['jawaban-ai-tugas.schema.json', 'Jawaban AI untuk satu kiriman tugas', 'SKEMA_NILAI'],
  ['jawaban-ai-uraian.schema.json', 'Jawaban AI untuk satu jawaban uraian', 'SKEMA_ESAI'],
];

for (const [berkas, judul, nama] of DAFTAR) {
  const isi = Object.assign(
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: berkas,
      title: judul,
      description: `Dibuat dari ${nama} di alat. Jangan disunting manual; uji memastikan isinya sama dengan kode.`,
    },
    A[nama]
  );
  fs.writeFileSync(path.join(__dirname, '../../skema', berkas), JSON.stringify(isi, null, 2) + '\n');
  console.log('Ditulis: skema/' + berkas);
}
