#!/usr/bin/env node

/**
 * krunner — Universal AI Coding Skill For Flutter
 *
 * Terminal Interactive Flow:
 * 1. Welcome (Tulisan Selamat Datang)
 * 2. Pilih Bahasa Percakapan untuk Agent (Bahasa Indonesia / English)
 * 3. Pilih Cakupan Penginstalan (Only this project / Everywhere Global)
 * 4. Pilih platform AI yang mau di-install
 * 5. Pilih additional-skills opsional
 * 6. Loading animasi instalasi
 * 7. Tampilan instalasi selesai
 *
 * Zero dependency. Node >= 20.12.0.
 */

import { promises as fs, existsSync, readFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { createInterface, emitKeypressEvents } from 'readline';
import { fileURLToPath } from 'url';

// ── Paths ───────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');
const HOME_DIR   = os.homedir();
const PACKAGE_DATA_ROOT = path.join(__dirname, 'resources');
const CONTENT_ROOT = existsSync(path.join(REPO_ROOT, '.draft', 'rules coding by TheRabdal.md'))
  ? REPO_ROOT
  : PACKAGE_DATA_ROOT;
const DRAFT_ROOT = CONTENT_ROOT === REPO_ROOT ? '.draft' : 'draft';

function loadVersion() {
  try {
    const version = readFileSync(path.join(CONTENT_ROOT, 'VERSION'), 'utf-8')
      .trim()
      .replace(/^v/i, '');
    if (version) return version;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const packageJson = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  const packageVersion = packageJson.version;
  if (packageVersion && !packageVersion.startsWith('$')) return packageVersion;
  throw new Error('Versi KRunner tidak ditemukan di VERSION atau package.json.');
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
};

// ── 1. TULISAN SELAMAT DATANG ───────────────────────────────────
function printBoxed(text, color) {
  const width = Math.max(54, text.length);
  const padding = width - text.length;
  const left = Math.floor(padding / 2);
  const border = `+${'-'.repeat(width)}+`;
  const content = `${' '.repeat(left)}${text}${' '.repeat(padding - left)}`;

  console.log(color(`  ${border}`));
  console.log(color(`  |${content}|`));
  console.log(color(`  ${border}`));
}

function showWelcome() {
  console.log('');
  printBoxed(`KRunner v${VERSION}`, (text) => fmt.bold(fmt.cyan(text)));
  console.log('');
  console.log(`  ${fmt.bold('Universal AI Coding Skill for Flutter')}`);
  console.log(`  ${fmt.dim('Clean code | Anti-slop | Security | Strict execution')}`);
  console.log('');
}

// ── Loading Animation Helper ────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function showLoadingStep(text, durationMs = 380) {
  const frames = ['|', '/', '-', '\\'];
  let i = 0;
  const start = Date.now();
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const frame = frames[i++ % frames.length];
      process.stdout.write(`\r  ${fmt.cyan(frame)} ${text}...`);
      if (Date.now() - start >= durationMs) {
        clearInterval(timer);
        process.stdout.write(`\r  ${fmt.green('[OK]')} ${text}\n`);
        resolve();
      }
    }, 60);
  });
}

// ── File & Directory Utilities ──────────────────────────────────
const IGNORE_MD = /^(CODE_OF_CONDUCT|CONTRIBUTING|SECURITY|ROADMAP|PULL_REQUEST_TEMPLATE|LICENSE)\.md$/i;

async function readAllMd(dirPath) {
  const results = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...await readAllMd(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (IGNORE_MD.test(entry.name)) continue;
      const content = await fs.readFile(full, 'utf-8');
      results.push({ name: path.relative(CONTENT_ROOT, full), content });
    }
  }
  return results;
}

async function readAllLicenseFiles(dirPath) {
  const results = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...await readAllLicenseFiles(full));
    } else if (entry.isFile() && /^LICENSE(?:$|[._-])/i.test(entry.name)) {
      results.push({
        name: path.relative(CONTENT_ROOT, full),
        content: await fs.readFile(full, 'utf-8'),
      });
    }
  }
  return results;
}

async function listAdditionalSkills() {
  const skillsDir = path.join(CONTENT_ROOT, 'additional-skills');
  let entries;
  try {
    entries = await fs.readdir(skillsDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));
  const skills = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(skillsDir, entry.name);

    if (entry.isDirectory()) {
      const files = await readAllMd(fullPath);
      if (files.length > 0) {
        skills.push({
          id: `dir:${entry.name}`,
          label: entry.name.replace(/[-_]/g, ' '),
          files,
          licenseFiles: await readAllLicenseFiles(fullPath),
        });
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && !IGNORE_MD.test(entry.name)) {
      skills.push({
        id: `file:${entry.name}`,
        label: entry.name.replace(/\.md$/i, '').replace(/[-_]/g, ' '),
        files: [{
          name: path.relative(CONTENT_ROOT, fullPath),
          content: await fs.readFile(fullPath, 'utf-8'),
        }],
        licenseFiles: [],
      });
    }
  }
  return skills;
}

// ── Build Master Content with Language Directive ────────────────
async function buildKrunner(lang = 'id', scope = 'project', additionalSkills = []) {
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

  const masterRules = await fs.readFile(
    path.join(CONTENT_ROOT, DRAFT_ROOT, 'rules coding by TheRabdal.md'),
    'utf-8',
  );
  sections.push(`${'='.repeat(80)}
## BAGIAN 1: ATURAN MASTER (.draft)
${'='.repeat(80)}

${masterRules.trim()}
`);

  // Section 2: SKILL.md
  let skillMd = await fs.readFile(path.join(CONTENT_ROOT, 'SKILL.md'), 'utf-8');
  if (isEn) {
    skillMd = skillMd.replace(
      /## Bahasa[\s\S]*?(?=## Aturan universal)/i,
      `## Language\n\n- Use English for conversations, explanations, and final reports.\n- Keep technical terms, APIs, keywords, package names, and identifiers standard.\n- Avoid verbose explanations.\n\n`
    );
  }
  sections.push(`${'='.repeat(80)}
## BAGIAN 2: ATURAN PENDUKUNG (SKILL.md)
${'='.repeat(80)}

${skillMd.trim()}
`);

  // Section 3: References
  const refsDir = path.join(CONTENT_ROOT, 'references');
  const refs = await readAllMd(refsDir);
  if (refs.length) {
    sections.push(`${'='.repeat(80)}
## BAGIAN 3: REFERENCES
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

  let sectionIndex = 4;
  for (const skill of additionalSkills) {
    sections.push(`${'='.repeat(80)}
## BAGIAN ${sectionIndex}: ADDITIONAL SKILL — ${skill.label.toUpperCase()}
${'='.repeat(80)}
`);
    for (const file of skill.files) {
      sections.push(`${'─'.repeat(60)}
### ${file.name}
${'─'.repeat(60)}

${file.content.trim()}
`);
    }
    if (skill.licenseFiles.length > 0) {
      sections.push(`${'─'.repeat(60)}
### LICENSE NOTICES
${'─'.repeat(60)}
`);
      for (const license of skill.licenseFiles) {
        sections.push(`#### ${license.name}

${license.content.trim()}
`);
      }
    }
    sectionIndex++;
  }

  // Footer
  sections.push(`${'='.repeat(80)}
## AKHIR INSTRUKSI
##
## AI yang bekerja pada project ini WAJIB mematuhi seluruh aturan di atas.
## Jika ada konflik antar bagian, gunakan urutan prioritas:
##   1. Instruksi eksplisit terbaru dari pengguna & kebijakan platform
##   2. Aturan master .draft (Bagian 1)
##   3. SKILL.md (Bagian 2)
##   4. References (Bagian 3)
##   5. Additional Skills terpilih (Bagian 4 dst.); tidak boleh melemahkan aturan sebelumnya
${'='.repeat(80)}
`);

  return sections.join('\n');
}

// ── 4. DAFTAR PILIHAN SKILL AI (DENGAN ADAPTER PROJECT & GLOBAL) ─
const ADAPTERS = {
  cursor: {
    id: 'cursor',
    icon: '[CUR]',
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
2. State Management: Provider untuk tugas/state ringan, BLoC untuk enterprise. Jangan campur dalam satu domain.
3. Clean Architecture: UI -> State -> UseCase -> Repository -> DataSource.
4. Anti-Slop: Tidak ada kode/UI generik, tidak ada komentar obvious.
5. Keamanan: Zero hardcoded secrets, gunakan flutter_secure_storage.
6. Strict Execution: Jangan jalankan project, test, server, atau build; test dijalankan manual oleh pemilik project.

Aturan lengkap dan referensi teknis tersedia di: .krunner
`;
      const out = path.join(targetRoot, '.cursorrules');
      await fs.writeFile(out, rule, 'utf-8');
      return [out];
    }
  },
  claude: {
    id: 'claude',
    icon: '[CLA]',
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
- Provider untuk tugas/state ringan, BLoC untuk enterprise; lifecycle dan business logic dikelola di state layer.
- Clean Architecture berlapis wajib dipatuhi: UI -> State -> UseCase -> Repository -> DataSource.
- Anti-slop aktif: Kode bersih, tanpa boilerplate berlebih, desain UI terarah.
- Strict Execution Mode: Jangan menjalankan aplikasi, test, server, atau build; test dijalankan manual oleh pemilik project.

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
    icon: '[VSC]',
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
- Jangan menjalankan test; test dijalankan manual oleh pemilik project.
- Rujukan lengkap dapat dibaca di: .krunner
`;
      const file = path.join(copilotDir, 'copilot-instructions.md');
      await fs.writeFile(file, rule, 'utf-8');
      return [file];
    }
  },
  gemini: {
    id: 'gemini',
    icon: '[GEM]',
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
    icon: '[OPC]',
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
    icon: '[KIR]',
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
    icon: '[OLL]',
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
    icon: '[RTE]',
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
    icon: '[NVD]',
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
    icon: '[CNT]',
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
    icon: '[WIN]',
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
- Provider untuk tugas/state ringan, BLoC untuk enterprise.
- Clean Architecture berlapis: UI -> State -> UseCase -> Repository -> DataSource.
- Anti-slop aktif: Kode bersih, tanpa komentar obvious.
- Zero hardcoded secrets.
- Jangan menjalankan test; test dijalankan manual oleh pemilik project.

Aturan lengkap: .krunner
`;
      const file = path.join(targetRoot, '.windsurfrules');
      await fs.writeFile(file, rule, 'utf-8');
      return [file];
    }
  },
  universal: {
    id: 'universal',
    icon: '[ALL]',
    name: 'Universal Master (.krunner saja)',
    desc: 'Master single-file bundle untuk semua AI',
  }
};

// ── 5. PROSES LOADING & SELESAI DIINSTAL ─────────────────────────
async function runInstallation(
  scope,
  targetKeys,
  lang = 'id',
  projectDir = process.cwd(),
  additionalSkills = [],
) {
  const isGlobal = scope === 'global';
  const targetRoot = isGlobal ? HOME_DIR : projectDir;
  const isEn = lang === 'en';
  const langLabel = isEn ? 'English' : 'Bahasa Indonesia';
  const adapterKeys = targetKeys.filter((key) => key !== 'universal');
  const scopeLabel = isGlobal
    ? 'Global (semua project)'
    : 'Project ini';

  console.log('');
  console.log(fmt.bold('Instalasi KRunner'));
  console.log(`  ${fmt.dim('Cakupan    :')} ${fmt.cyan(fmt.bold(scopeLabel))}`);
  console.log(`  ${fmt.dim('Folder     :')} ${fmt.cyan(targetRoot)}`);
  console.log(`  ${fmt.dim('Bahasa AI  :')} ${fmt.cyan(fmt.bold(langLabel))}`);
  console.log(`  ${fmt.dim('Additional skills:')} ${additionalSkills.length} dipilih`);
  console.log('');

  // ── Tahap Loading 1 ──
  await showLoadingStep(`Mengatur cakupan instalasi (${isGlobal ? 'Global' : 'Project'})`, 300);

  // ── Tahap Loading 2 ──
  await showLoadingStep(`Mengatur bahasa AI (${langLabel})`, 350);

  // ── Tahap Loading 3 ──
  await showLoadingStep('Memuat aturan inti Flutter dan Dart', 350);

  // ── Tahap Loading 4 ──
  await showLoadingStep('Memuat referensi arsitektur, testing, dan keamanan', 380);

  // ── Tahap Loading 5 ──
  await showLoadingStep('Menerapkan panduan anti-slop dan kualitas UI', 380);

  // ── Tahap Loading 6 ──
  await showLoadingStep('Membuat file utama .krunner', 450);

  if (additionalSkills.length > 0) {
    await showLoadingStep('Memuat additional-skills terpilih', 350);
  }

  // Compile content with language & scope
  const content = await buildKrunner(lang, scope, additionalSkills);

  // Always write master .krunner to targetRoot
  const masterKrunner = path.join(targetRoot, '.krunner');
  await fs.writeFile(masterKrunner, content, 'utf-8');
  const createdFiles = [masterKrunner];

  // ── Tahap Loading 7 ──
  await showLoadingStep(`Memasang adapter untuk ${adapterKeys.length} platform`, 480);

  for (const key of adapterKeys) {
    const adapter = ADAPTERS[key];
    if (adapter) {
      const files = await adapter.install(targetRoot, content, lang, scope);
      createdFiles.push(...files);
    }
  }

  await sleep(200);

  // ── 7. TAMPILAN SUDAH SELESAI DIINSTAL ─────────────────────────
  console.log('');
  printBoxed('INSTALASI SELESAI', (text) => fmt.bold(fmt.green(text)));
  console.log('');
  console.log(`  ${fmt.green('[BERHASIL]')} Aturan KRunner siap digunakan.`);
  console.log(`  ${fmt.dim('Cakupan   :')} ${fmt.cyan(fmt.bold(scopeLabel))}`);
  console.log(`  ${fmt.dim('Bahasa AI :')} ${fmt.cyan(fmt.bold(langLabel))}`);
  console.log(`  ${fmt.dim('Folder    :')} ${fmt.dim(targetRoot)}`);
  console.log('');
  console.log(`  ${fmt.bold('File dan adapter yang dibuat:')}`);
  for (const f of createdFiles) {
    console.log(`     ${fmt.green('->')} ${fmt.cyan(f)}`);
  }
  console.log('');
  console.log(`  ${fmt.bold('Langkah selanjutnya:')}`);
  if (isGlobal) {
    console.log(`     ${fmt.dim('1. KRunner aktif secara global di komputer ini.')}`);
    console.log(`     ${fmt.dim('2. Buka project Flutter di editor atau tool AI Anda.')}`);
  } else {
    console.log(`     ${fmt.dim('1. Buka project ini di editor atau tool AI Anda.')}`);
    console.log(`     ${fmt.dim('2. Tool AI kini dapat membaca aturan KRunner.')}`);
  }
  console.log(`     ${fmt.dim('3. Mulai coding.')}`);
  console.log('');
}

async function selectCheckboxItems(items, {
  initiallySelected = [],
  prompt,
  emptyInputSelection = [],
  selectionName = 'item',
} = {}) {
  const input = process.stdin;
  const output = process.stdout;
  const ids = items.map((item) => item.id);
  const selected = new Set(initiallySelected);

  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== 'function') {
    console.log(fmt.dim(prompt));
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.label}`);
    });

    const rl = createInterface({ input, output });
    const answer = (await new Promise((resolve) => {
      rl.question('Pilihan: ', resolve);
    })).trim();
    rl.close();

    if (!answer) return emptyInputSelection === 'all' ? ids : [...selected];
    if (answer.toLowerCase() === 'all') return ids;
    if (answer.toLowerCase() === 'none') return [];

    const chosen = new Set();
    for (const token of answer.split(',')) {
      const index = Number(token.trim()) - 1;
      if (index < 0 || index >= items.length || !Number.isInteger(index)) {
        throw new Error(`Pilihan ${selectionName} tidak valid: ${token.trim()}`);
      }
      chosen.add(ids[index]);
    }
    return ids.filter((id) => chosen.has(id));
  }

  return new Promise((resolve) => {
    let activeIndex = 0;
    let rendered = false;
    const wasRaw = input.isRaw;

    const draw = () => {
      const lines = [
        fmt.dim('UP/DOWN: pindah | SPACE: pilih | A: semua/tidak ada | ENTER: konfirmasi | ESC: lewati'),
        fmt.dim(prompt),
        ...items.map((item, index) => {
          const marker = index === activeIndex ? fmt.cyan('>') : ' ';
          const checkbox = selected.has(item.id) ? fmt.green('[x]') : fmt.dim('[ ]');
          return `${marker} ${checkbox} ${item.label}`;
        }),
        fmt.dim(`${selected.size} ${selectionName} dipilih`),
      ];

      if (rendered) output.write(`\x1b[${lines.length}A`);
      for (const line of lines) output.write(`\r\x1b[2K${line}\n`);
      rendered = true;
    };

    const finish = (result) => {
      input.removeListener('keypress', onKeypress);
      input.setRawMode(Boolean(wasRaw));
      input.pause();
      output.write('\x1b[?25h\n');
      resolve(result);
    };

    const onKeypress = (character, key) => {
      if (key && key.ctrl && key.name === 'c') {
        finish(null);
        return;
      }
      if (key && key.name === 'escape') {
        finish(null);
        return;
      }
      if (key && (key.name === 'return' || key.name === 'enter')) {
        finish([...selected]);
        return;
      }

      if (key && key.name === 'up') {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
      } else if (key && key.name === 'down') {
        activeIndex = (activeIndex + 1) % items.length;
      } else if ((key && key.name === 'space') || character === ' ') {
        const idToToggle = ids[activeIndex];
        if (selected.has(idToToggle)) selected.delete(idToToggle);
        else selected.add(idToToggle);
      } else if ((character || '').toLowerCase() === 'a') {
        if (selected.size === items.length) selected.clear();
        else ids.forEach((id) => selected.add(id));
      } else {
        return;
      }

      draw();
    };

    emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();
    input.on('keypress', onKeypress);
    output.write('\x1b[?25l');
    draw();
  });
}

async function selectAdapters(keys) {
  const items = keys.map((key) => ({
    id: key,
    label: `${ADAPTERS[key].icon} ${ADAPTERS[key].name}`,
  }));
  return selectCheckboxItems(items, {
    initiallySelected: [],
    prompt: 'Pilih platform AI. File .krunner selalu dibuat.',
    emptyInputSelection: [],
    selectionName: 'platform',
  });
}

// ── Interactive Flow: Welcome -> Bahasa -> Scope -> Platform -> Additional Skills -> Install
async function showInteractiveMenu(projectRoot) {
  // 1. WELCOME
  showWelcome();

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((r) => rl.question(q, r));

  // 2. PILIH BAHASA PERCAKAPAN
  console.log(fmt.bold('LANGKAH 2/7 - Pilih bahasa komunikasi Agent AI'));
  console.log(`  ${fmt.cyan('1)')} ${fmt.bold('Bahasa Indonesia')} ${fmt.dim('(default)')}`);
  console.log(`  ${fmt.cyan('2)')} ${fmt.bold('English')}`);
  console.log('');

  const langInput = (await ask('Pilihan [1/2] (default: 1): ')).trim();
  const selectedLang = langInput === '2' ? 'en' : 'id';
  const langLabel = selectedLang === 'en' ? 'English' : 'Bahasa Indonesia';
  console.log(`  ${fmt.green('[OK]')} Bahasa: ${fmt.bold(langLabel)}\n`);

  // 3. PILIH CAKUPAN PENGINSTALAN (SCOPE)
  console.log(fmt.bold('LANGKAH 3/7 - Pilih cakupan instalasi KRunner'));
  console.log(`  ${fmt.cyan('1)')} ${fmt.bold('Project ini')} ${fmt.dim(`- Aktif hanya di folder ini (${path.basename(projectRoot)})`)}`);
  console.log(`  ${fmt.cyan('2)')} ${fmt.bold('Global')} ${fmt.dim('- Aktif untuk semua project di komputer ini (~/)')}`);
  console.log('');

  const scopeInput = (await ask('Pilihan [1/2] (default: 1): ')).trim();
  const selectedScope = scopeInput === '2' ? 'global' : 'project';
  const scopeLabel = selectedScope === 'global' ? 'Global (~/)' : 'Project ini (./)';
  console.log(`  ${fmt.green('[OK]')} Cakupan: ${fmt.bold(scopeLabel)}\n`);
  rl.close();

  if (selectedScope === 'project' && path.resolve(projectRoot) === path.resolve(REPO_ROOT)) {
    console.error(fmt.red('  [ERROR] Pilih cakupan Global atau jalankan KRunner dari folder project target.'));
    return;
  }

  // 4. PILIH PLATFORM AI
  console.log(fmt.bold('LANGKAH 4/7 - Pilih platform AI yang ingin dipasang'));
  console.log('');
  const keys = Object.keys(ADAPTERS).filter((key) => key !== 'universal');
  const chosen = await selectAdapters(keys);
  if (chosen === null) {
    console.log(fmt.yellow('  [DIBATALKAN] Pemilihan dihentikan.'));
    return;
  }

  // 5. PILIH ADDITIONAL SKILLS
  const availableSkills = await listAdditionalSkills();
  let chosenAdditionalSkills = [];
  if (availableSkills.length === 0) {
    console.log(fmt.dim('LANGKAH 5/7 - Tidak ada additional-skill yang tersedia; langkah ini dilewati.'));
  } else {
    console.log(fmt.bold('LANGKAH 5/7 - Pilih additional-skill yang ingin disertakan'));
    console.log('');
    const selectedIds = await selectCheckboxItems(
      availableSkills.map(({ id, label }) => ({ id, label })),
      {
        prompt: 'Pilih skill tambahan; Enter tanpa pilihan untuk melewati.',
        selectionName: 'additional-skill',
      },
    );
    chosenAdditionalSkills = availableSkills.filter((skill) => selectedIds?.includes(skill.id));
    if (chosenAdditionalSkills.length === 0) {
      console.log(fmt.dim('  Tidak ada additional-skill dipilih; langkah ini dilewati.'));
    }
  }

  // 6 & 7. LOADING & SELESAI
  await runInstallation(selectedScope, chosen, selectedLang, projectRoot, chosenAdditionalSkills);
}

// ── Main Entrypoint ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showWelcome();
    console.log(`${fmt.bold('PENGGUNAAN')}
  krunner                 Jalankan wizard instalasi interaktif

  Urutan:
    Welcome -> Bahasa -> Cakupan -> Platform AI -> Additional Skills -> Loading -> Selesai

  Opsi bantuan:
    --help, -h             Tampilkan bantuan
    --version, -v          Tampilkan versi
`);
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(VERSION);
    return;
  }

  const projectRoot = process.cwd();
  if (args.length > 0) {
    throw new Error('Gunakan perintah krunner tanpa subcommand atau opsi instalasi.');
  }

  await showInteractiveMenu(projectRoot);
}

main().catch((err) => {
  console.error(fmt.red('\n  Error:'), err.message || err);
  process.exit(1);
});
