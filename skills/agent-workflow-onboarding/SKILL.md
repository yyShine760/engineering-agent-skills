---
name: agent-workflow-onboarding
description: Interactively survey an unfamiliar code project or multi-project workspace, produce a read-only diagnosis, and propose a lean, source-of-truth-oriented AI-agent collaboration setup (AGENTS.md, Docs/PROJECT.md, optional DECISIONS.md / TASKS.md, and thin platform adapters). Use when asked to onboard, initialize, document, prepare, or establish collaboration guidance for Codex, Claude Code, Cursor, Gemini CLI, OpenCode, or compatible coding agents.
---

# Interactive Project Onboarding (Lean Knowledge Architecture)

Establish a durable, source-of-truth-oriented AI-agent collaboration system for a code project or multi-software workspace. Work interactively: inspect first, diagnose second, ask the user to choose the scope/profile, and generate files only after explicit confirmation.

Do not run this Skill merely because a user asks to browse, explain, diagnose, or modify an existing project. Use it when they ask to set up, improve, or initialize project collaboration guidance and documentation.

This Skill establishes a lean foundation. If the project already has an intentional `AGENTS.md` and coherent knowledge setup, stop after Phase 0 (Maturity Routing) and recommend `agent-workflow-maintenance`.

---

## Core Architectural Principles

### 1. Source-of-Truth-Oriented (3+1 Core Files)
Avoid pre-fragmenting project documentation into dozens of topical files. Consolidate knowledge into a maximum of 3+1 core artifacts:

```text
Project/
├── AGENTS.md             # Rulebook: agent behavioral rules, constraints, verification mandate & Knowledge Map
├── Docs/
│   ├── PROJECT.md        # Single consolidated technical facts: Architecture, Build & Verification, Hardware, Protocols, OTA, etc.
│   └── DECISIONS.md      # (Optional) Architecture Decision Records & rationale for non-obvious choices
└── TASKS.md              # (Optional) Active task list, progress, and backlog (replaces separate status files)
```

### 2. Explicit Division: Behavioral Rules vs. Technical Facts
- **`AGENTS.md` (Behavioral Rules):** Governs agent conduct, safety prohibitions, boundaries, Git & commit policies, and the mandate to verify changes (e.g. *"Always run project verification after code changes; see Docs/PROJECT.md -> Build & Verification for exact commands"*), plus the project Knowledge Map.
- **`Docs/PROJECT.md` (Technical Facts):** The single source of truth for technical facts, including the exact build, run, test, and verification commands/toolchain steps (`## Build & Verification`), system architecture, hardware mappings, protocols, and debugging notes.
- *Rule:* Never duplicate concrete build/test commands in `AGENTS.md`. `AGENTS.md` mandates *that* verification must occur; `Docs/PROJECT.md` specifies *how* to execute it.

### 3. Promote-on-Pressure (Grow, Then Split)
- **Do NOT split documents prematurely (KISS / YAGNI).** Start with sections inside `Docs/PROJECT.md`.
- Propose splitting a section into a standalone document (e.g. `Docs/OTA.md` or `Docs/PROTOCOL.md`) only when one or more conditions become true:
  - The section becomes difficult to navigate within a single file;
  - It has independent ownership or distinct team maintainers;
  - It has a substantially different update cadence;
  - It requires independent access or security control;
  - Its size materially reduces usability (*line count, e.g. ~300+ lines, is a heuristic, not a rigid threshold*).

### 4. Zero Derived State Duplication
- **No `status.md`**. Task states, notes, and progress are tracked strictly in `TASKS.md`.
- *Rule:* A fact that can be derived from another managed artifact must not be stored separately.

### 5. Platform Adapters: Thin & Strictly On-Demand
- `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, etc. are **thin adapters**, not knowledge stores.
- Only generate an adapter when the selected platform actually requires one. Do not create adapter files for platforms that natively consume `AGENTS.md` (e.g. OpenCode, Codex).
- When generated, adapters must strictly point to `./AGENTS.md` and `Docs/PROJECT.md` without duplicating rules or facts.

### 6. Role Boundaries: Global Skills vs. Project Assets
- **Global Skills:** Cross-project methodology & execution workflows (e.g., `systematic-debugging`, `write-agent-prompts`). Do not generate redundant project-level skills by default.
- **Project Assets (`AGENTS.md` + `Docs/PROJECT.md`):** Concrete project-specific rules, facts, and verification commands.

---

## Non-negotiable Safety Rules

- During and after the initial scan, do not create, overwrite, move, delete, or modify project files unless the user has explicitly confirmed the Phase 4 proposal.
- Do not invent project facts. Mark unknown or ambiguous facts as **TODO** or **需要用户确认**.
- Do not fill `AGENTS.md` with generic boilerplate. Record only rules that are specific, actionable, and supported by code evidence or explicit user direction.
- Do not restructure directories without approval. If the user permits directory organization, identify the exact moves and request separate confirmation before performing them.
- Do not overwrite or update existing `AGENTS.md`, `CLAUDE.md`, `README.md`, docs, rules, or skills unless the user explicitly authorizes that operation.
- Treat every repository in a workspace independently. Preserve existing uncommitted user changes and report them without altering them.
- Do not read, print, copy, summarize, or place credentials, private keys, tokens, passwords, certificates, or production-secret values in generated artifacts. Report only their path, file type, and risk classification, then mark them as skipped.

---

## Evidence and Scope Rules

- Tie every diagnostic fact and generated rule to concrete evidence: a file path and line/section, a version-control result, a build/test artifact, a user statement, or an authoritative external source.
- Label conclusions as **fact**, **inference**, or **需要用户确认**. When sources conflict, identify both sources and do not select one as authoritative without evidence or user direction.
- For a multi-repository workspace, produce a scope map that names each subproject, its owning instructions, its build boundary, and its relationship to shared interfaces.
- Root `AGENTS.md` covers confirmed workspace-wide conventions; keep subproject-specific rules, build steps, and safety constraints within that subproject's scope.
- Treat cross-repository protocols, shared libraries, generated interfaces, release artifacts, and hardware/firmware boundaries as explicitly shared.

---

## Knowledge Authority Order

When information conflicts, apply this precedence order unless the user specifies otherwise:

1. Explicit user instruction.
2. Current source code and active build/runtime configuration.
3. Maintained project documentation (`Docs/PROJECT.md`, `Docs/DECISIONS.md`).
4. Design specifications and vendor material confirmed as applicable.
5. Code comments.
6. Historical documents, release notes, and commit history.
7. File names, directory names, and unstated assumptions.

Never resolve a material conflict silently. Include an authority-conflict entry with the sources, their evidence, affected scope, and the question requiring user confirmation.

---

## Scan Budget

Start with a shallow scan: inspect the workspace root and descend no more than three levels inside a detected project boundary. Deepen the scan only when diagnosis requires a specific source, build, test, or interface path.

By default, skip hidden build/cache directories, generated output, dependency trees, large archives, and binary files (`node_modules`, `build`, `out`, `dist`, `target`, `.vscode`, `.idea`, `vendor`, `.bin`, `.hex`, `.elf`, `.map`, `.zip`, `.pdf`).

Do not automatically skip `README` files, existing docs, build scripts, manifests, configuration files, tests, or CI definitions.

---

## Workflow Phases

### Phase 0 — Maturity Routing
Classify the existing collaboration setup:
1. **Bootstrap candidate:** No meaningful `AGENTS.md`, `CLAUDE.md`, or docs structure; build/test guidance is absent or weak.
2. **Reconcile candidate:** Guidance exists, but is fragmented, duplicated across multiple docs/adapters, stale, or conflicting.
3. **Maintenance candidate:** An intentional `AGENTS.md` and coherent `Docs/PROJECT.md` already exist and need incremental care.

*For a Maintenance candidate, report the classification and recommend `agent-workflow-maintenance`.*

### Phase 1 — Survey (Read-Only)
Inspect the workspace without modifying it:
- Directory structure, package manifests, toolchains, build scripts, and test commands.
- Main entry points, source trees, CI/CD workflows, and hardware/runtime configurations.
- Existing instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, etc.).
- Version-control status (uncommitted changes, branches).

### Phase 2 — Diagnosis (Read-Only)
Present a concise diagnosis in the conversation:
1. Project/workspace type and primary purpose.
2. Technology stack, toolchains, build/test entry points.
3. Subprojects / module boundaries and responsibilities.
4. Existing collaboration guidance state.
5. Missing or weak documentation areas.
6. Potential risks (uncommitted changes, secrets, fragile interfaces, conflicting rules).

Use **需要用户确认** for anything not established by evidence.

### Phase 3 — Ask the User (Mandatory Pause)
Stop and present the structured configuration options.

```text
1. 初始化范围：
   A. 根目录工作区 (Recommended)
   B. 当前子项目
   C. 根目录加指定子项目
   D. 自定义

2. 文档方案（Lean 架构）：
   A. Lean 方案（推荐：AGENTS.md + Docs/PROJECT.md）
   B. Tracked 方案（Lean + TASKS.md 任务追踪）
   C. Evolving 方案（Lean + TASKS.md + Docs/DECISIONS.md 架构决策）
   D. 自定义

3. 平台适配器（仅为不支持原生读取 AGENTS.md 的平台生成极简 Adapter）：
   A. 按需生成（默认：原生支持 AGENTS.md 的平台不生成额外文件，其余生成极简 Adapter） (Recommended)
   B. 仅 AGENTS.md（平台中立标准，不生成任何 Adapter 文件）
   C. 指定平台 Adapter（如 Claude Code / Cursor）
   D. 自定义

4. 文档语言：
   A. 中文 (Recommended)
   B. 英文
   C. 中英双语
   D. 自定义

5. 文件操作策略：
   A. 仅新增文件 (Recommended)
   B. 允许更新已确认的现有文档
   C. 允许整理/合并旧文档（每次变动需单独确认）
   D. 自定义

6. Onboarding 模式：
   A. Bootstrap（从零建立 Lean 架构）
   B. Reconcile（收敛/合并已有碎片文档至 PROJECT.md）
   C. 自定义
```

Ask the user to reply compactly (e.g., `1A, 2A, 3A, 4A, 5A, 6A`).

### Phase 4 — Proposal (Mandatory Second Pause)
Prepare a concrete file plan based on user choices. State:
- Files to create with one-line purpose each.
- Planned sections inside `Docs/PROJECT.md` based on tech stack (Architecture, Build & Verification, Hardware, Protocol, OTA, etc.).
- Dynamic Knowledge Map table to be placed in `AGENTS.md` (containing only rows for artifacts actually present).
- Standard Baseline Rules to be embedded into `AGENTS.md` (Git branching, operation approvals, Conventional Commits).
- Files to update or merge (if Reconcile mode).
- Files explicitly out of scope / untouched.
- Assumptions, evidence, and unresolved TODO markers.

Wait for explicit user confirmation before writing any file.

### Phase 5 — Generate (Only After Confirmation)
Create only the approved files:
- **`AGENTS.md`**: Contains agent rules, standard baseline rules (Git branching & Conventional Commits), verification mandate (pointing to `Docs/PROJECT.md`), and the dynamic Knowledge Map.
- **`Docs/PROJECT.md`**: Single consolidated technical source of truth. Include stack-specific sections:
  - Architecture & Component Map
  - Build, Run & Verification Guide (exact commands, environments, and test steps)
  - Hardware & Peripheral Boundaries (if embedded/hardware)
  - Memory Map & Partition Layout (if firmware/embedded)
  - Communication Protocols & APIs (if network/inter-process)
  - OTA / Update Flow (if applicable)
  - Debugging & Known Workarounds
  - Testing & Quality Plan
- **`Docs/DECISIONS.md`** (if Evolving profile selected): Architectural Decision Records.
- **`TASKS.md`** (if Tracked/Evolving profile selected): Structured task tracker.
- **Platform Adapters** (only if requested and platform cannot read `AGENTS.md` natively): Short references pointing to `AGENTS.md` and `Docs/PROJECT.md`.

### Phase 6 — Review & Handoff
Report:
1. Created/updated files and their roles.
2. Content marked as **TODO** or requiring user confirmation.
3. Recommended next actions (e.g., using `write-agent-prompts` for task delegation or `agent-workflow-maintenance` for ongoing updates).

---

## Standard Baseline Rules in Generated `AGENTS.md`

Every generated `AGENTS.md` must automatically incorporate these baseline engineering collaboration rules (phrased idiomatically in the target project language):

### 1. 分支与 Git 操作 (Branching & Git Operations)
- **独立功能分支开发：** 所有代码修改必须在独立的功能/特性分支上进行，**严禁直接在 `main` 或 `develop` 主分支上修改**。功能分支默认从 `develop` 切出；若项目中尚无 `develop` 分支，或当前改动所属分支不明确，必须先向用户询问确认。
- **Git 操作授权审批：** 不自动执行 `git commit`、`git merge`、`git rebase`、`git push`、`git tag` 等变更版本历史或远端状态的操作。这些 Git 操作必须事先获得用户明确批准。

### 2. 提交规范与版本 (Commits & Versioning)
- **Conventional Commits 规范：** 提交信息必须遵循 `<type>(<scope>): <description>` 格式。
- **常用类型（type）：** 包括 `feat`（新功能）、`fix`（Bug修复）、`chore`（构建依赖/杂项）、`build`（构建系统）、`refactor`（代码重构）、`test`（测试用例）、`docs`（文档）、`style`（代码格式）等常规类型。
- **范围（scope）：** 使用受影响的模块/子系统名称命名。

### 3. 代码变更验证机制 (Verification Mandate)
- 代码修改完成后，必须执行项目规定的构建与测试验证流程。
- 具体构建与验证命令见 `Docs/PROJECT.md` -> `Build, Run & Verification` 章节。

---

## Dynamic `AGENTS.md` Knowledge Map Rules

Every generated `AGENTS.md` must include a Project Knowledge Map table. **Include only rows whose source-of-truth artifacts actually exist or are included in the approved generation plan.** Never generate ghost entries or dead links.

### Base Knowledge Map (Lean Profile: `AGENTS.md` + `Docs/PROJECT.md`)

```markdown
## Project Knowledge Map

| Knowledge Domain | Source of Truth | Scope & Notes |
|---|---|---|
| Agent Rules & Safety | `AGENTS.md` | Behavioral rules, safety boundaries, Git policies, verification mandate |
| System Architecture & Components | `Docs/PROJECT.md` | Section: Architecture & Component Map |
| Build, Run & Verification Facts | `Docs/PROJECT.md` | Section: Build, Run & Verification |
| Hardware & Memory Map | `Docs/PROJECT.md` | Section: Hardware & Memory Map (if applicable) |
| Protocols & APIs | `Docs/PROJECT.md` | Section: Communication Protocols (if applicable) |
| Debugging & Workarounds | `Docs/PROJECT.md` | Section: Debugging & Known Workarounds |
```

### Conditional Additions (Only if Artifacts Exist):
- If `TASKS.md` exists or is approved:
  `| Active Tasks & Progress | TASKS.md | Current task backlog and execution progress |`
- If `Docs/DECISIONS.md` exists or is approved:
  `| Architectural Decisions | Docs/DECISIONS.md | Non-obvious trade-offs and rationale |`
- If a section was promoted to a standalone doc under pressure (e.g. `Docs/OTA.md`):
  `| OTA & Firmware Update | Docs/OTA.md | Promoted dedicated specification |`
