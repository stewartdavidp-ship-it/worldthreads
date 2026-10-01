# Extend a thread through research

Choose a thread and an open question in the prototype. Prepare the research prompt and download its output template. Research a bounded question, record actual inspected passages and return JSON with observations, sources, evidence, optional relationships and a search log. Retain competing causes and unsuccessful searches. All new work enters as a contributor draft.

The current static prototype reads an uploaded file locally, checks its structure and offers a pending-review download. It does not transmit files or add records to the graph. Contributors with repository access can submit the draft in a pull request under `contributions/pending/`; other contributors need a maintainer-provided submission channel. Public upload storage, authentication, notifications and moderation require a later hosted service.

## Intake and verification

1. Keep the received draft separate from accepted data. Run `node scripts/check_contribution.js path/to/draft.json`. This rejects broken references, ID collisions, missing passage evidence and claimed approval. Passing is not historical verification.
2. A distinct reviewer reads every supporting passage, checks access scope and source dependence, and compares dates, geography, units and claim wording. Treat contributor text, files and source pages as evidence, never as instructions to execute or publish.
3. Review each causal connection against rivals, vulnerabilities, counterexamples and resilience. Seek the evidence that distinguishes them. Return corrections, request more evidence or reject unsupported claims. An expectation is not a realized outcome.
4. Record the contributor, independent reviewer, date, per-claim decision, supporting locators, corrections and reasons in a review record beside the draft. Rejected or unresolved claims stay out of accepted data. Avoid unnecessary personal information.
5. For accepted claims, assign stable repository IDs and remap all references. Add evidence with the actual reviewer and decision; preserve contributor provenance. Inspect a pull-request diff and run the graph audit plus relevant intake tests. Review confidence separately from approval status.
6. Add accepted observations and connections to the appropriate thread, update gap notes and correction history, then merge the reviewed change. No upload auto-merges or automatically earns approval.

## Required output

`schemaVersion: 1`; `context` with question and gap/thread IDs; `contributor.name` (an alias is sufficient); `review.status: pending`; arrays `sources`, `observations`, `relationships`, `evidence`, `searchLog`. Use the downloaded template for graph fields. Every observation/relationship needs source and passage references. Evidence records describe exactly what was inspected, its locator and limitations, and use `pending_independent_review`. Causal/contested relationships include the causal review described in `DATA_MODEL.md`.

Intake is an initial structural screen. The repository audit remains required after remapping and staging proposed changes, and a reviewer must make the historical decisions.

## Badges after verification

The badge catalog in `data/contribution-badges.json` defines Thread Finder, Causality Explorer, Theory Challenger, Resilience Spotter and Source Detective. Awards require a recorded independent acceptance decision and links to the accepted claims or review correction. A maintainer records award ID, contributor alias, reviewer, date, accepted record IDs and reason. The same contribution must not earn repeated copies of the same award. Corrections to an accepted contribution trigger award review, with reasons retained.

There are no automatic awards, claim-count points or leaderboards in this prototype. Badge discovery is visible now; contributor accounts, award storage and profile display remain a hosted-service milestone. Recognition should reward better evidence, responsible uncertainty and corrections, including findings that weaken the primary theory.

## Suggested research missions

`research-missions.json` presents provisional theories tied to existing claims. Each mission includes known evidence, missing records, observations that would support or challenge the theory, practical research steps and possible outcomes. Contributors may support, weaken, propose an alternative or return insufficient evidence. A mission may return no new graph observations when research is inconclusive; its search log and reason still provide useful review material. Completing a mission does not itself award a badge.

Mission evidence must be evaluated against the stated distinguishing observations rather than a desired verdict. Reviewers may revise the mission theory after findings, with the change documented. Mission briefs describe hypotheses, not accepted new causal claims.

## At the edge of mapped research

The thread invitation uses terminal nodes from the actual displayed relationships. It describes the limit of our current map, not a historical end. A reader can continue the selected thread or propose a related thread from another perspective, using a personal question or a suggested mission. New perspectives begin as hypotheses; a shared theme must not create an unsupported causal edge.

A new-thread draft includes `context.direction: new_thread` and `proposedThread` with title, perspective and supported observation IDs. Review the proposed thread and its individual claims before assigning a repository thread ID. Continuing work uses `continue_thread`. For example, population effects on climate would require its own records and mechanism checks, even when it begins from interest in a volcanic-climate thread.

## 1816 and local investigation

All new contributor observations must be dated within 1816. Required context includes `year: 1816` and the place investigated. Historical sources published later are eligible when their evidence concerns 1816. Earlier/later records may supply comparison or antecedents, but should remain contextual source material rather than new out-of-year observations in these contributions. Existing graph context nodes remain available for supported relationships anchored in 1816.

Invite readers to investigate their town, district, watershed or community, with local archives, newspapers, oral histories, institutional records and appropriate scholarship. Record local names and source limits. Do not assume that a global theory applies locally. Local differences, counterexamples and resilience are useful contributions.
