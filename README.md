<p align="center">
  <img src="assets/krunner-banner.svg" alt="KRunner — Universal AI Coding Skill For Flutter" width="100%" />
</p>

<div align="center">

# 🚀 KRunner
### Universal AI Coding Skill For Flutter

**Standar AI coding presisi tinggi untuk ekosistem Flutter & Dart.**  
Menggabungkan **Clean Architecture**, **Anti-Slop**, **Security Audit**, dan **Strict Execution Mode** ke dalam satu file standar `.krunner` yang dapat dipahami oleh AI mana pun.

```bash
npx krunner
```

[![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-%230175C2.svg?style=for-the-badge&logo=dart&logoColor=white)](https://dart.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.12%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](krunner/package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![AI Ecosystem](https://img.shields.io/badge/Multi--Platform-Cursor%20%7C%20Claude%20%7C%20Copilot%20%7C%20Gemini%20%7C%20OpenCode%20%7C%20Ollama-blueviolet?style=for-the-badge)](#-dukungan-agen--ekosistem-ai)

</div>

---

## 📖 Daftar Isi
- [Kenapa Proyek Ini Dibuat?](#-kenapa-proyek-ini-dibuat)
- [Cara Pakai Cepat](#-cara-pakai-cepat)
- [Bagaimana Cara Kerjanya?](#-bagaimana-cara-kerjanya)
- [Pilar Standar Utama](#-pilar-standar-utama)
  - [1. Standar Wajib Flutter & Dart](#1-standar-wajib-flutter--dart)
  - [2. Alur Arsitektur Berlapis](#2-alur-arsitektur-berlapis)
  - [3. Anti-Slop Filter](#3-anti-slop-filter)
  - [4. Security Audit Engine](#4-security-audit-engine)
  - [5. Strict Execution Mode](#5-strict-execution-mode)
- [Perbandingan Sebelum & Sesudah](#-perbandingan-sebelum--sesudah)
- [Struktur Proyek](#-struktur-proyek)
- [Dukungan Agen & Ekosistem AI](#-dukungan-agen--ekosistem-ai)
- [Lisensi](#-lisensi)

---

## 💡 Kenapa Proyek Ini Dibuat?

Seringkali AI menghasilkan kode Flutter yang:
- ❌ **Penuh Boilerplate & Slop**: Menggunakan `StatefulWidget` dan `setState()` sembarangan.
- ❌ **Overengineered**: Mencampur logika bisnis, HTTP request, dan navigasi langsung di dalam Widget UI.
- ❌ **Mengabaikan Keamanan**: Hardcoded API keys, data sensitif disimpan di storage biasa, dan tanpa audit SAST.
- ❌ **Perubahan Visual Merusak**: Melakukan refactor kode yang mengubah padding, warna, atau layout tanpa disadari.

**Universal AI Coding Skill For Flutter** hadir sebagai pagar pembatas (*guardrails*) ketat agar semua agen AI menghasilkan kode Flutter kelas enterprise yang bersih, konsisten, terstruktur, dan aman.

---

## ⚡ Cara Pakai Cepat

Anda tidak perlu menyalin puluhan aturan secara manual. Cukup jalankan perintah berikut di root folder project Flutter Anda:

```bash
# Mode interaktif (Welcome ➔ Pilih Bahasa ➔ Pilih Cakupan Project/Everywhere ➔ Pilih Skill ➔ Selesai)
npx krunner

# Pasang otomatis untuk SEMUA platform AI di project ini
npx krunner all

# Pasang otomatis secara GLOBAL untuk SELURUH project di komputer Anda
npx krunner all --global

# Pasang dengan bahasa percakapan English
npx krunner all --lang=en

# Atau pasang untuk platform spesifik pilihan Anda
npx krunner install cursor
npx krunner install claude
npx krunner install vscode
npx krunner install gemini
npx krunner install opencode
npx krunner install ollama
```

### Apa yang Terjadi?
Satu file `.krunner` akan otomatis digenerate di root project Anda. File ini berisi rangkuman lengkap:
1. **Aturan Utama Coding & Flutter (`SKILL.md`)**
2. **Semua Referensi Teknis (`references/`)**
3. **Standar Anti-Slop (`additional-skills/anti-slop`)**
4. **Pedoman Security Audit (`additional-skills/security-audit-skill`)**

Setelah file `.krunner` ada di project Anda, **semua AI (Claude, Gemini, Cursor, Copilot, Codex, dll.) akan otomatis mendeteksi dan tunduk pada aturan tersebut!**

---

## 🔄 Bagaimana Cara Kerjanya?

```mermaid
flowchart TD
    subgraph Core[" Sumber Daya Skill "]
        A[SKILL.md<br/>Aturan Utama]
        B[references/<br/>Flutter, Architecture, Refactoring]
        C[additional-skills/anti-slop<br/>Anti Boilerplate & Clean UI]
        D[additional-skills/security-audit<br/>Security Engine]
    end

    subgraph CLI[" CLI krunner "]
        E["npx krunner"]
    end

    subgraph Target[" Project Target "]
        F[(".krunner<br/>(Single Source of Truth)")]
    end

    subgraph Agents[" AI Coding Agents "]
        G1[Claude Code]
        G2[Cursor / Windsurf]
        G3[Gemini CLI]
        G4[GitHub Copilot]
        G5[OpenCode / Codex]
    end

    A --> E
    B --> E
    C --> E
    D --> E
    E -->|Bundling Bersih| F
    F -->|Dibaca & Dipatuhi| G1
    F -->|Dibaca & Dipatuhi| G2
    F -->|Dibaca & Dipatuhi| G3
    F -->|Dibaca & Dipatuhi| G4
    F -->|Dibaca & Dipatuhi| G5
```

---

## 🏛️ Pilar Standar Utama

### 1. Standar Wajib Flutter & Dart
- **100% `StatelessWidget`**: Penggunaan `StatefulWidget` dan `setState()` dilarang keras.
- **Pemisahan State**: State dikelola lewat `Provider` (untuk tugas/ringan) atau `BLoC` (untuk skala enterprise). Tidak boleh dicampur pada satu domain yang sama.
- **Animasi Bersih**: Prioritaskan animasi implisit (`AnimatedContainer`, `AnimatedOpacity`, dll.). `AnimationController` dikelola di Provider/BLoC dengan lifecycle dan dispose yang valid.
- **Service Locator**: Wajib menggunakan `get_it` secara terpusat.

### 2. Alur Arsitektur Berlapis

Setiap fitur wajib mengikuti pola pemisahan tanggung jawab yang ketat:

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna
    participant UI as Presentation (Widget)
    participant State as State (Provider / BLoC)
    participant UC as Domain (UseCase)
    participant Repo as Domain (Repository Interface)
    participant Data as Data (Repository Impl & DataSource)

    User->>UI: Interaksi (Tap Button)
    UI->>State: context.read<T>().action()
    State->>UC: execute(params)
    UC->>Repo: getData()
    Repo->>Data: fetchFromRemote / LocalCache
    Data-->>Repo: Return DTO / Model
    Repo-->>UC: Return Entity
    UC-->>State: Success / Failure
    State-->>UI: notifyListeners() / emit(State)
    UI-->>User: Tampilan Terupdate (Loading/Success/Error)
```

> **Larangan Keras:** Widget atau State dilarang mengakses DataSource secara langsung!

### 3. Anti-Slop Filter
AI dilarang menghasilkan kode yang "terlihat seperti buatan AI":
- Tidak ada komentar untuk hal yang obvious.
- Tidak ada nama variabel generik seperti `data1`, `temp`, `myHandler`.
- Tidak ada fallback silent yang menyembunyikan error.
- UI tidak boleh generik dengan layout membosankan.

### 4. Security Audit Engine
- **Zero Hardcoded Secrets**: Dilarang meletakkan token, API key, atau password di kode sumber.
- **Penyimpanan Aman**: Wajib menggunakan `flutter_secure_storage` untuk data rahasia (bukan `SharedPreferences`).
- **Network Resilience**: Wajib HTTPS/TLS, Certificate Pinning untuk endpoint kritis, timeout request, dan sanitasi input.
- **Obfuscation**: Release build wajib menyertakan flag `--obfuscate --split-debug-info`.

### 5. Strict Execution Mode
AI **tidak menjalankan aplikasi/project secara lokal** dan **tidak menjalankan server atau build lokal**. 
- AI hanya melakukan inspeksi statis, formatting, dan review file secara *read-only*.
- Build, compile, dan end-to-end quality gate sepenuhnya diserahkan kepada **CI/CD Pipeline**.

---

## ⚖️ Perbandingan Sebelum & Sesudah

Berikut perbedaan nyata antara kode yang biasa dihasilkan oleh AI default (*AI Slop*) dibandingkan kode setelah menerapkan standar **KRunner**:

### 1. State Management & Widget Lifecycle

<table>
<tr>
<th width="50%">❌ Sebelum (AI Slop Default)</th>
<th width="50%">✅ Sesudah (Standar KRunner)</th>
</tr>
<tr>
<td>

```dart
// Stateful & setState dilarang!
// Logic HTTP bercampur di dalam UI
class ProductPage extends StatefulWidget {
  @override
  _ProductPageState createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  List data = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    // HTTP call langsung di initState!
    fetchProducts();
  }

  void fetchProducts() async {
    setState(() => isLoading = true);
    // Hardcoded URL & tanpa error boundary
    var res = await http.get(Uri.parse('https://api.com/items'));
    setState(() {
      data = jsonDecode(res.body);
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Boilerplate loading & unhandled empty state
    return isLoading
      ? CircularProgressIndicator()
      : ListView.builder(
          itemCount: data.length,
          itemBuilder: (ctx, i) => Text(data[i]['name']),
        );
  }
}
```

</td>
<td>

```dart
// 100% StatelessWidget!
// UI hanya membaca state & menampilkan 4 status wajib
class ProductScreen extends StatelessWidget {
  const ProductScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<ProductProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Produk')),
      body: switch (state.status) {
        ProductStatus.loading => const Center(
            child: CircularProgressIndicator(),
          ),
        ProductStatus.empty => const Center(
            child: Text('Belum ada produk tersedia.'),
          ),
        ProductStatus.error => Center(
            child: Text('Error: ${state.errorMessage}'),
          ),
        ProductStatus.success => ListView.builder(
            itemCount: state.products.length,
            itemBuilder: (context, index) => ProductCard(
              product: state.products[index],
            ),
          ),
      },
    );
  }
}
```

</td>
</tr>
<tr>
<td>
🔴 <b>Kelemahan:</b> Memory leak, logika bercampur di UI, tidak ada unit test, setState memicu re-render seluruh halaman.
</td>
<td>
🟢 <b>Keunggulan:</b> 100% Stateless, rendering reaktif terarah, 4 status terjamin (loading, empty, error, success), testable.
</td>
</tr>
</table>

---

### 2. Arsitektur Data Flow (Clean Architecture)

<table>
<tr>
<th width="50%">❌ Sebelum: Spaghetti Code</th>
<th width="50%">✅ Sesudah: Clean Architecture Berlapis</th>
</tr>
<tr>
<td>

```dart
// Widget memanggil API & parsing JSON secara liar
ElevatedButton(
  onPressed: () async {
    // Hardcode token & bypass domain layer
    final res = await http.post(
      Uri.parse('https://api.com/pay'),
      headers: {'Authorization': 'Bearer hardcoded_secret_token_123'},
      body: {'amount': 50000},
    );
    if (res.statusCode == 200) {
      Navigator.pushNamed(context, '/success');
    }
  },
  child: Text('Bayar Sekarang'),
)
```

</td>
<td>

```dart
// UI hanya memicu aksi usecase via Provider/BLoC
ElevatedButton(
  onPressed: () {
    // Memanggil UseCase terdaftar via Provider
    context.read<PaymentProvider>().processPayment(
      amount: 50000,
    );
  },
  child: const Text('Bayar Sekarang'),
)

// Data Flow:
// UI ➔ PaymentProvider ➔ ProcessPaymentUseCase
//    ➔ PaymentRepository ➔ RemotePaymentDataSource
```

</td>
</tr>
<tr>
<td>
🔴 <b>Kelemahan:</b> Hardcoded token rawan bocor, logic pembayaran tidak bisa diuji terpisah, melanggar prinsip Single Responsibility.
</td>
<td>
🟢 <b>Keunggulan:</b> Alur UI ➔ State ➔ UseCase ➔ Repository ➔ DataSource terjaga, dependensi dikelola rapi via <code>get_it</code>.
</td>
</tr>
</table>

---

### 3. Keamanan & Manajemen Kredensial

| Area Keamanan | ❌ Sebelum (AI Slop Default) | ✅ Sesudah (Standar KRunner) |
| :--- | :--- | :--- |
| **Penyimpanan Token** | Disimpan di `SharedPreferences` biasa (file XML/Plist mentah tanpa enkripsi). | Menggunakan `FlutterSecureStorage` yang terintegrasi dengan **Android Keystore** & **iOS Keychain**. |
| **Secret / API Keys** | Hardcoded langsung di source code (`const apiKey = "sk_live_123"`). | Diambil melalui environment variables / runtime secrets (`--dart-define`). |
| **Network Security** | HTTP polos tanpa TLS, timeout tidak ditentukan, tanpa retry backoff. | Wajib HTTPS/TLS, Certificate Pinning untuk endpoint kritis, timeout eksplisit, sanitasi respons. |
| **Release Build** | Build binary polos tanpa obfuscation (mudah di-reverse engineer via jadx / hopper). | Wajib mengaktifkan `--obfuscate --split-debug-info=symbols/` pada release build. |

---

### 4. Layout, Responsivitas & Animasi

<table>
<tr>
<th width="50%">❌ Sebelum (Rawan Bug & Boros Rebuild)</th>
<th width="50%">✅ Sesudah (Stabil & Performa Tinggi)</th>
</tr>
<tr>
<td>

```dart
// Masalah umum: Unbounded height crash
Column(
  children: [
    Text('Daftar Item'),
    // Expanded di dalam ScrollView memicu RenderFlex overflow!
    Expanded(
      child: ListView(...),
    ),
  ],
)

// AnimationController dibuat di widget tanpa dispose
// memicu memory leak saat pindah screen
```

</td>
<td>

```dart
// Layout terstruktur & aman dari overflow
Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [
    const Text('Daftar Item'),
    // SizedBox atau Flexible terukur dengan constraint jelas
    Flexible(
      child: ListView(...),
    ),
  ],
)

// Animasi implisit aman (tanpa perlu manual controller)
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeInOut,
  height: isExpanded ? 200 : 80,
  child: child,
)
```

</td>
</tr>
<tr>
<td>
🔴 Sering menghasilkan crash <code>RenderFlex overflowed</code>, boros rebuild memori, dan kebocoran controller.
</td>
<td>
🟢 Desain adaptif bebas overflow, prioritas animasi implisit bebas leak, dan hemat baterai/memori.
</td>
</tr>
</table>

---

## 📁 Struktur Proyek

```text
Universal-AI-Coding-Skill/
├── SKILL.md                         # Aturan kanonis utama Universal AI Coding
├── references/                      # Modul referensi teknis spesifik
│   ├── flutter-standards.md         # Aturan wajib Flutter & Dart
│   ├── architecture.md              # Clean Architecture (Presentation, Domain, Data)
│   ├── coding-standards.md          # Standar penulisan & clean code
│   ├── refactoring.md               # Pedoman refactoring & larangan perubahan visual
│   ├── scalability.md               # Skalabilitas & modularisasi
│   ├── security-audit.md            # Standar audit keamanan kode
│   ├── strict-execution.md          # Ketentuan Strict Execution Mode
│   └── anti-slop.md                 # Ringkasan filter anti-slop
├── additional-skills/               # Skill pelengkap modular
│   ├── anti-slop/                   # Aturan Anti-Slop lengkap & aset pembanding
│   └── security-audit-skill/        # Tool & aturan security audit menyeluruh
├── krunner/                         # Zero-dependency CLI generator (.krunner)
│   ├── index.mjs                    # Source code CLI
│   ├── package.json                 # Metadata npm
│   └── README.md                    # Dokumentasi CLI
├── assets/                          # Banner resmi KRunner (krunner-banner.svg)
├── .draft/                          # Folder draft & mentahan pribadi
└── templates/                       # Boilerplate & package helper Flutter
```

---

## 🤖 Dukungan Agen & Ekosistem AI

Dengan mengeksekusi `npx krunner all` (atau memilih platform yang Anda inginkan), **KRunner** otomatis men-generate file konfigurasi dan adapter native untuk seluruh ekosistem AI berikut:

| Platform AI | File / Adapter Otomatis | Status Dukungan |
|:---|:---|:---:|
| **Cursor** | `.cursorrules` | ✅ Penuh (Native) |
| **Claude (Code & Desktop)** | `CLAUDE.md` & `.claude/skills/` | ✅ Penuh (Native) |
| **GitHub Copilot & VS Code** | `.github/copilot-instructions.md` | ✅ Penuh (Native) |
| **Google Antigravity & Gemini CLI** | `.gemini/skills/universal-ai-coding/` | ✅ Penuh (Native) |
| **OpenCode** | `.opencode/skills/` & `instructions.md` | ✅ Penuh (Native) |
| **Kiro AI** | `.kiro/rules.md` | ✅ Penuh (Native) |
| **Ollama (Local LLM)** | `Modelfile.krunner` (Ollama Model Builder) | ✅ Penuh (Native) |
| **9router & OmniRoute** | `.omniroute/` & `krunner-system-prompt.txt` | ✅ Penuh (Native) |
| **Nvidia NIM & AI Workbench** | `.nvidia/prompt.md` | ✅ Penuh (Native) |
| **CommandCode & Continue.dev** | `.continue/rules/krunner.md` | ✅ Penuh (Native) |
| **Windsurf Cascade** | `.windsurfrules` | ✅ Penuh (Native) |
| **Universal Codex Agent** | `.agents/skills/universal-ai-coding/` | ✅ Penuh (Native) |
| **Universal Master** | `.krunner` (Single Source of Truth) | ✅ Penuh (Semua AI) |

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT License**. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

<p align="center">
  Dibuat dengan ❤️ untuk ekosistem developer Flutter yang mendambakan kode berkualitas tinggi dari AI.
</p>
