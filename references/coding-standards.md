# Standar Coding Universal

- Sebelum menulis kode, baca aturan project, tentukan konteks tugas/enterprise, pahami stack, struktur, dependency, data flow, dan konvensi yang benar-benar digunakan.
- Jika file target tidak ditemukan atau konteks penting ambigu, minta klarifikasi sebelum mengubah kode.
- Gunakan Bahasa Indonesia dalam percakapan dan laporan; pertahankan identifier serta istilah teknis sesuai konvensi ekosistem.
- Kode harus sederhana, jelas, mudah dirawat, dan mengikuti formatter, linter, naming convention, error handling, serta type system project.
- Validasi input di boundary sistem. Jangan mengubah kontrak, perilaku publik, skema data, atau kompatibilitas tanpa permintaan dan penjelasan dampak.
- Hindari dependency baru, abstraksi prematur, boilerplate, penamaan generik, duplikasi, dead code, fallback yang menutupi error, serta komentar generik.
- Jangan menulis komentar untuk hal obvious. Komentar harus menjelaskan alasan bisnis/non-obvious; dokumentasikan API publik sesuai kebutuhan.
- Jangan menambahkan TODO tanpa tiket yang jelas.
- Untuk Flutter/Dart, `const` digunakan jika valid; ikuti aturan wajib di `flutter-standards.md`.
- Perbarui dokumentasi yang terkait langsung bersamaan dengan perubahan kode.
- AI tidak menjalankan aplikasi/project, test, server, atau build/run lokal. Pemeriksaan format dan analyze dapat dilakukan sesuai aturan project; test dijalankan manual oleh pemilik project dan quality gate tetap melalui pipeline. Lihat `strict-execution.md`.
- Laporkan perubahan, pemeriksaan yang benar-benar dilakukan, test yang belum dijalankan, pipeline yang belum berjalan, dan risiko tersisa. Jangan mengklaim hasil yang belum dibuktikan.
