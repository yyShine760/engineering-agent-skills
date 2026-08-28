---
name: agent-workflow-maintenance
description: Conservatively maintain an established AI-agent collaboration system through evidence-backed, minimal, user-approved updates. Use when a project already has intentional AGENTS.md, CLAUDE.md, Docs, rules, skills, task/status files, or ownership markers that need alignment, conflict review, link repair, TODO review, or a narrow update after a confirmed project change.
---

# Agent Workflow Maintenance

Maintain a mature agent workflow; do not initialize or replace it. Work from a specific maintenance trigger and propose the smallest auditable change set.

## Non-negotiable safety rules

- Do not reinitialize a project or regenerate its collaboration system.
- Do not rewrite AGENTS.md, merge, delete, move, or rename documents without explicit, target-specific approval.
- Do not update user-maintained files without explicit approval. Do not modify third-party, vendor, generated, build-output, or packaged files.
- Do not invent architecture, protocol, build, hardware, memory-layout, or operational facts. Mark uncertainty as **TODO** or **需要用户确认**.
- Do not expand the user's requested scope. If no concrete maintenance trigger exists, provide findings and recommendations only.
- Do not read, print, copy, or place credentials, keys, tokens, passwords, certificates, or production-secret values in maintenance artifacts.

## Ownership and authority

Classify every relevant file before proposing an edit:

- **Managed by onboarding / agent workflow:** eligible for approved incremental maintenance.
- **User-maintained:** suggest changes only until the user specifically approves editing it.
- **Third-party / vendor / generated:** do not modify.
- **Unknown ownership:** ask the user before proposing a write.

Resolve conflicts using explicit user instruction first, then active source/build configuration, maintained project documentation, applicable design/vendor material, comments, and historical material. Never silently choose between materially conflicting sources.

## Phase 1 — Read Existing Workflow (read-only)

Inspect only the workflow and the files relevant to the stated change. Check, as applicable:

- AGENTS.md, CLAUDE.md, platform-specific instructions, and nested instruction files.
- .agents, skills, rules, templates, Docs, TASKS.md, status.md, and README.md.
- Build scripts, test scripts, CI configuration, and source/configuration evidence needed to assess the trigger.

Output a concise workflow map: instruction layers and precedence, managed files, user-owned files, platform mappings, and cross-file links. Do not perform a full onboarding scan.

If the project lacks a coherent collaboration foundation, stop and recommend agent-workflow-onboarding instead.

## Phase 2 — Detect Change Trigger

Identify the maintenance trigger as one or more of:

- Code architecture, build process, protocol/interface, hardware/embedded constraint, or team-rule change.
- Documentation drift, stale TODO, broken link, outdated path, or conflicting rule/skill.
- A user-requested cleanup or synchronization.

State the evidence for the trigger. If no trigger is established, do not begin broad maintenance; report recommendations and request direction.

## Phase 3 — Diff-Oriented Diagnosis

Present the smallest supported change set. For each finding, distinguish:

- **Fact:** file-backed evidence.
- **Inference:** a reasonable but unconfirmed conclusion.
- **Question:** user confirmation required.
- **Risk:** possible harm from an incorrect change.

State which files may need updates, why, relevant evidence, conflicting sources, unknowns, and files that must remain unchanged.

## Phase 4 — Minimal Proposal (mandatory pause)

Before writing, provide:

- Exact files proposed for update and the narrow reason for each.
- Files explicitly out of scope.
- Ownership of every proposed file and the authorization needed.
- Changes to links, TODOs, cross-platform mappings, or rules/skill references.
- Any effect on generated, third-party, or user-maintained content.
- Unresolved questions, risks, and validation limits.

Wait for explicit confirmation. Deleting, moving, merging, or renaming documents requires separate approval; do not treat "continue" as approval for those operations.

## Phase 5 — Apply Approved Changes

Apply only the approved minimal changes. Prefer repairing links and paths, updating evidence-backed commands, marking or removing confirmed-stale TODOs, adding narrow explanations, and correcting references between rules and skills.

Do not rewrite a full document unless the user explicitly requests it. After edits, validate links, paths, references, and any machine-readable syntax that was changed.

## Phase 6 — Maintenance Report

Report:

1. Updated files and the reason and evidence for each update.
2. Validation performed and anything not verified.
3. Remaining user-confirmation items and unresolved conflicts.
4. Outstanding TODOs and a focused next-maintenance recommendation.

## Relationship to onboarding

Use agent-workflow-onboarding for missing, weak, or incoherent project collaboration foundations. Use this Skill for ongoing, conservative maintenance after such a foundation already exists.
