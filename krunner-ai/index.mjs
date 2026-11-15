#!/usr/bin/env node

/**
 * krunner-ai — Universal AI Coding Skill For Flutter
 *
 * Mendukung instalasi ke semua ekosistem AI:
 * - OpenCode (.opencode/skills/)
 * - 9router & OmniRoute (System Prompt Gateway)
 * - GitHub Copilot & VS Code (.github/copilot-instructions.md)
 * - Google Antigravity & Gemini CLI (.gemini/skills/)
 * - Kiro (.kiro/rules.md)
 * - Nvidia NIM / NeMo (.nvidia/prompt.md)
 * - Ollama (Modelfile.krunner)
 * - Claude Code & Desktop (CLAUDE.md & .claude/skills/)
 * - CommandCode & Continue.dev (.continue/rules/)
 * - Cursor (.cursorrules)
 * - Windsurf (.windsurfrules)
 * - Universal Agent Protocol (.agents/skills/)
 * - Master single-file (.krunner)
 *
 * Zero dependency. Node >= 20.12.0.
 */

import { promises as fs, readFileSync } from 'fs';
import path from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

// ── Paths ───────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');

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

// ── ANSI helpers (zero-dependency) ──────────────────────────────
const fmt = {
  bold:   (t) => `\x1b[1m${t}\x1b[0m`,
  green:  (t) => `\x1b[32m${t}\x1b[0m`,
  cyan:   (t) => `\x1b[36m${t}\x1b[0m`,
  dim:    (t) => `\x1b[2m${t}\x1b[0m`,
  red:    (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
};

function banner() {
  const verBadge = `v${VERSION}`.padEnd(8, ' ');
  console.log('');
  console.log(fmt.bold(fmt.cyan('  ╔═══════════════════════════════════════════════════╗')));
  console.log(fmt.bold(fmt.cyan(`  ║            🚀  krunner-ai  ${verBadge}               ║`)));
  console.log(fmt.bold(fmt.cyan('  ║     Universal AI Coding Skill For Flutter         ║')));
  console.log(fmt.bold(fmt.cyan('  ╚═══════════════════════════════════════════════════╝')));
  console.log('');
}

function help() {
  banner();
  console.log(`${fmt.bold('Penggunaan:')}

  ${fmt.cyan('npx krunner-ai')}                 Pilih target platform AI (interaktif)
  ${fmt.cyan('npx krunner-ai all')}             Pasang untuk SEMUA platform sekaligus
  ${fmt.cyan('npx krunner-ai install <target>')} Pasang untuk platform tertentu
  ${fmt.cyan('npx krunner-ai --help')}          Tampilkan bantuan ini
  ${fmt.cyan('npx krunner-ai --version')}       Tampilkan versi

${fmt.bold('Platform yang didukung:')}
  ${fmt.cyan('cursor')}        — Cursor AI IDE (.cursorrules)
  ${fmt.cyan('claude')}        — Claude Code & Desktop (CLAUDE.md & .claude/skills/)
  ${fmt.cyan('vscode')}        — GitHub Copilot & VS Code (.github/copilot-instructions.md)
  ${fmt.cyan('gemini')}        — Google Antigravity & Gemini CLI (.gemini/skills/)
  ${fmt.cyan('opencode')}      — OpenCode Agent (.opencode/skills/ & instructions.md)
  ${fmt.cyan('kiro')}          — Kiro AI (.kiro/rules.md)
  ${fmt.cyan('ollama')}        — Ollama Local LLM (Modelfile.krunner)
  ${fmt.cyan('router')}        — 9router & OmniRoute (System Prompt Gateway)
  ${fmt.cyan('nvidia')}        — Nvidia NIM & AI Workbench (.nvidia/prompt.md)
  ${fmt.cyan('commandcode')}   — CommandCode & Continue.dev (.continue/rules/)
  ${fmt.cyan('windsurf')}      — Windsurf IDE (.windsurfrules)
  ${fmt.cyan('universal')}     — Master bundle .krunner saja
  ${fmt.cyan('all')}           — Pasang ke SEMUA platform di atas sekaligus!

${fmt.bold('Contoh:')}
  cd ~/my-flutter-project
  npx krunner-ai all
  npx krunner-ai install cursor
  npx krunner-ai install claude
  npx krunner-ai install ollama
`);
}

// ── Read file safely ────────────────────────────────────────────
async function readSafe(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// ── Read all .md files from a directory (recursive, sorted) ─────
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

// ── Build master .krunner content ───────────────────────────────
async function buildKrunner() {
  const sections = [];

  // Header
  sections.push(`# .krunner — Universal AI Coding Skill For Flutter
# Generated by krunner-ai v${VERSION}
# Tanggal: ${new Date().toISOString()}
#
# FILE INI ADALAH INSTRUKSI UNTUK AI.
# AI yang bekerja pada project ini WAJIB membaca dan mengikuti
# seluruh aturan di bawah. Tidak ada pengecualian.
#
# Aturan ini mencakup:
# 1. Aturan coding universal & Flutter/Dart (SKILL.md)
# 2. References (architecture, coding-standards, flutter-standards, dll.)
# 3. Additional Skills (modul otomatis dari folder additional-skills/)
`);

  // Section 1: SKILL.md
  const skillMd = await readSafe(path.join(REPO_ROOT, 'SKILL.md'));
  if (skillMd) {
    sections.push(`${'='.repeat(80)}
## BAGIAN 1: ATURAN UTAMA (SKILL.md)
${'='.repeat(80)}

${skillMd.trim()}
`);
    console.log(`  ${fmt.green('✓')} SKILL.md`);
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
    console.log(`  ${fmt.green('✓')} references/ (${refs.length} file)`);
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
        console.log(`  ${fmt.green('✓')} additional-skills/${entry.name} (${files.length} file)`);
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
        console.log(`  ${fmt.green('✓')} additional-skills/${entry.name}`);
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
##   1. Instruksi eksplisit terbaru dari pengguna
##   2. SKILL.md (Bagian 1)
##   3. References & Additional Skills (Bagian 2 dst.)
${'='.repeat(80)}
`);

  return sections.join('\n');
}

// ── Adapters for AI Platforms ───────────────────────────────────
const ADAPTERS = {
  universal: {
    id: 'universal',
    name: 'Universal Master (.krunner)',
    desc: 'Master single-file bundle untuk semua AI',
    async install(projectRoot, content) {
      await fs.writeFile(path.join(projectRoot, '.krunner'), content, 'utf-8');
      return ['.krunner'];
    }
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor (.cursorrules)',
    desc: 'Aturan otomatis untuk Cursor AI IDE',
    async install(projectRoot, content) {
      const rule = `# .cursorrules - KRunner-AI Flutter Standards
# File ini dibaca otomatis oleh Cursor AI di workspace ini.

Anda adalah AI Flutter Engineer yang WAJIB mematuhi seluruh aturan di file .krunner.

Aturan Pokok:
1. 100% StatelessWidget (StatefulWidget & setState DILARANG TOTAL).
2. State Management via Provider atau BLoC. Jangan campur dalam satu domain.
3. Clean Architecture: UI -> State -> UseCase -> Repository -> DataSource.
4. Anti-Slop: Tidak ada kode/UI generik, tidak ada komentar obvious.
5. Keamanan: Zero hardcoded secrets, gunakan flutter_secure_storage.
6. Strict Execution: Jangan jalankan project/build secara lokal.

Aturan lengkap dan referensi teknis tersedia di: .krunner
`;
      await fs.writeFile(path.join(projectRoot, '.cursorrules'), rule, 'utf-8');
      return ['.cursorrules'];
    }
  },
  claude: {
    id: 'claude',
    name: 'Claude Code & Desktop (CLAUDE.md & .claude/skills/)',
    desc: 'Aturan kerja untuk Claude Code terminal & desktop',
    async install(projectRoot, content) {
      const rule = `# CLAUDE.md - KRunner-AI Flutter Standards
# Claude Code otomatis membaca file ini pada setiap prompt/turn.

Anda WAJIB mematuhi seluruh aturan coding Flutter di file .krunner.

Ringkasan Aturan:
- Semua widget wajib StatelessWidget (StatefulWidget & setState dilarang total).
- State, lifecycle, dan business logic di Provider / BLoC.
- Clean Architecture berlapis wajib dipatuhi: UI -> State -> UseCase -> Repository -> DataSource.
- Anti-slop aktif: Kode bersih, tanpa boilerplate berlebih, desain UI terarah.
- Strict Execution Mode: Jangan menjalankan aplikasi/build lokal.

Baca file .krunner untuk detail aturan lengkap dan pedoman security audit.
`;
      await fs.writeFile(path.join(projectRoot, 'CLAUDE.md'), rule, 'utf-8');

      const skillDir = path.join(projectRoot, '.claude', 'skills', 'universal-ai-coding');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), content, 'utf-8');
      return ['CLAUDE.md', '.claude/skills/universal-ai-coding/SKILL.md'];
    }
  },
  vscode: {
    id: 'vscode',
    name: 'GitHub Copilot & VS Code (.github/copilot-instructions.md)',
    desc: 'Workspace instructions resmi untuk GitHub Copilot',
    async install(projectRoot, content) {
      const copilotDir = path.join(projectRoot, '.github');
      await fs.mkdir(copilotDir, { recursive: true });
      const rule = `# GitHub Copilot Custom Instructions - KRunner-AI
# File ini otomatis dibaca oleh GitHub Copilot di VS Code & JetBrains.

Project ini menerapkan standar coding ketat KRunner-AI untuk Flutter & Dart.
Anda WAJIB membaca dan mematuhi seluruh aturan di file .krunner.

Aturan Wajib:
- 100% StatelessWidget (StatefulWidget dilarang total).
- State Provider (tugas) atau BLoC (enterprise).
- Clean Architecture: Presentation -> Domain -> Data.
- Dilarang hardcode secret / API key.
- Rujukan lengkap dapat dibaca di: .krunner
`;
      const file = path.join(copilotDir, 'copilot-instructions.md');
      await fs.writeFile(file, rule, 'utf-8');
      return ['.github/copilot-instructions.md'];
    }
  },
  gemini: {
    id: 'gemini',
    name: 'Google Antigravity & Gemini CLI (.gemini/skills/)',
    desc: 'Skill resmi untuk Antigravity IDE & Gemini CLI',
    async install(projectRoot, content) {
      const skillDir = path.join(projectRoot, '.gemini', 'skills', 'universal-ai-coding');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), content, 'utf-8');
      return ['.gemini/skills/universal-ai-coding/SKILL.md'];
    }
  },
  opencode: {
    id: 'opencode',
    name: 'OpenCode (.opencode/skills/ & instructions.md)',
    desc: 'Skill & instruksi native untuk OpenCode Agent',
    async install(projectRoot, content) {
      const dir = path.join(projectRoot, '.opencode', 'skills', 'universal-ai-coding');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'SKILL.md'), content, 'utf-8');
      await fs.writeFile(path.join(projectRoot, '.opencode', 'instructions.md'), content, 'utf-8');
      return ['.opencode/skills/universal-ai-coding/SKILL.md', '.opencode/instructions.md'];
    }
  },
  kiro: {
    id: 'kiro',
    name: 'Kiro AI (.kiro/rules.md)',
    desc: 'Aturan kerja untuk Kiro coding agent',
    async install(projectRoot, content) {
      const dir = path.join(projectRoot, '.kiro');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'rules.md'), content, 'utf-8');
      return ['.kiro/rules.md'];
    }
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Modelfile.krunner)',
    desc: 'Modelfile siap pakai untuk local LLM (ollama create)',
    async install(projectRoot, content) {
      const escaped = content.replace(/"""/g, "'''");
      const modelFile = `# Modelfile - KRunner-AI Flutter Model
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
      await fs.writeFile(path.join(projectRoot, 'Modelfile.krunner'), modelFile, 'utf-8');
      return ['Modelfile.krunner'];
    }
  },
  router: {
    id: 'router',
    name: '9router & OmniRoute (System Prompt Gateway)',
    desc: 'Prompt sistem untuk multi-model routing gateway',
    async install(projectRoot, content) {
      const dir = path.join(projectRoot, '.omniroute');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'system-prompt.txt'), content, 'utf-8');
      await fs.writeFile(path.join(projectRoot, 'krunner-system-prompt.txt'), content, 'utf-8');
      return ['.omniroute/system-prompt.txt', 'krunner-system-prompt.txt'];
    }
  },
  nvidia: {
    id: 'nvidia',
    name: 'Nvidia NIM & AI Workbench (.nvidia/prompt.md)',
    desc: 'System prompt untuk Nvidia NIM & NeMo Guardrails',
    async install(projectRoot, content) {
      const dir = path.join(projectRoot, '.nvidia');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'prompt.md'), content, 'utf-8');
      return ['.nvidia/prompt.md'];
    }
  },
  commandcode: {
    id: 'commandcode',
    name: 'CommandCode & Continue.dev (.continue/rules/)',
    desc: 'Aturan kerja untuk CommandCode & Continue extension',
    async install(projectRoot, content) {
      const dir = path.join(projectRoot, '.continue', 'rules');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'krunner.md'), content, 'utf-8');
      return ['.continue/rules/krunner.md'];
    }
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf Cascade (.windsurfrules)',
    desc: 'Aturan kerja untuk Windsurf IDE',
    async install(projectRoot, content) {
      const rule = `# .windsurfrules - KRunner-AI Flutter Standards
Cascade Agent WAJIB mematuhi seluruh aturan di file .krunner.

- 100% StatelessWidget (StatefulWidget & setState dilarang).
- State via Provider / BLoC.
- Clean Architecture berlapis (UI -> State -> UseCase -> Repository -> DataSource).
- Anti-slop aktif: Kode bersih, tanpa komentar obvious.
- Zero hardcoded secrets.

Aturan lengkap: .krunner
`;
      await fs.writeFile(path.join(projectRoot, '.windsurfrules'), rule, 'utf-8');
      return ['.windsurfrules'];
    }
  },
  codex: {
    id: 'codex',
    name: 'Universal Agent Protocol (.agents/skills/)',
    desc: 'Standar universal agent protocol (Codex dll.)',
    async install(projectRoot, content) {
      const dir = path.join(projectRoot, '.agents', 'skills', 'universal-ai-coding');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'SKILL.md'), content, 'utf-8');
      return ['.agents/skills/universal-ai-coding/SKILL.md'];
    }
  }
};

// ── Deploy Target ───────────────────────────────────────────────
async function deployTargets(projectRoot, targetKeys) {
  banner();
  console.log(fmt.bold('📦 Menginstall KRunner-AI'));
  console.log(`   Project : ${fmt.cyan(projectRoot)}`);
  console.log('');

  // 1. Build master content
  const content = await buildKrunner();

  // Always generate master .krunner first
  await ADAPTERS.universal.install(projectRoot, content);

  console.log('');
  console.log(fmt.bold('🚀 Memasang Adapter Platform AI:'));

  const createdFiles = ['.krunner'];
  for (const key of targetKeys) {
    if (key === 'universal') continue; // already installed
    const adapter = ADAPTERS[key];
    if (adapter) {
      const files = await adapter.install(projectRoot, content);
      createdFiles.push(...files);
      console.log(`  ${fmt.green('✓')} ${fmt.bold(adapter.name)}`);
      for (const f of files) {
        console.log(`    ${fmt.dim('→')} ${f}`);
      }
    }
  }

  const sizeKb = (Buffer.byteLength(content, 'utf-8') / 1024).toFixed(1);

  console.log('');
  console.log(fmt.green(fmt.bold(`  ✅ Berhasil dipasang! (${sizeKb} KB, ${createdFiles.length} file konfigurasi dibuat)`)));
  console.log('');
  console.log(fmt.dim('  Platform AI Anda kini otomatis membaca & mematuhi KRunner-AI!'));
  console.log(fmt.dim('  Buka project dengan AI pilihan Anda dan mulai coding.'));
  console.log('');
}

// ── Interactive Picker ──────────────────────────────────────────
async function interactive(projectRoot) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((r) => rl.question(q, r));

  banner();
  console.log(fmt.bold('Pilih target platform AI:'));
  console.log(`  ${fmt.cyan('1')}. 🌐 ${fmt.bold('All-in-One')} ${fmt.dim('(Rekomendasi: Pasang untuk Semua Platform)')}`);

  const keys = Object.keys(ADAPTERS);
  keys.forEach((k, idx) => {
    console.log(`  ${fmt.cyan(String(idx + 2))}. ${ADAPTERS[k].name}`);
  });
  console.log('');

  const answer = await ask('Pilih nomor (default: 1 untuk Semua): ');
  rl.close();

  const trimmed = answer.trim();
  if (!trimmed || trimmed === '1') {
    // Install all
    await deployTargets(projectRoot, keys);
    return;
  }

  const chosen = [];
  for (const tok of trimmed.split(',')) {
    const n = parseInt(tok.trim(), 10);
    if (n === 1) {
      await deployTargets(projectRoot, keys);
      return;
    }
    const idx = n - 2;
    if (idx >= 0 && idx < keys.length) {
      chosen.push(keys[idx]);
    }
  }

  if (!chosen.length) {
    console.log(fmt.red('\n  Tidak ada platform dipilih. Memasang Universal (.krunner) saja.\n'));
    await deployTargets(projectRoot, ['universal']);
    return;
  }

  await deployTargets(projectRoot, chosen);
}

// ── Main Entrypoint ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) { help(); return; }
  if (args.includes('--version') || args.includes('-v')) { console.log(VERSION); return; }

  const projectRoot = process.cwd();

  // Guard: jangan jalankan di repo krunner sendiri
  if (path.resolve(projectRoot) === path.resolve(REPO_ROOT)) {
    console.log('');
    console.log(fmt.red('  ✗ Anda sedang berada di dalam repo krunner-ai.'));
    console.log('    Pindah ke folder project target Anda terlebih dahulu:');
    console.log(fmt.dim('    cd ~/my-flutter-project'));
    console.log(fmt.dim('    npx krunner-ai all'));
    process.exit(1);
  }

  const allKeys = Object.keys(ADAPTERS);

  // Flags: all
  if (args[0] === 'all' || args.includes('--all')) {
    await deployTargets(projectRoot, allKeys);
    return;
  }

  // Subcommand: install <target>
  if (args[0] === 'install') {
    const target = args[1]?.toLowerCase();
    if (!target || target === 'all') {
      await deployTargets(projectRoot, allKeys);
    } else if (ADAPTERS[target]) {
      await deployTargets(projectRoot, [target]);
    } else {
      console.error(fmt.red(`\n  Target tidak dikenal: ${target}`));
      console.log(`  Target yang tersedia: ${allKeys.join(', ')}, all\n`);
      process.exit(1);
    }
    return;
  }

  // Tanpa argumen -> Interactive
  if (!args.length) {
    await interactive(projectRoot);
    return;
  }

  // Jika argumen berupa nama adapter langsung (misal: npx krunner-ai cursor)
  const directTarget = args[0].toLowerCase().replace(/^--/, '');
  if (ADAPTERS[directTarget]) {
    await deployTargets(projectRoot, [directTarget]);
    return;
  }

  console.error(fmt.red(`\n  Perintah tidak dikenal: ${args[0]}\n`));
  help();
  process.exit(1);
}

main().catch((err) => {
  console.error(fmt.red('\n  Error:'), err.message || err);
  process.exit(1);
});
