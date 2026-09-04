# Engineering Agent Skills

A curated collection of production-grade **Engineering Agent Skills** built on the **Lean Knowledge Architecture (v2.0.2)**. Designed for multi-agent collaboration, project onboarding, workflow governance, and concise task delegation across modern AI coding agents (OpenCode, Codex, Claude Code, Gemini CLI, Cursor, and more).

---

## 💡 Architecture & Philosophy (v2.0.2)

Traditional agent setups often suffer from file proliferation (8~20 fragmented documentation files), causing high cognitive overhead and cross-file synchronization drift. 

**Engineering Agent Skills v2.0.2** shifts from *file-oriented fragmentation* to a **Source-of-Truth-Oriented Lean Architecture**:

```text
Project/
├── AGENTS.md             # Rulebook: agent behavioral rules, Git isolation, Conventional Commits & Knowledge Map
├── Docs/
│   ├── PROJECT.md        # Single consolidated technical facts: Architecture, Build & Verification, Hardware, Protocols, OTA, etc.
│   └── DECISIONS.md      # (Optional) Architectural decisions and trade-off rationale
└── TASKS.md              # (Optional) Active task queue and progress tracker
```

### Core Principles

1. **Standard Baseline Rules in `AGENTS.md`:**
   - **Feature Branch Isolation:** All code changes must occur on independent feature branches cut from `develop` (or confirmed with user). Direct modifications on `main` or `develop` are prohibited.
   - **Git Operation Authorization:** Never automatically commit, merge, rebase, push, or tag without explicit user approval.
   - **Conventional Commits:** Enforces `<type>(<scope>): <description>` (`feat`, `fix`, `chore`, `build`, `refactor`, `test`, `docs`, `style`).
   - **Verification Mandate:** Mandates *that* verification must occur after changes, referencing `Docs/PROJECT.md`.
2. **Explicit Division of Responsibility:**
   - **`AGENTS.md` (Behavior & Rules):** Governs conduct, Git rules, permissions, safety boundaries, and the dynamic **Project Knowledge Map**.
   - **`Docs/PROJECT.md` (Facts & Execution):** The single source of truth specifying *how* to build, run, test, and verify (`## Build & Verification`), plus architecture, hardware, protocols, OTA, and debugging notes.
3. **Promote-on-Pressure (Grow, Then Split):** Avoid premature modularization (KISS / YAGNI). Start within `Docs/PROJECT.md`. Split into dedicated documents (e.g. `Docs/OTA.md`) only when qualitative pressure arises (navigational difficulty, independent ownership, distinct update cadence, or large size).
4. **Dynamic Knowledge Map (Zero Ghost Links):** `AGENTS.md` includes only rows for artifacts that actually exist in the project, keeping navigation clean and deterministic.
5. **Zero Derived State Duplication:** Abolish redundant status files (e.g. `status.md`). Task progress is maintained strictly within `TASKS.md`.
6. **Trigger-Driven Maintenance:** Maintenance flows directly from a concrete change trigger through the `AGENTS.md` Knowledge Map to the single target file/section, eliminating expensive full-workspace scans.
7. **On-Demand Thin Adapters:** `CLAUDE.md`, `GEMINI.md`, and `.cursorrules` are generated only when the platform cannot natively consume `AGENTS.md`, and act strictly as minimal pointers.

---

## 📦 Skills Catalog

| Skill | Description | Primary Use Case |
|---|---|---|
| **`agent-workflow-onboarding`** | Interactively survey an unfamiliar codebase and establish a **Lean Knowledge System** (`AGENTS.md` + `Docs/PROJECT.md`, with built-in Git branching & Conventional Commits baseline rules). | Initializing or migrating repositories to the Lean Agent Architecture. |
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
