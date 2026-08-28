---
name: agent-workflow-onboarding
description: Interactively survey an unfamiliar code project or multi-project workspace, produce a read-only diagnosis, and propose a confirmed AI-agent collaboration setup. Use when asked to onboard, initialize, document, prepare, or establish AGENTS.md, Docs, rules, project skills, TASKS.md, or status.md for Codex, Claude Code, Cursor, Gemini CLI, OpenCode, or compatible coding agents.
---

# Interactive Project Onboarding

Establish a durable AI-agent knowledge system for a code project or multi-software workspace. Work interactively: inspect first, diagnose second, ask the user to choose the scope, and generate files only after explicit confirmation.

Do not run this Skill merely because a user asks to browse, explain, diagnose, or modify an existing project. Use it when they ask to set up, improve, or initialize project collaboration guidance and documentation.

This Skill does not maintain mature agent workflows long term. If the project already has a coherent AGENTS.md, Docs, rules, skills, and task/status system, stop after maturity routing and recommend agent-workflow-maintenance.

## Non-negotiable safety rules

- During and after the initial scan, do not create, overwrite, move, delete, or otherwise modify project files unless the user has explicitly confirmed the Phase 4 proposal.
- Do not invent project facts. Mark unknown or ambiguous facts as **TODO** or **需要用户确认**.
- Do not fill AGENTS.md with generic template language. Record only rules that are specific, actionable, and supported by evidence or explicit user direction.
- Do not restructure directories without approval. If the user permits directory organization, identify the exact moves and request separate confirmation before performing them.
- Do not overwrite or update existing AGENTS.md, CLAUDE.md, README.md, Docs content, rules, or skills unless the user explicitly authorizes that operation.
- Treat every repository in a workspace independently. Preserve existing uncommitted user changes and report them without altering them.
- Do not read, print, copy, summarize, or place credentials, private keys, tokens, passwords, certificates, or production-secret values in generated artifacts. Report only their path, file type, and risk classification, then mark them as skipped.

## Evidence and scope rules

- Tie every diagnostic fact and every generated project-specific rule to evidence: a file path and relevant line or section, a version-control result, a build/test artifact, a user statement, or an explicitly identified external authority.
- Label conclusions as **fact**, **inference**, or **需要用户确认**. When sources conflict, identify both sources and do not select one as authoritative without evidence or user direction.
- For a multi-repository workspace, produce a scope map that names each repository/subproject, its owning instructions, its build boundary, and its relationship to shared interfaces.
- Do not let a root-level guide silently govern every subproject. Propose root guidance only for confirmed workspace-wide rules; keep subproject-specific rules, build steps, and safety constraints within that subproject's scope.
- Treat cross-repository protocols, shared libraries, generated interfaces, release artifacts, and hardware/firmware boundaries as explicitly shared. List affected subprojects before proposing a change.

## Knowledge authority order

When information conflicts, apply this order unless the user identifies a different project-specific authority:

1. Explicit user instruction.
2. Current source code and active build/runtime configuration.
3. Maintained project documentation.
4. Design specifications and vendor material confirmed as applicable.
5. Code comments.
6. Historical documents, release notes, and commit history.
7. File names, directory names, and unstated assumptions.

Never resolve a material conflict silently. Include an authority-conflict entry with the sources, their evidence, affected scope, and the question requiring user confirmation.

## Large, vendor, generated, and embedded material

- Classify large binaries, archives, PDFs, images, vendor SDKs, chip manuals, generated code, build outputs, and dependency caches before inspecting them.
- Prefer filenames, metadata, manifests, checksums, and targeted extraction over bulk loading. Do not infer implementation behavior from binary artifacts alone.
- Treat vendor and reference material as evidence with a stated authority level; record version, origin, and applicability when known. Do not copy it into project documentation as if it were project-owned source.
- Do not edit generated files, build output, firmware images, vendor trees, lockfiles, or packaged artifacts unless the user explicitly includes them in the approved scope. Document the upstream source or generator instead.
- For embedded projects, keep Survey and Diagnosis strictly non-invasive: do not flash devices, run destructive programmers, change fuses, erase storage, invoke physical I/O, or claim hardware behavior from source inspection alone.
- Require explicit confirmation before proposing changes to memory maps, boot flow, interrupts, startup code, linker scripts, register configuration, safety interlocks, OTA/update paths, or production programming procedures. Identify the relevant hardware, toolchain, and validation boundary as **需要用户确认** if not evidenced.

## Scan budget

Start with a shallow scan: inspect the workspace root and descend no more than three levels inside a detected project boundary. Deepen the scan only when the diagnosis requires a specific source, build, test, or interface path.

By default, skip hidden build/cache directories, generated output, dependency trees, large archives, and binary files. Common exclusions include node_modules, build, out, dist, target, .vscode, .idea, vendor, third_party, and files such as .bin, .hex, .elf, .map, .zip, and .pdf.

Do not automatically skip README files, Docs, architecture material, build scripts, project/IDE files, manifests, configuration files, tests, or CI definitions. Report each skipped high-value item and why it was skipped; ask the user before inspecting it when it may be authoritative.

## Phase 0 — Maturity Routing

Before a full onboarding flow, classify the existing agent-collaboration setup:

1. **Bootstrap candidate:** no meaningful AGENTS.md, CLAUDE.md, rules, skills, or Docs structure; build and test guidance is absent or weak.
2. **Reconcile candidate:** some guidance exists, but it is incomplete, duplicated, stale, conflicting, or has unclear project boundaries or authority.
3. **Maintenance candidate:** intentional AGENTS.md and a coherent Docs, rules, skills, task/status, or ownership system already exist and need incremental care.

For a Maintenance candidate, report the basis for the classification and recommend agent-workflow-maintenance. Do not continue with Bootstrap or Reconcile by default.

If the user explicitly requests replacement of a mature workflow, first prepare a migration/replacement proposal that identifies every affected existing file, ownership, compatibility risk, and rollback approach. Wait for explicit confirmation before changing anything.

Do not treat a mature workflow as a blank project.

## Phase 1 — Survey (read-only)

Inspect the workspace without modifying it. Determine the workspace root and identify repositories and subprojects.

Check, as applicable:

- Directory structure and project entry points.
- README files and existing documentation.
- Build, dependency, package, workspace, IDE, and toolchain files.
- Main source, test, script, CI/CD, deployment, infrastructure, and generated-output directories.
- Existing AGENTS.md, CLAUDE.md, Cursor rules, Gemini/OpenCode instructions, rules, skills, and task/status files.
- Version-control status for each repository, without changing it.

Use the scan budget and fast, read-only search and inspection commands. Do not infer undocumented behavior from filenames alone. Do not create a report file unless the user has already approved file generation.

## Phase 2 — Diagnosis (still read-only)

Present a concise project diagnosis in the conversation. Include:

1. Project/workspace type and likely purpose.
2. Technology stack and key toolchains.
3. Repositories and subprojects, including their responsibilities.
4. Main source, build, test, script, and CI locations.
5. Existing guidance and documentation.
6. Missing or weak documentation and collaboration guidance.
7. Potential risks: uncommitted changes, generated artifacts, secret-like data, unclear ownership, fragile cross-project interfaces, authority conflicts, or unverified assumptions.

Use **需要用户确认** for anything not established by inspected evidence. Separate facts, inferences, and recommendations.

## Phase 3 — Ask the user (mandatory pause)

After the diagnosis, stop and ask for choices. Do not generate or edit project files in the same turn.

Ask for all of the following:

1. **Initialization scope:** workspace root; current subproject; or root plus named subprojects.
2. **Documentation profile:** Minimal; Standard; Embedded Product Workspace; Multi-Agent; or custom.
3. **Agent platforms:** Codex; Claude Code; Cursor; Gemini CLI; OpenCode; or multi-platform compatible.
4. **Document language:** Chinese; English; or bilingual.
5. **File operation policy:** add files only; allow approved updates to existing docs; or allow directory organization with separate confirmation.
6. **Project-level skills:** generate them or not.
7. **Task tracking:** generate TASKS.md and/or status.md, or not.
8. **Onboarding mode:** Bootstrap for a new or undocumented project; Reconcile for a project with existing guidance that needs an authority and conflict review.

Ask any additional question required to resolve an important ambiguity, such as documentation ownership, target hardware, release process, or which existing guide is authoritative.

Use a numbered menu so the user can answer compactly. Include an “other/custom” option for every question:

1. 初始化范围：A. 根目录工作区  B. 当前子项目  C. 根目录加指定子项目  D. 自定义
2. 文档规模：A. 精简版  B. 标准版  C. 嵌入式完整版  D. 多 Agent  E. 自定义
3. Agent 平台：A. Codex  B. Claude Code  C. Cursor  D. Gemini CLI  E. OpenCode  F. 多平台兼容  G. 自定义
4. 文档语言：A. 中文  B. 英文  C. 中英混合  D. 自定义
5. 文件策略：A. 仅新增  B. 允许更新已确认文档  C. 可整理目录但每次移动需单独确认  D. 自定义
6. 项目级 skills：A. 生成  B. 不生成  C. 自定义
7. TASKS.md / status.md：A. 两者都生成  B. 仅 TASKS.md  C. 仅 status.md  D. 均不生成  E. 自定义
8. Onboarding 模式：A. Bootstrap（以新增为主）  B. Reconcile（先审计已有资料和冲突）  C. 自定义

Ask the user to reply in a compact form, for example: 1A, 2C, 3F, 4A, 5A, 6B, 7A, 8B.

## Phase 4 — Proposal (mandatory second pause)

Use the user's selections to prepare a concrete file plan. Do not write files yet.

State:

- Files to create, with one-line purpose each.
- Files to update, why each update is necessary, and the exact authorization that permits it.
- Files and directories that will not be touched.
- Current assumptions and their evidence.
- Unresolved questions and planned TODO markers.
- Risks and any verification that cannot be performed.
- A platform mapping for each selected agent platform, limited to the files and conventions that platform actually requires.
- A dependency check for proposed profiles, cross-file links, shared rules, and platform-specific artifacts.
- A file ownership plan: each file's status (new, existing, generated, or third-party), intended owner, and its update policy.

Wait for an explicit confirmation that identifies or clearly accepts this plan. Treat a general request such as “continue” as insufficient when the plan includes updating existing files or moving directories; ask for targeted approval instead.

## Phase 5 — Generate (only after confirmation)

Create only the approved files. Update only the approved existing files. Never silently broaden the plan.

Possible deliverables include:

- AGENTS.md
- Docs/architecture.md
- Docs/component-map.md
- Docs/build-guide.md
- Docs/protocol.md
- Docs/hardware.md
- Docs/memory-map.md
- Docs/ota.md
- Docs/debugging.md
- Docs/test-plan.md
- Docs/decisions.md
- TASKS.md
- status.md
- rules/*.md
- skills/*/SKILL.md

Use TODO for missing or unverified information. Do not add placeholder commands, release steps, addresses, credentials, protocol details, test results, or operational claims that have not been confirmed.

After writing, validate links, paths, file names, and any machine-readable syntax. Report validation that could not be performed.

## Phase 6 — Review

Report:

1. Created and updated files.
2. Content requiring user confirmation.
3. Outstanding TODO items.
4. Recommended next steps.
5. An authority-conflict report, including unresolved source conflicts and the affected files or subprojects.

Do not claim that hardware, integration, production, or release validation was completed unless it was actually performed and evidenced.

## Initialization profiles

Select a profile as a starting point, then tailor it to confirmed project needs.

### Minimal Profile

- AGENTS.md
- Docs/architecture.md
- Docs/component-map.md
- Docs/build-guide.md

### Standard Profile

Include Minimal Profile plus:

- Docs/protocol.md
- Docs/debugging.md
- Docs/decisions.md
- TASKS.md

### Embedded Product Workspace Profile

Include Standard Profile plus:

- Docs/hardware.md
- Docs/memory-map.md
- Docs/ota.md
- Docs/test-plan.md
- rules/embedded-c.md
- rules/firmware-safety.md

### Multi-Agent Profile

Include Standard Profile plus:

- rules/agent-workflow.md
- skills/code-review/SKILL.md
- skills/build-error-resolver/SKILL.md
- skills/project-sync/SKILL.md

## AGENTS.md principles

Write AGENTS.md as a concise engineering-collaboration rulebook, not a project encyclopedia.

- Include a project overview, directory responsibilities, required reading before changes, project-specific prohibitions, verification expectations, and commit conventions.
- State only rules that distinguish this project from ordinary development practice.
- Keep it short enough to be read before every task.
- Put detailed architecture, interface, hardware, and troubleshooting information in Docs and link to it.
- Preserve existing authoritative instructions unless the user specifically approves a revision.
- Use layers deliberately: a root AGENTS.md covers confirmed workspace-wide conventions; each repository or subproject guide covers only its own implementation, build, test, and safety rules; platform-specific files are short adapters that point to the shared rules rather than duplicate them.
- State precedence and scope when multiple instruction files exist. Do not duplicate conflicting rules across layers; surface the conflict as **需要用户确认**.

## Docs principles

Treat Docs as long-term project memory. Prefer concrete, maintained facts over boilerplate.

- architecture.md: system structure, runtime boundaries, and component interactions.
- component-map.md: directories, repositories, and subproject responsibilities.
- build-guide.md: prerequisites, build commands, artifacts, and reproducible verification.
- protocol.md: interfaces, message formats, compatibility constraints, and validation cases.
- decisions.md: significant decisions, alternatives, rationale, and consequences.
- debugging.md: known failures, diagnostics, workarounds, and investigation history.

For embedded or product workspaces, use hardware.md for board and peripheral constraints, memory-map.md for address and partition ownership, ota.md for update flow and integrity boundaries, and test-plan.md for risk-based validation.

Use TODO for unverified content, link to its source when available, and record the question needed to resolve it.

Before writing or expanding a document, make sure it helps an agent answer practical questions such as:

- What component owns this behavior, and which files are safe to change?
- Which command builds, tests, packages, flashes, or verifies it, and what artifact should result?
- Which configuration, environment, hardware, credential, or external system is required?
- Which interfaces, data formats, addresses, version contracts, or compatibility boundaries must remain stable?
- What failure symptoms, logs, inspection points, and rollback or recovery steps are relevant?
- What is confirmed, what is obsolete, and what still requires a human decision?
