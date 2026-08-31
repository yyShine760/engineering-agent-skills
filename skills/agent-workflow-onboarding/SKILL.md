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
├── AGENTS.md             # Rulebook: agent behavioral rules, constraints, build/verify commands & Knowledge Map
├── Docs/
│   ├── PROJECT.md        # Single consolidated project facts: Architecture, Components, Hardware, Protocols, OTA, etc.
│   └── DECISIONS.md      # (Optional) Architecture Decision Records & rationale for non-obvious choices
└── TASKS.md              # (Optional) Active task list, progress, and backlog (replaces separate status files)
```

### 2. Promote-on-Pressure (Grow, Then Split)
- **Do NOT split documents prematurely (KISS / YAGNI).** Start with sections inside `Docs/PROJECT.md`.
- Promote a section into a standalone document (e.g., `Docs/OTA.md` or `Docs/PROTOCOL.md`) only when it naturally expands (e.g. >300 lines), requires independent access control, or has distinct ownership.

### 3. Zero Derived State Duplication
- **No `status.md`**. Task states and progress are tracked strictly in `TASKS.md`.
- *Rule:* A fact that can be derived from another managed artifact must not be stored separately.

### 4. Explicit Boundary: Rules vs. Facts vs. Workflows
- **Global Skills:** Cross-project methodology & execution workflows (e.g., `systematic-debugging`, `write-agent-prompts`). Do not generate redundant project-level skills by default.
- **`AGENTS.md`:** Project behavioral rules, permissions, boundaries, prohibitions, build/test commands.
- **`Docs/PROJECT.md`:** Concrete technical facts, system architecture, hardware maps, protocols, and debugging notes.

### 5. Platform Files as Thin Adapters
- `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, etc. are **thin adapters**, not knowledge stores.
- They must only point to `./AGENTS.md` and `Docs/PROJECT.md`, never duplicating project rules or facts.

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

3. 平台适配器（生成指向 AGENTS.md 的极简 Adapter）：
   A. 多平台兼容（CLAUDE.md + Cursor / OpenCode 等通用适配）
   B. 仅 AGENTS.md（平台无关标准）
   C. 仅指定平台（Codex / Claude Code / Cursor / OpenCode / Gemini CLI）
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
- Planned sections inside `Docs/PROJECT.md` based on tech stack (e.g., Architecture, Build, Hardware, Protocol, OTA).
- Knowledge Map table to be included in `AGENTS.md`.
- Files to update or merge (if Reconcile mode).
- Files explicitly out of scope / untouched.
- Assumptions, evidence, and unresolved TODO markers.

Wait for explicit user confirmation before writing any file.

### Phase 5 — Generate (Only After Confirmation)
Create only the approved files:
- **`AGENTS.md`**: Contains agent rules, prohibitions, build/test commands, and the Knowledge Map.
- **`Docs/PROJECT.md`**: Single consolidated technical source of truth. Include stack-specific sections:
  - Architecture & Component Map
  - Build, Run & Verification Guide
  - Hardware & Peripheral Boundaries (if embedded/hardware)
  - Memory Map & Partition Layout (if firmware/embedded)
  - Communication Protocols & APIs (if network/inter-process)
  - OTA / Update Flow (if applicable)
  - Debugging & Known Workarounds
  - Testing & Quality Plan
- **`Docs/DECISIONS.md`** (if Evolving profile selected): Architectural Decision Records.
- **`TASKS.md`** (if Tracked/Evolving profile selected): Structured task tracker.
- **Platform Adapters** (e.g. `CLAUDE.md`): Short references pointing to `AGENTS.md`.

### Phase 6 — Review & Handoff
Report:
1. Created/updated files and their roles.
2. Content marked as **TODO** or requiring user confirmation.
3. Recommended next actions (e.g., using `write-agent-prompts` for task delegation or `agent-workflow-maintenance` for ongoing updates).

---

## Standard `AGENTS.md` Knowledge Map Template

Every generated `AGENTS.md` should include a Knowledge Map table to enable direct, single-lookup maintenance:

```markdown
## Project Knowledge Map

| Knowledge Domain | Source of Truth | Scope & Notes |
|---|---|---|
| Agent Rules & Safety | `AGENTS.md` | Non-negotiable boundaries, build/test commands |
| System Architecture & Components | `Docs/PROJECT.md` | Section: Architecture & Component Map |
| Build, Run & Verification | `Docs/PROJECT.md` | Section: Build & Verification |
| Hardware & Memory Map | `Docs/PROJECT.md` | Section: Hardware & Memory Map (if applicable) |
| Protocols & APIs | `Docs/PROJECT.md` | Section: Protocols (if applicable) |
| Debugging & Workarounds | `Docs/PROJECT.md` | Section: Debugging |
| Architectural Decisions | `Docs/DECISIONS.md` | Non-obvious trade-offs and rationale |
| Active Tasks & Progress | `TASKS.md` | Current task queue and progress status |
```
