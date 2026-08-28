# Engineering Agent Skills

A curated collection of production-grade **Engineering Agent Skills** designed to streamline multi-agent collaboration, project onboarding, workflow governance, and task delegation across modern AI coding agents (OpenCode, Codex, Claude Code, Gemini CLI, Cursor, etc.).

---

## 📦 Skills Catalog

| Skill | Description | Primary Use Case |
|---|---|---|
| **`agent-workflow-onboarding`** | Interactively survey an unfamiliar codebase or multi-project workspace, produce read-only diagnosis, and propose a verified AI-agent collaboration system (`AGENTS.md`, `Docs/`, `rules/`, `TASKS.md`, `status.md`). | Initializing or standardizing agent workflow for new/legacy repositories. |
| **`agent-workflow-maintenance`** | Conservatively maintain and align established AI-agent collaboration systems through minimal, evidence-backed, user-approved updates. | Continuous maintenance of mature agent workflows after code, build, or architecture changes. |
| **`write-agent-prompts`** | Draft, compress, review, or split copy-ready, decision-critical execution prompts for AI subagents. | Delegating tasks to subagents with explicit boundaries, acceptance checks, and zero fluff. |

---

## 🚀 Installation & Usage

Skills are distributed via the standard [`skills`](https://github.com/vercel-labs/skills) CLI.

### 1. Interactive Installation

Run the interactive installer to choose skills, target agents, and installation scope (project-level or global):

```bash
npx skills add yyShine760/engineering-agent-skills
```

### 2. Install a Specific Skill

#### Project-level (Default)

Installs the skill to the current project (e.g. `.agents/skills/` or `.claude/skills/`):

```bash
# Install write-agent-prompts to current project
npx skills add yyShine760/engineering-agent-skills --skill write-agent-prompts
```

#### Global Scope

Installs the skill globally for all projects (e.g. `~/.config/opencode/skills/` or `~/.codex/skills/`):

```bash
# Globally install write-agent-prompts
npx skills add yyShine760/engineering-agent-skills --skill write-agent-prompts --global
```

### 3. Specify Target Agents

Install to specific agents across platforms:

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
# Install all skills in the repository
npx skills add yyShine760/engineering-agent-skills --all --global
```

### 5. List Available Skills

```bash
npx skills add yyShine760/engineering-agent-skills --list
```

### 6. Check & Update

```bash
# Check for updates
npx skills check

# Update all installed skills
npx skills update

# Update global / project skills separately
npx skills update -g
npx skills update -p
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

The skills adhere to the universal Agent Skill specification (`SKILL.md` + `agents/openai.yaml`) and are compatible with:

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
