---
name: write-agent-prompts
description: Draft, compress, review, or split copy-ready prompts for other AI agents while preserving decision-critical context and recipient autonomy. Use when delegating implementation, testing, review, research, documentation, handoff, or other project work; when an existing agent prompt is verbose; or when separate ownership would materially improve boundaries or evidence quality. Do not use for ordinary user-facing answers that are not delegation briefs.
---

# Write Agent Prompts

## Objective

Produce the smallest sufficient prompt that lets the recipient act correctly without hidden conversation context. Treat it as a delegation contract, not a tutorial. Transfer the required outcome, facts, constraints, accepted decisions, acceptance criteria, and handoff; preserve the recipient's freedom to choose the best implementation. Specify what must be true, not how to make it true, unless the method itself is contractual.

## Build the prompt

1. Inspect the available sources of truth first: user request, accepted decisions, repository instructions, task documents, worktree state, and relevant code or artifacts.
2. Preserve every fact whose omission could change execution, permissions, scope, acceptance, evidence claims, or handoff.
3. Separate frozen decisions from planner opinions. Freeze only choices required by the user, architecture, external contract, compatibility boundary, or an accepted decision. Do not convert an upstream implementation preference into a requirement.
4. Remove context the recipient can cheaply discover from named sources. Include exact paths, commands, APIs, literals, or implementation details only when they define a boundary, prevent ambiguity, or save material discovery.
5. Split prompts only when separate ownership materially improves permission boundaries, independence, or evidence quality. Give each agent only its outcome, scope, and minimum handoff contract.
6. Draft compactly. Every sentence should change a decision, action, check, or boundary.
7. Run a loss audit: could the recipient pursue the wrong outcome, violate a frozen decision, modify outside scope, overclaim evidence, miss acceptance, or leave an unusable handoff? Restore only what prevents a realistic failure. Stop compressing when every remaining sentence materially affects execution.

## Use the smallest useful shape

For a routine task, use one paragraph or a few bullets. For a bounded task, use only applicable fields:

```text
任务：<single observable outcome>
起点：<state or prerequisite the recipient cannot safely infer>
范围：<owned work and material exclusions>
约束：<contractual decisions or boundaries only>
验收：<observable checks and evidence>
交付：<artifacts and final handoff state>
```

Omit empty fields and merge adjacent fields when clearer. Do not add role-play, introductions, restatements, or instructions to confirm understanding.

## Preserve autonomy without losing control

- State outcomes, invariants, interfaces, compatibility constraints, and acceptance evidence precisely; leave ordinary implementation, tool, design, and workflow choices to the recipient.
- Preserve exact APIs, versions, error strings, paths, hashes, limits, and user-approved decisions when contractual.
- Include upstream ideas only when materially useful. Label non-contractual ideas as suggestions and omit them when they would merely anchor the recipient to the planner's approach.
- State each boundary once and only when it differs from normal competent behavior or protects a real constraint. Replace motivation with its operational consequence when the reason does not affect execution.
- Avoid generic instructions such as "be careful", "be comprehensive", "use best practices", or "production-ready". Do not teach standard techniques the recipient can discover from the workspace or apply from its own expertise.
- Prefer an entry point or authoritative source over a long inventory. Distinguish required from optional, verified from inferred, and software evidence from hardware or production evidence.
- Never invent metrics, state, results, or permissions. If material uncertainty cannot be resolved from available sources and would change execution, ask one focused question or state one explicit assumption.
- Use the user's language and preserve project-native identifiers verbatim.

## Keep ownership explicit

When permissions or evidence responsibilities differ, make ownership explicit. Development may own production changes and developer checks; independent testing may own review, tests, evidence, attribution, and only explicitly permitted fixes; read-only review must not imply authorization to edit or operate. Apply the same principle to research, documentation, and other delegated work without prescribing unnecessary method.

Return the copy-ready prompt only unless the user asks for rationale, alternatives, or a before/after comparison.
