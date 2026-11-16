# Kebijakan Eksekusi

AI tidak menjalankan atau membuka aplikasi/project, test suite, server, build, atau run. Pemilik project menjalankan test secara manual; build dan run hanya dilakukan melalui pipeline project.

## Pemeriksaan kualitas

- Pipeline wajib menjalankan formatter, analyzer, unit/widget/integration test, dan coverage gate sesuai konfigurasi project.
- AI boleh memeriksa format dan hasil analyze sesuai tooling project, tetapi tidak menjalankan test. Test wajib dijalankan manual oleh pemilik project dan melalui pipeline/quality gate yang ditetapkan.
- Jangan menjalankan pemeriksaan yang diam-diam memulai aplikasi, test suite, server, atau build.
- Jangan menjalankan package install/update/remove, migration, seed, deployment, publish/release, atau perubahan remote tanpa permintaan dan otorisasi yang sesuai.
- Security scanner aktif, fuzzing, dan penetration test memerlukan otorisasi serta scope eksplisit.

## Inspeksi dan pelaporan

Inspeksi read-only seperti membaca file, melihat struktur, mencari teks, dan membaca status/diff diperbolehkan jika aman. Jangan menjalankan perintah dengan efek samping yang tidak jelas.

Lakukan review statis pada diff, logika, error handling, edge case, keamanan, kompatibilitas, struktur, serta dampak platform. Laporkan pemeriksaan yang benar-benar dilakukan, test yang perlu dijalankan manual, pipeline yang belum tersedia, dan risiko tersisa. Jangan mengklaim hasil yang belum dibuktikan.
