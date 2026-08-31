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
Change Trigger (e.g. "OTA flash partition changed")
       ↓
Read `AGENTS.md` (Project Knowledge Map)
       ↓
Identify Single Source of Truth (e.g. `Docs/PROJECT.md` -> Memory Map / OTA)
       ↓
Inspect Code / Toolchain Evidence
       ↓
Targeted Minimal Edit on that Single Section
```

### 2. Single Source of Truth
- Every domain has exactly one authoritative owner listed in the `AGENTS.md` Knowledge Map.
- Update only the designated source of truth. Platform adapters (`CLAUDE.md`, etc.) are thin pointers and do not store duplicated facts.

### 3. Promote-on-Pressure (Grow, Then Split)
- By default, maintain information within its existing section in `Docs/PROJECT.md`.
- **Only** when a specific section naturally outgrows its container (e.g., >300 lines of detailed protocol/hardware specs) or requires independent ownership, propose promoting it to a dedicated document (e.g., `Docs/OTA.md`) and update the Knowledge Map in `AGENTS.md` accordingly.

### 4. Zero Derived State
- Maintain active tasks and progress exclusively in `TASKS.md`. Never create or sync separate status files.

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
   - **Agent rules / prohibitions / build commands:** `AGENTS.md`
   - **System architecture, hardware, protocols, OTA, debugging, build facts:** `Docs/PROJECT.md`
   - **Architectural decisions / trade-offs:** `Docs/DECISIONS.md`
   - **Active tasks / progress:** `TASKS.md`

### Phase 2 — Inspect Evidence (Read-Only)
Inspect only the relevant source code, configuration, header, manifest, or linker script needed to verify the trigger. Do not perform a workspace-wide scan.

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
- Any promote-on-pressure split proposal (if a section has grown too large).

*Wait for user confirmation before making any file modifications.*

### Phase 5 — Apply Approved Changes
Apply only the approved minimal changes to the single source of truth. Validate markdown formatting, headings, and referenced paths.

### Phase 6 — Maintenance Report
Provide a concise summary:
1. Updated document and section.
2. Verified facts vs. outstanding TODOs.
3. Handoff or next suggested development action.
