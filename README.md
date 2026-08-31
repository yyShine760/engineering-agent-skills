# Engineering Agent Skills

A curated collection of production-grade **Engineering Agent Skills** built on the **Lean Knowledge Architecture (v2.0.0)**. Designed for multi-agent collaboration, project onboarding, workflow governance, and concise task delegation across modern AI coding agents (OpenCode, Codex, Claude Code, Gemini CLI, Cursor, and more).

---

## 💡 Architecture & Philosophy (v2.0.0)

Traditional agent setups often suffer from file proliferation (8~20 fragmented documentation files), causing high cognitive overhead and cross-file synchronization drift. 

**Engineering Agent Skills v2.0.0** shifts from *file-oriented fragmentation* to a **Source-of-Truth-Oriented Lean Architecture**:

```text
Project/
├── AGENTS.md             # Rulebook: agent behavioral rules, constraints & Knowledge Map
├── Docs/
│   ├── PROJECT.md        # Single consolidated technical truth: Architecture, Components, Hardware, Protocols, OTA, etc.
│   └── DECISIONS.md      # (Optional) Architectural decisions and trade-off rationale
└── TASKS.md              # (Optional) Active task queue and progress tracker
```

### Core Principles

1. **Source-of-Truth-Oriented (3+1 Core Files):** Every domain fact has exactly one authoritative owner. No scattered documentation.
2. **Promote-on-Pressure (Grow, Then Split):** Avoid premature modularization. Start with sections in `Docs/PROJECT.md`, and only split into dedicated docs (e.g. `Docs/OTA.md`) when a section grows large (>300 lines) or has distinct ownership.
3. **Zero Derived State Duplication:** Abolish redundant status files (e.g. `status.md`). Task progress is maintained strictly within `TASKS.md`.
4. **Trigger-Driven Maintenance:** Maintenance flows directly from a concrete change trigger through the `AGENTS.md` Knowledge Map to the single target file/section, eliminating expensive full-workspace scans.
5. **Thin Platform Adapters:** `CLAUDE.md`, `GEMINI.md`, and `.cursorrules` act strictly as thin pointers to `./AGENTS.md` and `Docs/PROJECT.md` without duplicating project knowledge.

---

## 📦 Skills Catalog

| Skill | Description | Primary Use Case |
|---|---|---|
| **`agent-workflow-onboarding`** | Interactively survey an unfamiliar codebase and establish a **Lean Knowledge System** (`AGENTS.md` + `Docs/PROJECT.md`, with optional `DECISIONS.md` / `TASKS.md`). | Initializing or migrating repositories to the Lean Agent Architecture. |
| **`agent-workflow-maintenance`** | **Trigger-driven**, conservative maintenance that maps change triggers directly to the single source of truth via the `AGENTS.md` Knowledge Map. | Keeping project facts and rules aligned after code, build, or architecture changes. |
| **`write-agent-prompts`** | Draft, compress, review, or split copy-ready, decision-critical execution prompts for AI subagents. | Delegating tasks to subagents with explicit boundaries, acceptance checks, and zero fluff. |

---

## 🚀 Installation & Usage

Skills are distributed via the standard [`skills`](https://github.com/vercel-labs/skills) CLI.

### 1. Interactive Installation

Run the interactive installer to choose skills, target agents, and installation scope:

```bash
npx skills add yyShine760/engineering-agent-skills
```

### 2. Install Specific Skills

#### Project-level (Default)

Installs the skill to the current project (e.g. `.agents/skills/` or `.claude/skills/`):

```bash
npx skills add yyShine760/engineering-agent-skills --skill write-agent-prompts
```

#### Global Scope

Installs the skill globally for all projects (e.g. `~/.config/opencode/skills/` or `~/.codex/skills/`):

```bash
npx skills add yyShine760/engineering-agent-skills --skill write-agent-prompts --global
```

### 3. Specify Target Agents

Install directly to specific agents:

```bash
# Install to OpenCode globally
npx skills add yyShine760/engineering-agent-skills -s write-agent-prompts -a opencode -g

# Install to multiple agents at once
npx skills add yyShine760/engineering-agent-skills \
  --skill write-agent-prompts \
  --agent codex \
  --agent claude-code \
  --agent opencode \
  --agent gemini-cli \
  --global
```

### 4. Install All Skills

```bash
npx skills add yyShine760/engineering-agent-skills --all --global
```

### 5. Check & Update

```bash
# Check for updates
npx skills check

# Update installed skills
npx skills update
```

---

## 📂 Repository Structure

```text
engineering-agent-skills/
├── .gitignore
├── LICENSE
├── README.md
└── skills/
    ├── agent-workflow-onboarding/
    │   ├── SKILL.md
    │   └── agents/
    │       └── openai.yaml
    ├── agent-workflow-maintenance/
    │   ├── SKILL.md
    │   └── agents/
    │       └── openai.yaml
    └── write-agent-prompts/
        ├── SKILL.md
        └── agents/
            └── openai.yaml
```

---

## 🧩 Supported Agent Platforms

- **OpenCode**
- **Codex**
- **Claude Code**
- **Gemini CLI**
- **Cursor**
- **GitHub Copilot**
- **Command Code**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
