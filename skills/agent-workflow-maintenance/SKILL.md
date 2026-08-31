---
name: agent-workflow-maintenance
description: Conservatively maintain an established lean AI-agent collaboration system (AGENTS.md, Docs/PROJECT.md, DECISIONS.md, TASKS.md) through trigger-driven, source-of-truth-oriented minimal updates. Use when code architecture, build commands, hardware constraints, protocols, or active tasks change and require targeted documentation alignment.
---

# Agent Workflow Maintenance (Trigger-Driven)

Maintain an established, lean AI-agent collaboration system. Work strictly from a **concrete change trigger** and target the **single source of truth** identified in `AGENTS.md`. Propose the smallest auditable change set without performing broad workspace scans.

---

## Core Maintenance Principles

### 1. Trigger-Driven Direct Lookup
Never perform a broad multi-file survey. Execute a fast, single-lookup resolution flow:
```text
Change Trigger (e.g. "OTA flash partition changed" or "Build command updated")
       ↓
Read `AGENTS.md` (Project Knowledge Map)
       ↓
Identify Single Source of Truth (e.g. `Docs/PROJECT.md` -> Section: Build & Verification)
       ↓
Inspect Code / Toolchain Evidence
       ↓
Targeted Minimal Edit on that Single Section
```

### 2. Single Source of Truth & Division of Responsibilities
- **`AGENTS.md`:** Agent behavioral rules, safety boundaries, permissions, commit policies, and verification mandate.
- **`Docs/PROJECT.md`:** All technical facts: architecture, component mapping, exact build/run/test/verification commands, hardware maps, protocols, OTA, and debugging notes.
- **`Docs/DECISIONS.md`** *(if present)*: Architectural Decision Records & rationale.
- **`TASKS.md`** *(if present)*: Active task backlog and execution progress.
- Platform adapters (`CLAUDE.md`, etc.) are thin pointers; never store duplicated technical facts or rules inside them.

### 3. Promote-on-Pressure (Grow, Then Split)
- By default, maintain information within its existing section in `Docs/PROJECT.md`.
- Propose promoting a section into a standalone document (e.g. `Docs/OTA.md`) only when one or more heuristic criteria are met:
  - The section becomes difficult to navigate;
  - It has independent ownership or distinct team maintainers;
  - It has a substantially different update cadence;
  - It requires independent access or security control;
  - Its size materially reduces usability (*line count, e.g. ~300+ lines, is a heuristic, not a rigid threshold*).
- When a document is promoted, update the corresponding row in the `AGENTS.md` Project Knowledge Map.

### 4. Zero Derived State
- Maintain active tasks and progress exclusively in `TASKS.md`. Never create, update, or sync separate status files.

---

## Non-negotiable Safety Rules

- Do not reinitialize a project or regenerate its collaboration system.
- Do not rewrite entire documents when a sectional update suffices.
- Do not modify third-party, vendor, generated, build-output, or packaged files.
- Do not invent architecture, protocol, build, hardware, memory-layout, or operational facts. Mark uncertainty as **TODO** or **需要用户确认**.
- Do not expand the user's requested scope. If no concrete maintenance trigger exists, provide findings and recommendations only.
- Do not read, print, copy, or place credentials, keys, tokens, passwords, certificates, or secrets in maintenance artifacts.

---

## Maintenance Workflow Phases

### Phase 1 — Locate via Knowledge Map (Read-Only)
1. Read `AGENTS.md` and inspect its **Project Knowledge Map**.
2. Identify the authoritative document and section responsible for the triggered change:
   - **Agent rules / permissions / safety boundaries / verification mandate:** `AGENTS.md`
   - **Build, run, test & verification commands / toolchain facts:** `Docs/PROJECT.md` (Section: Build, Run & Verification)
   - **System architecture / components / hardware / protocols / OTA / debugging:** `Docs/PROJECT.md` (Relevant section)
   - **Architectural decisions / trade-offs:** `Docs/DECISIONS.md` (if present)
   - **Active tasks / progress:** `TASKS.md` (if present)

### Phase 2 — Inspect Evidence (Read-Only)
Inspect only the relevant source code, configuration, header, manifest, or build/linker script needed to verify the trigger. Do not perform a workspace-wide scan.

### Phase 3 — Diff-Oriented Diagnosis
Formulate the minimal change set. Distinguish:
- **Fact:** File-backed evidence from inspected code/config.
- **Inference:** Reasonable interpretation requiring confirmation.
- **Question:** Specific point requiring user input (**需要用户确认**).

### Phase 4 — Minimal Proposal (Mandatory Pause)
Present the exact targeted change plan:
- Target document and section to update.
- Proposed diff summary (before vs. after).
- Code evidence supporting the change.
- Any promote-on-pressure split proposal (if a section has grown too large, including proposed Knowledge Map row update).

*Wait for user confirmation before making any file modifications.*

### Phase 5 — Apply Approved Changes
Apply only the approved minimal changes to the single source of truth. Validate markdown formatting, headings, and referenced paths.

### Phase 6 — Maintenance Report
Provide a concise summary:
1. Updated document and section.
2. Verified facts vs. outstanding TODOs.
3. Handoff or next suggested development action.
