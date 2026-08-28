---
name: write-agent-prompts
description: Draft, compress, review, or split copy-ready prompts for other AI agents while preserving all decision-critical context. Use when delegating implementation, testing, review, research, documentation, handoff, or other project work to an AI/subagent; when an existing agent prompt is verbose; or when development and testing need separate ownership. Do not use for ordinary user-facing answers that are not delegation briefs.
---

# Write Agent Prompts

## Objective

Produce the shortest prompt that lets the receiving agent act correctly without hidden conversation context. Treat the prompt as an execution contract, not a tutorial. Transfer decisions, not the planner's reasoning process.

## Build the prompt

1. Inspect the available sources of truth first: the user request, accepted plan, repository instructions, task documents, current worktree state, and relevant code or artifacts.
2. Preserve every fact whose omission could change execution, permissions, safety, evidence, acceptance, or handoff:
   - one concrete outcome;
   - starting state and inputs the recipient cannot infer safely;
   - frozen decisions, invariants, and exact literals;
   - allowed scope, prohibited actions, and ownership boundaries;
   - observable acceptance checks and evidence level;
   - required deliverables, handoff state, and stop conditions.
3. Remove context the recipient can cheaply discover from named sources. Point to a source instead of copying it. Include exact paths or commands only when they define a boundary, prevent ambiguity, or save material discovery.
4. Split prompts when agents own different outcomes. Give each agent only its own scope plus the minimum handoff contract. Keep implementation, independent testing, and read-only review separate when their permissions or evidence responsibilities differ.
5. Draft with direct imperatives and compact bullets. Put each fact in its strongest location once; merge clauses that prevent the same failure. Aim for no more than eight bullets per agent, exceeding that only when an additional bullet protects a distinct decision or boundary.
6. Run a loss audit: could the recipient modify the wrong thing, erase expected work, violate a frozen decision, overclaim evidence, miss acceptance, or leave an unusable handoff? Restore only the sentence that prevents each realistic failure.
7. Stop compressing when every remaining sentence changes a decision, action, check, or boundary.

## Use the smallest useful shape

For a routine task, use one paragraph or a few bullets. For a bounded project task, use only the applicable fields:

```text
任务：<single observable outcome>
起点：<branch, artifact, current state, or prerequisite>
范围：
- 做：<owned work>
- 不做：<materially risky or separately owned work>
验收：<checks and the evidence they establish>
交付：<artifacts and final handoff state>
遇到 <specific blocker> 时停止并报告。
```

Omit empty fields and merge adjacent fields when that is clearer. Do not add role-play, introductions, a restatement at the end, or instructions to confirm understanding.

## Compress without losing control

- Preserve literal APIs, versions, error strings, paths, hashes, limits, and user-approved decisions exactly when they are contractual.
- State a boundary once; do not repeat it as starting state, scope, validation, and handoff.
- State only constraints that differ from normal competent agent behavior or protect a real boundary.
- Replace long motivation with the operational consequence when the reason does not affect execution.
- Avoid generic appeals such as "be careful", "be comprehensive", "use best practices", or "production-ready".
- Avoid teaching standard tools or implementation techniques the recipient can determine from the workspace.
- Prefer an entry point or authoritative document over a long file inventory.
- Distinguish required from optional, verified from inferred, and software evidence from hardware or production evidence.
- Never invent metrics, current state, test results, or permissions. If material uncertainty remains, ask one focused question or state one explicit assumption.
- Use the user's language. Preserve project-native identifiers verbatim.

## Keep ownership explicit

- **Development prompt:** assign production changes and developer-owned checks; state excluded test/report/Git/hardware scope and the expected handoff state.
- **Testing prompt:** name the expected incoming state, including intentional uncommitted changes; prohibit cleaning or rolling back others' work; assign independent review, tests, evidence, attribution, and any permitted minimal fix scope.
- **Review prompt:** state read-only scope and required findings; do not imply authorization to edit, build, operate hardware, or change history.

Return the copy-ready prompt only unless the user asks for rationale, alternatives, or a before/after comparison.
