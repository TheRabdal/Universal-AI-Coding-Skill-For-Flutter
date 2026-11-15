# 🚀 krunner-ai

> Universal CLI Installer untuk memasang standar coding AI Flutter (Clean Architecture, Anti-Slop, Security Audit) ke **semua platform & ekosistem AI coding**.

## ⚡ Penggunaan Cepat

Jalankan perintah berikut di folder project target Anda:

```bash
# Mode interaktif (pilih target platform atau All-in-One)
npx krunner-ai

# Atau langsung pasang untuk SEMUA platform sekaligus
npx krunner-ai all

# Atau pasang untuk platform spesifik
npx krunner-ai install cursor
npx krunner-ai install claude
npx krunner-ai install vscode
npx krunner-ai install gemini
npx krunner-ai install opencode
npx krunner-ai install ollama
npx krunner-ai install router
npx krunner-ai install kiro
npx krunner-ai install nvidia
npx krunner-ai install commandcode
```

---

## 🌐 Platform AI yang Didukung

| Platform AI | File / Adapter yang Dibuat | Cara Kerjanya |
| :--- | :--- | :--- |
| **Universal Master** | `.krunner` | Master single-file bundle yang dapat dibaca oleh AI mana pun. |
| **Cursor** | `.cursorrules` | Dibaca otomatis oleh Cursor AI IDE pada setiap prompt. |
| **Claude Code & Desktop** | `CLAUDE.md` & `.claude/skills/` | File instruksi resmi yang dibaca Claude Code setiap sesi. |
| **GitHub Copilot & VS Code** | `.github/copilot-instructions.md` | Workspace custom instructions resmi untuk GitHub Copilot. |
| **Antigravity & Gemini CLI** | `.gemini/skills/universal-ai-coding/` | Skill native resmi untuk Google Antigravity & Gemini CLI. |
| **OpenCode** | `.opencode/skills/` & `instructions.md` | Skill dan instruksi resmi OpenCode terminal agent. |
| **Kiro AI** | `.kiro/rules.md` | Aturan kerja otomatis untuk Kiro coding agent. |
| **Ollama** | `Modelfile.krunner` | Modelfile siap pakai (`ollama create krunner-flutter -f Modelfile.krunner`). |
| **9router & OmniRoute** | `.omniroute/` & `krunner-system-prompt.txt` | Prompt sistem untuk multi-model routing gateway. |
| **Nvidia NIM & NeMo** | `.nvidia/prompt.md` | System prompt untuk Nvidia NIM & AI Workbench. |
| **CommandCode & Continue** | `.continue/rules/krunner.md` | Aturan resmi untuk Continue.dev dan CommandCode extension. |
| **Windsurf Cascade** | `.windsurfrules` | Aturan otomatis untuk Cascade Agent di Windsurf IDE. |
| **Universal Codex Agent** | `.agents/skills/` | Standar universal agent protocol. |

---

## 📦 Apa yang Termasuk di Dalamnya?
1. **Flutter Standards**: 100% `StatelessWidget`, State Provider / BLoC, Clean Architecture berlapis.
2. **Anti-Slop Filter**: Menghilangkan boilerplate berlebih, penamaan generik, dan kode rapuh khas AI.
3. **Security Audit**: Zero hardcoded secrets, `flutter_secure_storage`, HTTPS & TLS pinning, SAST.
4. **Strict Execution Mode**: AI tidak menjalankan aplikasi secara lokal; quality gate diserahkan ke pipeline CI/CD.
5. **Dynamic Auto-Discovery**: Setiap skill baru yang ditambahkan ke `additional-skills/` otomatis ikut dibundel.
