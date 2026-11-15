# krunner-ai

> CLI tool untuk men-generate satu file `.krunner` ke dalam project Flutter Anda yang menggabungkan seluruh aturan coding AI, standar Flutter/Dart, anti-slop, dan security audit.

## Penggunaan Cepat

Cukup jalankan perintah berikut di root folder project Flutter Anda:

```bash
npx krunner-ai
```

## Apa yang Dihasilkan?

File `.krunner` akan dibuat di root project Anda. File ini berisi:
1. **Bagian 1: Aturan Utama (`SKILL.md`)** — Prinsip clean code, Flutter/Dart mandatory rules (Stateless widget, state provider/bloc, arsitektur berlapis).
2. **Bagian 2: References** — Modul referensi arsitektur, testing, refactoring, scalability, security, dan strict execution mode.
3. **Bagian 3: Anti-Slop** — Aturan pencegahan output AI yang bertele-tele, boilerplate berlebihan, dan penurunan kualitas kode.
4. **Bagian 4: Security Audit** — Audit kerentanan keamanan komprehensif untuk aplikasi dan deployment.

Semua agen AI (Claude, Gemini, Cursor, Codex, Copilot, OpenCode, dll.) yang bekerja di project tersebut akan membaca instruksi dari `.krunner`.
