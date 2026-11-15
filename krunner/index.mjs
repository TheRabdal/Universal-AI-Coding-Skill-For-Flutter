#!/usr/bin/env node

/**
 * krunner — Universal AI Coding Skill For Flutter
 *
 * Terminal Interactive Flow:
 * 1. Welcome (Tulisan Selamat Datang)
 * 2. Pilih Bahasa Percakapan untuk Agent (Bahasa Indonesia / English)
 * 3. Pilih Cakupan Penginstalan (Only this project / Everywhere Global)
 * 4. Pilih Skill AI mana yang mau di-install
 * 5. Loading Animasi Instalasi
 * 6. Tampilan Sudah Selesai Diinstal
 *
 * Zero dependency. Node >= 20.12.0.
 */

import { promises as fs, readFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

// ── Paths ───────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');
const HOME_DIR   = os.homedir();

// ── Version (Dipusatkan di file /VERSION) ────────────────────────
function loadVersion() {
  try {
    const raw = readFileSync(path.join(REPO_ROOT, 'VERSION'), 'utf-8');
    return raw.trim().replace(/^v/i, '');
  } catch {
    return '0.1.0';
  }
}

const VERSION = loadVersion();

// ── ANSI Helpers (Zero Dependency) ──────────────────────────────
const fmt = {
  bold:   (t) => `\x1b[1m${t}\x1b[0m`,
  green:  (t) => `\x1b[32m${t}\x1b[0m`,
  cyan:   (t) => `\x1b[36m${t}\x1b[0m`,
  dim:    (t) => `\x1b[2m${t}\x1b[0m`,
  red:    (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  magenta:(t) => `\x1b[35m${t}\x1b[0m`,
};

// ── 1. TULISAN SELAMAT DATANG ───────────────────────────────────
function showWelcome() {
  const verBadge = `v${VERSION}`.padEnd(8, ' ');
  console.log('');
  console.log(fmt.bold(fmt.cyan('  ╔═══════════════════════════════════════════════════════════════╗')));
  console.log(fmt.bold(fmt.cyan(`  ║                     🚀  KRunner  ${verBadge}                    ║`)));
  console.log(fmt.bold(fmt.cyan('  ║           Universal AI Coding Skill For Flutter               ║')));
  console.log(fmt.bold(fmt.cyan('  ╚═══════════════════════════════════════════════════════════════╝')));
  console.log('');
  console.log(`  ${fmt.bold('Selamat datang di KRunner!')}`);
  console.log(`  ${fmt.dim('Standar AI coding presisi tinggi untuk ekosistem Flutter & Dart.')}`);
  console.log(`  ${fmt.dim('100% Stateless • Clean Architecture • Anti-Slop • Security Audited')}`);
  console.log('');
}

// ── Loading Animation Helper ────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function showLoadingStep(text, durationMs = 380) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const start = Date.now();
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const frame = frames[i++ % frames.length];
      process.stdout.write(`\r  ${fmt.cyan(frame)} ${text}...`);
      if (Date.now() - start >= durationMs) {
        clearInterval(timer);
        process.stdout.write(`\r  ${fmt.green('✓')} ${text} ${fmt.dim('selesai')}\n`);
        resolve();
      }
    }, 60);
  });
}

// ── File & Directory Utilities ──────────────────────────────────
async function readSafe(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

const IGNORE_MD = /^(CODE_OF_CONDUCT|CONTRIBUTING|SECURITY|ROADMAP|PULL_REQUEST_TEMPLATE|LICENSE)\.md$/i;

async function readAllMd(dirPath) {
  const results = [];
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...await readAllMd(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (IGNORE_MD.test(entry.name)) continue;
      const content = await readSafe(full);
      if (content) {
        results.push({ name: path.relative(REPO_ROOT, full), content });
      }
    }
  }
  return results;
}

// ── Build Master Content with Language Directive ────────────────
async function buildKrunner(lang = 'id', scope = 'project') {
  const sections = [];
  const isEn = lang === 'en';

  const scopeNote = scope === 'global'
    ? (isEn ? 'Global (Everywhere on this machine)' : 'Global (Seluruh project di komputer ini)')
    : (isEn ? 'Local Project' : 'Project Lokal');

  // Language Directive at the very top
  const langDirective = isEn
    ? `# ==============================================================================
# CONVERSATION LANGUAGE DIRECTIVE (MANDATORY)
# ==============================================================================
# The user has explicitly selected: ENGLISH
# Installation Scope: ${scopeNote}
# - You MUST conduct all conversations, explanations, reviews, and reports in ENGLISH.
# - Keep technical terms, identifiers, package names, and API code in their standard form.
# - Avoid verbose explanations; keep code solutions concise, clean, and direct.
# ==============================================================================`
    : `# ==============================================================================
# DIREKTIF BAHASA PERCAKAPAN (WAJIB)
# ==============================================================================
# Pengguna telah secara eksplisit memilih: BAHASA INDONESIA
# Cakupan Penginstalan: ${scopeNote}
# - Anda WAJIB menggunakan BAHASA INDONESIA untuk seluruh percakapan, penjelasan, dan laporan akhir.
# - Pertahankan istilah teknis, API, keyword, nama package, dan identifier sesuai konvensi bahasa/framework.
# - Hindari penjelasan bertele-tele; berikan solusi kode yang ringkas, bersih, dan langsung ke sasaran.
# ==============================================================================`;

  // Header
  sections.push(`# .krunner — Universal AI Coding Skill For Flutter
# Generated by krunner v${VERSION}
# Language: ${isEn ? 'English' : 'Bahasa Indonesia'}
# Scope: ${scopeNote}
# Date: ${new Date().toISOString()}
#
# FILE INI ADALAH INSTRUKSI UNTUK AI.
# AI yang bekerja pada project ini WAJIB membaca dan mengikuti
# seluruh aturan di bawah. Tidak ada pengecualian.

${langDirective}
`);

  // Section 1: SKILL.md
  let skillMd = await readSafe(path.join(REPO_ROOT, 'SKILL.md'));
  if (skillMd) {
    if (isEn) {
      skillMd = skillMd.replace(
        /## Bahasa[\s\S]*?(?=## Aturan universal)/i,
        `## Language\n\n- Use English for conversations, explanations, and final reports.\n- Keep technical terms, APIs, keywords, package names, and identifiers standard.\n- Avoid verbose explanations.\n\n`
      );
    }
    sections.push(`${'='.repeat(80)}
## BAGIAN 1: ATURAN UTAMA (SKILL.md)
${'='.repeat(80)}

${skillMd.trim()}
`);
  }

  // Section 2: References
  const refsDir = path.join(REPO_ROOT, 'references');
  const refs = await readAllMd(refsDir);
  if (refs.length) {
    sections.push(`${'='.repeat(80)}
## BAGIAN 2: REFERENCES
${'='.repeat(80)}
`);
    for (const ref of refs) {
      sections.push(`${'─'.repeat(60)}
### ${ref.name}
${'─'.repeat(60)}

${ref.content.trim()}
`);
    }
  }

  // Section 3+: Dynamic Additional Skills
  const addSkillsDir = path.join(REPO_ROOT, 'additional-skills');
  let addSkillEntries = [];
  try {
    addSkillEntries = await fs.readdir(addSkillsDir, { withFileTypes: true });
  } catch {}

  addSkillEntries.sort((a, b) => a.name.localeCompare(b.name));

  let sectionIndex = 3;
  for (const entry of addSkillEntries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(addSkillsDir, entry.name);

    if (entry.isDirectory()) {
      const files = await readAllMd(fullPath);
      if (files.length > 0) {
        const title = entry.name.replace(/[-_]/g, ' ').toUpperCase();
        sections.push(`${'='.repeat(80)}
## BAGIAN ${sectionIndex}: ADDITIONAL SKILL — ${title}
${'='.repeat(80)}
`);
        for (const file of files) {
          sections.push(`${'─'.repeat(60)}
### ${file.name}
${'─'.repeat(60)}

${file.content.trim()}
`);
        }
        sectionIndex++;
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (IGNORE_MD.test(entry.name)) continue;
      const content = await readSafe(fullPath);
      if (content) {
        const title = entry.name.replace(/\.md$/i, '').replace(/[-_]/g, ' ').toUpperCase();
        sections.push(`${'='.repeat(80)}
## BAGIAN ${sectionIndex}: ADDITIONAL SKILL — ${title}
${'='.repeat(80)}

${content.trim()}
`);
        sectionIndex++;
      }
    }
  }

  // Footer
  sections.push(`${'='.repeat(80)}
## AKHIR INSTRUKSI
##
## AI yang bekerja pada project ini WAJIB mematuhi seluruh aturan di atas.
## Jika ada konflik antar bagian, gunakan urutan prioritas:
##   1. Instruksi eksplisit terbaru dari pengguna & Bahasa percakapan pilihan (${isEn ? 'English' : 'Bahasa Indonesia'})
##   2. SKILL.md (Bagian 1)
##   3. References & Additional Skills (Bagian 2 dst.)
${'='.repeat(80)}
`);

  return sections.join('\n');
}

// ── 4. DAFTAR PILIHAN SKILL AI (DENGAN ADAPTER PROJECT & GLOBAL) ─
const ADAPTERS = {
  cursor: {
    id: 'cursor',
    icon: '🖱️ ',
    name: 'Cursor (.cursorrules)',
    desc: 'Aturan otomatis untuk Cursor AI IDE',
    async install(targetRoot, content, lang, scope) {
      const isEn = lang === 'en';
      const langNote = isEn
        ? 'Language: Conduct all conversations and explanations in English.'
        : 'Bahasa: Seluruh percakapan dan penjelasan wajib menggunakan Bahasa Indonesia.';

      const rule = `# .cursorrules - KRunner Flutter Standards
# Target Scope: ${scope.toUpperCase()}

Anda adalah AI Flutter Engineer yang WAJIB mematuhi seluruh aturan di file .krunner.
${langNote}

Aturan Pokok:
1. 100% StatelessWidget (StatefulWidget & setState DILARANG TOTAL).
2. State Management via Provider atau BLoC. Jangan campur dalam satu domain.
3. Clean Architecture: UI -> State -> UseCase -> Repository -> DataSource.
4. Anti-Slop: Tidak ada kode/UI generik, tidak ada komentar obvious.
5. Keamanan: Zero hardcoded secrets, gunakan flutter_secure_storage.
6. Strict Execution: Jangan jalankan project/build secara lokal.

Aturan lengkap dan referensi teknis tersedia di: .krunner
`;
      const out = path.join(targetRoot, '.cursorrules');
      await fs.writeFile(out, rule, 'utf-8');
      return [out];
    }
  },
  claude: {
    id: 'claude',
    icon: '🤖',
    name: 'Claude (CLAUDE.md & .claude/skills/)',
    desc: 'Aturan kerja untuk Claude Code terminal & desktop',
    async install(targetRoot, content, lang, scope) {
      const isEn = lang === 'en';
      const langNote = isEn
        ? '- Language: Conduct all conversations, answers, and reports in English.'
        : '- Bahasa percakapan: Seluruh percakapan, penjelasan, dan laporan WAJIB dalam Bahasa Indonesia.';

      const rule = `# CLAUDE.md - KRunner Flutter Standards
# Scope: ${scope.toUpperCase()}
# Claude Code otomatis membaca file ini pada setiap prompt/turn.

Anda WAJIB mematuhi seluruh aturan coding Flutter di file .krunner.

Ringkasan Aturan:
${langNote}
- Semua widget wajib StatelessWidget (StatefulWidget & setState dilarang total).
- State, lifecycle, dan business logic di Provider / BLoC.
- Clean Architecture berlapis wajib dipatuhi: UI -> State -> UseCase -> Repository -> DataSource.
- Anti-slop aktif: Kode bersih, tanpa boilerplate berlebih, desain UI terarah.
- Strict Execution Mode: Jangan menjalankan aplikasi/build lokal.

Baca file .krunner untuk detail aturan lengkap dan pedoman security audit.
`;
      const claudeMd = path.join(targetRoot, 'CLAUDE.md');
      await fs.writeFile(claudeMd, rule, 'utf-8');

      const skillDir = path.join(targetRoot, '.claude', 'skills', 'universal-ai-coding');
      await fs.mkdir(skillDir, { recursive: true });
      const skillFile = path.join(skillDir, 'SKILL.md');
      await fs.writeFile(skillFile, content, 'utf-8');
      return [claudeMd, skillFile];
    }
  },
  vscode: {
    id: 'vscode',
    icon: '💻',
    name: 'GitHub Copilot & VS Code (.github/copilot-instructions.md)',
    desc: 'Workspace instructions resmi untuk GitHub Copilot',
    async install(targetRoot, content, lang, scope) {
      const isEn = lang === 'en';
      const copilotDir = path.join(targetRoot, '.github');
      await fs.mkdir(copilotDir, { recursive: true });
      const langNote = isEn
        ? '- Communication language: English.'
        : '- Bahasa komunikasi: Bahasa Indonesia.';

      const rule = `# GitHub Copilot Custom Instructions - KRunner
# Target Scope: ${scope.toUpperCase()}
# File ini otomatis dibaca oleh GitHub Copilot di VS Code & JetBrains.

Project ini menerapkan standar coding ketat KRunner untuk Flutter & Dart.
Anda WAJIB membaca dan mematuhi seluruh aturan di file .krunner.

Aturan Wajib:
${langNote}
- 100% StatelessWidget (StatefulWidget dilarang total).
- State Provider (tugas) atau BLoC (enterprise).
- Clean Architecture: Presentation -> Domain -> Data.
- Dilarang hardcode secret / API key.
- Rujukan lengkap dapat dibaca di: .krunner
`;
      const file = path.join(copilotDir, 'copilot-instructions.md');
      await fs.writeFile(file, rule, 'utf-8');
      return [file];
    }
  },
  gemini: {
    id: 'gemini',
    icon: '🪐',
    name: 'Google Antigravity & Gemini CLI (.gemini/skills/)',
    desc: 'Skill resmi untuk Antigravity IDE & Gemini CLI',
    async install(targetRoot, content) {
      const skillDir = path.join(targetRoot, '.gemini', 'skills', 'universal-ai-coding');
      await fs.mkdir(skillDir, { recursive: true });
      const file = path.join(skillDir, 'SKILL.md');
      await fs.writeFile(file, content, 'utf-8');
      return [file];
    }
  },
  opencode: {
    id: 'opencode',
    icon: '🔓',
    name: 'OpenCode (.opencode/skills/ & instructions.md)',
    desc: 'Skill & instruksi native untuk OpenCode Agent',
    async install(targetRoot, content) {
      const dir = path.join(targetRoot, '.opencode', 'skills', 'universal-ai-coding');
      await fs.mkdir(dir, { recursive: true });
      const skillFile = path.join(dir, 'SKILL.md');
      await fs.writeFile(skillFile, content, 'utf-8');

      const instFile = path.join(targetRoot, '.opencode', 'instructions.md');
      await fs.writeFile(instFile, content, 'utf-8');

      // If global, also place in standard ~/.config/opencode/skills/
      const res = [skillFile, instFile];
      if (targetRoot === HOME_DIR) {
        const configDir = path.join(HOME_DIR, '.config', 'opencode', 'skills', 'universal-ai-coding');
        await fs.mkdir(configDir, { recursive: true });
        const cfgFile = path.join(configDir, 'SKILL.md');
        await fs.writeFile(cfgFile, content, 'utf-8');
        res.push(cfgFile);
      }
      return res;
    }
  },
  kiro: {
    id: 'kiro',
    icon: '🎯',
    name: 'Kiro AI (.kiro/rules.md)',
    desc: 'Aturan kerja untuk Kiro coding agent',
    async install(targetRoot, content) {
      const dir = path.join(targetRoot, '.kiro');
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, 'rules.md');
      await fs.writeFile(file, content, 'utf-8');
      return [file];
    }
  },
  ollama: {
    id: 'ollama',
    icon: '🦙',
    name: 'Ollama (Modelfile.krunner)',
    desc: 'Modelfile siap pakai untuk local LLM (ollama create)',
    async install(targetRoot, content) {
      const escaped = content.replace(/"""/g, "'''");
      const modelFile = `# Modelfile - KRunner Flutter Model
# Jalankan di terminal:
#   ollama create krunner-flutter -f Modelfile.krunner
#   ollama run krunner-flutter

FROM qwen2.5-coder:latest

PARAMETER temperature 0.2
PARAMETER top_p 0.95

SYSTEM """
${escaped}
"""
`;
      const file = path.join(targetRoot, 'Modelfile.krunner');
      await fs.writeFile(file, modelFile, 'utf-8');
      return [file];
    }
  },
  router: {
    id: 'router',
    icon: '🔀',
    name: '9router & OmniRoute (System Prompt Gateway)',
    desc: 'Prompt sistem untuk multi-model routing gateway',
    async install(targetRoot, content) {
      const dir = path.join(targetRoot, '.omniroute');
      await fs.mkdir(dir, { recursive: true });
      const f1 = path.join(dir, 'system-prompt.txt');
      await fs.writeFile(f1, content, 'utf-8');

      const f2 = path.join(targetRoot, 'krunner-system-prompt.txt');
      await fs.writeFile(f2, content, 'utf-8');
      return [f1, f2];
    }
  },
  nvidia: {
    id: 'nvidia',
    icon: '🟢',
    name: 'Nvidia NIM & AI Workbench (.nvidia/prompt.md)',
    desc: 'System prompt untuk Nvidia NIM & NeMo Guardrails',
    async install(targetRoot, content) {
      const dir = path.join(targetRoot, '.nvidia');
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, 'prompt.md');
      await fs.writeFile(file, content, 'utf-8');
      return [file];
    }
  },
  commandcode: {
    id: 'commandcode',
    icon: '⚡',
    name: 'CommandCode & Continue.dev (.continue/rules/)',
    desc: 'Aturan kerja untuk CommandCode & Continue extension',
    async install(targetRoot, content) {
      const dir = path.join(targetRoot, '.continue', 'rules');
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, 'krunner.md');
      await fs.writeFile(file, content, 'utf-8');
      return [file];
    }
  },
  windsurf: {
    id: 'windsurf',
    icon: '🌊',
    name: 'Windsurf Cascade (.windsurfrules)',
    desc: 'Aturan kerja untuk Windsurf IDE',
    async install(targetRoot, content, lang, scope) {
      const isEn = lang === 'en';
      const langNote = isEn
        ? '- Language: Conduct all conversations in English.'
        : '- Bahasa percakapan: Wajib menggunakan Bahasa Indonesia.';

      const rule = `# .windsurfrules - KRunner Flutter Standards
# Scope: ${scope.toUpperCase()}
Cascade Agent WAJIB mematuhi seluruh aturan di file .krunner.

${langNote}
- 100% StatelessWidget (StatefulWidget & setState dilarang).
- State via Provider / BLoC.
- Clean Architecture berlapis: UI -> State -> UseCase -> Repository -> DataSource.
- Anti-slop aktif: Kode bersih, tanpa komentar obvious.
- Zero hardcoded secrets.

Aturan lengkap: .krunner
`;
      const file = path.join(targetRoot, '.windsurfrules');
      await fs.writeFile(file, rule, 'utf-8');
      return [file];
    }
  },
  universal: {
    id: 'universal',
    icon: '📄',
    name: 'Universal Master (.krunner saja)',
    desc: 'Master single-file bundle untuk semua AI',
    async install(targetRoot, content) {
      const file = path.join(targetRoot, '.krunner');
      await fs.writeFile(file, content, 'utf-8');
      return [file];
    }
  }
};

// ── 5. PROSES LOADING & SELESAI DIINSTAL ─────────────────────────
async function runInstallation(scope, targetKeys, lang = 'id', projectDir = process.cwd()) {
  const isGlobal = scope === 'global';
  const targetRoot = isGlobal ? HOME_DIR : projectDir;
  const isEn = lang === 'en';
  const langLabel = isEn ? 'English 🇬🇧' : 'Bahasa Indonesia 🇮🇩';
  const scopeLabel = isGlobal
    ? '🌍 Everywhere / Global (Seluruh Project di Komputer)'
    : '📁 Only This Project (Hanya di Project Ini)';

  console.log('');
  console.log(fmt.bold('⚙️  Memulai proses instalasi KRunner...'));
  console.log(`   ${fmt.dim('Cakupan Instalasi:')} ${fmt.cyan(fmt.bold(scopeLabel))}`);
  console.log(`   ${fmt.dim('Target Direktori :')} ${fmt.cyan(targetRoot)}`);
  console.log(`   ${fmt.dim('Bahasa Agent AI  :')} ${fmt.cyan(fmt.bold(langLabel))}`);
  console.log('');

  // ── Tahap Loading 1 ──
  await showLoadingStep(`Mengonfigurasi cakupan instalasi (${isGlobal ? 'Global' : 'Project'})`, 300);

  // ── Tahap Loading 2 ──
  await showLoadingStep(`Menerapkan direktif bahasa (${langLabel})`, 350);

  // ── Tahap Loading 3 ──
  await showLoadingStep('Menyiapkan aturan inti Flutter & Dart (SKILL.md)', 350);

  // ── Tahap Loading 4 ──
  await showLoadingStep('Memuat modul referensi (Clean Architecture, Testing, Security)', 380);

  // ── Tahap Loading 5 ──
  await showLoadingStep('Mengintegrasikan filter Anti-Slop & panduan kualitas UI', 380);

  // ── Tahap Loading 6 ──
  await showLoadingStep('Membangun master file .krunner', 450);

  // Compile content with language & scope
  const content = await buildKrunner(lang, scope);

  // Always write master .krunner to targetRoot
  const masterKrunner = path.join(targetRoot, '.krunner');
  await fs.writeFile(masterKrunner, content, 'utf-8');
  const createdFiles = [masterKrunner];

  // ── Tahap Loading 7 ──
  await showLoadingStep(`Memasang adapter untuk ${targetKeys.length} platform AI yang dipilih`, 480);

  for (const key of targetKeys) {
    if (key === 'universal') continue;
    const adapter = ADAPTERS[key];
    if (adapter) {
      const files = await adapter.install(targetRoot, content, lang, scope);
      createdFiles.push(...files);
    }
  }

  await sleep(200);

  // ── 6. TAMPILAN SUDAH SELESAI DIINSTAL ─────────────────────────
  console.log('');
  console.log(fmt.bold(fmt.green('  ╔═══════════════════════════════════════════════════════════════╗')));
  console.log(fmt.bold(fmt.green('  ║                 🎉  SUDAH SELESAI DIINSTAL!                   ║')));
  console.log(fmt.bold(fmt.green('  ╚═══════════════════════════════════════════════════════════════╝')));
  console.log('');
  console.log(`  ${fmt.bold(fmt.green('✅ Berhasil!'))} Seluruh aturan KRunner telah dipasang.`);
  console.log(`  ${fmt.dim('Cakupan        :')} ${fmt.cyan(fmt.bold(scopeLabel))}`);
  console.log(`  ${fmt.dim('Bahasa Agent   :')} ${fmt.cyan(fmt.bold(langLabel))}`);
  console.log(`  ${fmt.dim('Lokasi Basis   :')} ${fmt.dim(targetRoot)}`);
  console.log('');
  console.log(`  ${fmt.bold('📁 File & Adapter yang Berhasil Dibuat:')}`);
  for (const f of createdFiles) {
    console.log(`     ${fmt.green('→')} ${fmt.cyan(f)}`);
  }
  console.log('');
  console.log(`  ${fmt.bold('💡 Langkah Selanjutnya:')}`);
  if (isGlobal) {
    console.log(`     ${fmt.dim('1. Aturan KRunner kini aktif secara GLOBAL untuk seluruh project di komputer Anda.')}`);
    console.log(`     ${fmt.dim('2. Buka project Flutter apa pun di editor/AI Anda, AI akan otomatis membaca aturan ini.')}`);
  } else {
    console.log(`     ${fmt.dim('1. Buka project ini di editor/AI pilihan Anda.')}`);
    console.log(`     ${fmt.dim('2. AI akan otomatis mendeteksi aturan dan menghasilkan kode Flutter standar KRunner.')}`);
  }
  console.log(`     ${fmt.dim('3. Selamat coding!')} 🚀`);
  console.log('');
}

// ── Interactive Flow: Welcome -> Bahasa -> Scope -> Skill -> Selesai
async function showInteractiveMenu(projectRoot) {
  // 1. WELCOME
  showWelcome();

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((r) => rl.question(q, r));

  // 2. PILIH BAHASA PERCAKAPAN
  console.log(fmt.bold('🌐 Langkah 1/3: Pilih bahasa percakapan untuk Agent AI:'));
  console.log(`  ${fmt.cyan('1')}. 🇮🇩 ${fmt.bold('Bahasa Indonesia')} ${fmt.dim('(Rekomendasi / Default)')}`);
  console.log(`  ${fmt.cyan('2')}. 🇬🇧 ${fmt.bold('English')}`);
  console.log('');

  const langInput = (await ask('Pilih bahasa [1/2] (default: 1): ')).trim();
  const selectedLang = langInput === '2' ? 'en' : 'id';
  const langLabel = selectedLang === 'en' ? 'English 🇬🇧' : 'Bahasa Indonesia 🇮🇩';
  console.log(`  ${fmt.green('✓')} Bahasa dipilih: ${fmt.bold(langLabel)}\n`);

  // 3. PILIH CAKUPAN PENGINSTALAN (SCOPE)
  console.log(fmt.bold('📍 Langkah 2/3: Pilih cakupan penginstalan KRunner:'));
  console.log(`  ${fmt.cyan('1')}. 📁 ${fmt.bold('Only this project')} ${fmt.dim(`— Hanya aktif di project ini (${path.basename(projectRoot)})`)}`);
  console.log(`  ${fmt.cyan('2')}. 🌍 ${fmt.bold('Everywhere / Global')} ${fmt.dim('— Aktif untuk SEMUA project di komputer ini (~/)')}`);
  console.log('');

  const scopeInput = (await ask('Pilih cakupan [1/2] (default: 1): ')).trim();
  const selectedScope = scopeInput === '2' ? 'global' : 'project';
  const scopeLabel = selectedScope === 'global' ? 'Everywhere / Global (~/)' : 'Only this project (./)';
  console.log(`  ${fmt.green('✓')} Cakupan dipilih: ${fmt.bold(scopeLabel)}\n`);

  // 4. PILIH SKILL / PLATFORM AI
  console.log(fmt.bold('⚙️  Langkah 3/3: Silakan pilih skill AI mana yang mau di-install:\n'));
  console.log(`  ${fmt.cyan('1')}. 🌐 ${fmt.bold('All-in-One')} ${fmt.dim('— (Pasang untuk SEMUA Platform AI)')}`);

  const keys = Object.keys(ADAPTERS);
  keys.forEach((k, idx) => {
    const item = ADAPTERS[k];
    console.log(`  ${fmt.cyan(String(idx + 2))}. ${item.icon} ${item.name}`);
  });
  console.log('');

  const answer = (await ask('Pilih nomor skill (default: 1 untuk SEMUA platform): ')).trim();
  rl.close();

  let chosen = [];
  if (!answer || answer === '1') {
    chosen = keys;
  } else {
    for (const tok of answer.split(',')) {
      const n = parseInt(tok.trim(), 10);
      if (n === 1) { chosen = keys; break; }
      const idx = n - 2;
      if (idx >= 0 && idx < keys.length) chosen.push(keys[idx]);
    }
  }

  if (!chosen.length) {
    console.log(fmt.yellow('  Pilihan tidak dikenali. Memasang All-in-One secara default...\n'));
    chosen = keys;
  }

  // 5 & 6. LOADING & SELESAI
  await runInstallation(selectedScope, chosen, selectedLang, projectRoot);
}

// ── Main Entrypoint ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  // Extract flags
  let explicitLang = 'id';
  const langArg = args.find((a) => a.startsWith('--lang='));
  if (langArg) {
    const val = langArg.split('=')[1]?.toLowerCase();
    if (val === 'en' || val === 'english') explicitLang = 'en';
  }

  let explicitScope = 'project';
  if (args.includes('--global') || args.includes('-g') || args.includes('global') || args.includes('everywhere')) {
    explicitScope = 'global';
  }

  if (args.includes('--help') || args.includes('-h')) {
    showWelcome();
    console.log(`${fmt.bold('Penggunaan:')}
  ${fmt.cyan('npx krunner')}                    Runtutan interaktif:
                                   Welcome ➔ Pilih Bahasa ➔ Pilih Cakupan (Project/Global) ➔ Pilih Skill ➔ Selesai

  ${fmt.cyan('npx krunner all')}                Pasang untuk SEMUA platform di project ini
  ${fmt.cyan('npx krunner all --global')}       Pasang untuk SEMUA platform secara GLOBAL (Everywhere)
  ${fmt.cyan('npx krunner all --lang=en')}      Pasang SEMUA platform dengan bahasa English
  ${fmt.cyan('npx krunner install <target>')}    Pasang untuk platform tertentu (cursor, claude, ollama, dll.)
  ${fmt.cyan('npx krunner --version')}          Tampilkan versi
`);
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(VERSION);
    return;
  }

  const projectRoot = process.cwd();

  // Guard: jangan jalankan di dalam repo krunner sendiri jika scope = project
  if (explicitScope === 'project' && path.resolve(projectRoot) === path.resolve(REPO_ROOT)) {
    console.log('');
    console.log(fmt.red('  ✗ Anda sedang berada di dalam repo krunner.'));
    console.log('    Pindah ke folder project target Anda terlebih dahulu:');
    console.log(fmt.dim('    cd ~/my-flutter-project'));
    console.log(fmt.dim('    npx krunner'));
    console.log('');
    console.log('    Atau pasang secara global ke seluruh komputer:');
    console.log(fmt.dim('    npx krunner all --global'));
    console.log('');
    process.exit(1);
  }

  const allKeys = Object.keys(ADAPTERS);

  // Subcommand: all
  if (args[0] === 'all' || args.includes('--all')) {
    showWelcome();
    await runInstallation(explicitScope, allKeys, explicitLang, projectRoot);
    return;
  }

  // Subcommand: install <target>
  if (args[0] === 'install') {
    showWelcome();
    const target = args[1]?.toLowerCase();
    if (!target || target === 'all') {
      await runInstallation(explicitScope, allKeys, explicitLang, projectRoot);
    } else if (ADAPTERS[target]) {
      await runInstallation(explicitScope, [target], explicitLang, projectRoot);
    } else {
      console.error(fmt.red(`\n  Target tidak dikenal: ${target}`));
      console.log(`  Target yang tersedia: ${allKeys.join(', ')}, all\n`);
      process.exit(1);
    }
    return;
  }

  // Jika dipanggil nama adapter langsung (misal: npx krunner cursor)
  const direct = args[0]?.toLowerCase().replace(/^--/, '');
  if (direct && ADAPTERS[direct]) {
    showWelcome();
    await runInstallation(explicitScope, [direct], explicitLang, projectRoot);
    return;
  }

  // Tanpa argumen -> Runtutan Interaktif Penuh:
  // Welcome -> Bahasa -> Scope (Project / Everywhere) -> Skill -> Selesai
  await showInteractiveMenu(projectRoot);
}

main().catch((err) => {
  console.error(fmt.red('\n  Error:'), err.message || err);
  process.exit(1);
});
