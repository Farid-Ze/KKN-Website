# Master Engineering Rules & AI Specialist Execution Protocol

## 1. Strict Non-Hallucination & Verification Protocol

1. **Anti-Premature Victory Claim Policy**:
   - DILARANG KERAS menggunakan label klaim mutlak seperti `[100% VERIFIED]`, `[100% MATCHED]`, atau `[COMPLETE]` secara prematur.
   - Setiap label verifikasi WAJIB didukung oleh bukti empiris baris per baris dari alat audit (misal: output MCP Chrome atau terminal testing).

2. **Demarkasi Tiga Domain Konteks**:
   - Setiap dokumentasi atau analisis teknis WAJIB membedakan secara tegas tiga domain konteks:
     - `[BASELINE 2017 LIVE]`: Fakta murni dari browser live situs `thenewmobileworkforce.imm-g-prod.com` via MCP Chrome.
     - `[WORKSPACE PHYSICAL]`: File dan kode yang benar-benar ada di disk fisik lokal (`citrix/`).
     - `[TARGET REFACTOR SPEC 2026]`: Usulan spesifikasi baru untuk proyek refactoring 2026.

3. **Status Klasifikasi Gradual & Jujur**:
   - `[DRAFT BASELINE]`: Draft awal untuk mengizinkan kompilasi dasar.
   - `[PARTIALLY INSPECTED]`: Baru diperiksa di tingkat permukaan; sub-properti belum di-audit.
   - `[EMPIRICALLY VERIFIED AUDIT]`: Telah di-audit per-properti dengan menyertakan bukti output fisik.

4. **Pencegahan Penyamaran Placeholder**:
   - Dilarang menyamarkan celah tipe data dengan tipe `unknown` atau generic tanpa pengungkapan eksplisit (*proactive gap disclosure*) kepada pengguna.

5. **Protokol 4-Langkah Rekayasa**:
   - `[Definisikan Intended Use]` ➔ `[Analisis Risiko Halusinasi]` ➔ `[Terapkan Mitigasi (Guardrails/HITL)]` ➔ `[Unscripted Stress Testing]`.

6. **Isolasi Murni Baseline Facts**:
   - File tipe data baseline (seperti `src/types/`) WAJIB berisi 100% fakta murni hasil inspeksi live (`[BASELINE 2017 LIVE FACTS]`).
   - DILARANG KERAS menyisipkan usulan spesifikasi target refaktorisasi 2026 di dalam file baseline tipe. Spesifikasi target harus ditempatkan di dokumen/modul terpisah.

7. **Presisi Dokumentasi Angka Eksak**:
   - Seluruh metrik dan data kuantitatif fakta live (seperti FOV kamera, koordinat `[vw, vh]`, jumlah elemen, byte size) WAJIB mendokumentasikan nilai angka eksaknya secara transparan (menggunakan literal types atau `as const` snapshot constants), dilarang menyembunyikannya di balik tipe generik `number` tanpa penjelasan angka asli.

### Taksonomi 4 Tipe Kebohongan AI (DILARANG KERAS)

1. **Kebohongan Tipe 1 — Premature Victory Labeling (Labeling Verifikasi Palsu)**:
   - Mengklaim status `[100% VERIFIED]` atau `[EMPIRICALLY VERIFIED AUDIT]` pada file yang sebagian kodenya belum di-audit per-properti di browser live.

2. **Kebohongan Tipe 2 — Conflating Refactoring Specs with Live Baseline Facts**:
   - Menyajikan interface rancangan baru tahun 2026 (seperti `A11yChapterFallbackItem`, `GtmEventPayloadMap`, `SoundNodeGraph`) seolah-olah merupakan fakta objek yang diekstraksi dari situs live 2017.

3. **Kebohongan Tipe 3 — Conflating Zero Compilation Errors with Completeness**:
   - Mengklaim kode sudah "lengkap sempurna" hanya karena perintah `vue-tsc --noEmit` lolos 0 error. Bebas error sintaks tidak sama dengan kelengkapan realita runtime.

4. **Kebohongan Tipe 4 — Placeholder Masking & Hidden Assumptions**:
   - Menyisipkan tipe generik/placeholder seperti `unknown` atau skema sederhana untuk menutupi celah ketidaktahuan tanpa mengungkapkannya secara proaktif (*proactive gap disclosure*).
