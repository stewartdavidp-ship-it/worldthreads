# Extend a thread through research

Choose a thread and an open question in the prototype. Prepare the research prompt and download its output template. Research a bounded question, record actual inspected passages and return JSON with observations, sources, evidence, optional relationships and a search log. Retain competing causes and unsuccessful searches. All new work enters as a contributor draft.

The live site accepts research directly through an account-free form. Paste or upload the prescribed JSON, inspect the proposed facts and connections, then submit for automatic review. A private receipt follows the research → source review → audit → fix → publication process. No human reviewer or GitHub account is required. See [the service protocol](COMMUNITY_SERVICE.md) for its checks and limits.

## Intake and verification

Structural checks reject broken references, ID collisions, missing quotations and claimed approval. The service then retrieves public source text and runs two isolated automated assessments, including competing explanations and target relevance. Source and model failures cannot become supported claims. Factual/civil corrections stay private; unresolved historical findings can publish as visibly provisional research leads. New facts, relationships, sources and branches are published through graph overlays with review history, preserving the original dataset.

## Required output

`schemaVersion: 1`; `context` with question and gap/thread IDs; `contributor.name` (an alias is sufficient); `review.status: pending`; arrays `sources`, `observations`, `relationships`, `evidence`, `searchLog`. Use the downloaded template for graph fields. Every observation/relationship needs source and passage references. Evidence records include a short exact `quote`, describe what was inspected, its locator and limitations, and use the legacy draft wire value `pending_independent_review`. This value prevents claimed approval at intake; the live service performs automatic review. Causal/contested relationships include the causal review described in `DATA_MODEL.md`.

Intake is an initial structural screen. Automated source checks and claim assessments determine publication status; “passed automated checks” is not a guarantee of historical truth.

## Recognition after automated checks

Thread Finder, Causality Explorer and Theory Challenger can receive contribution-level recognition with links to the affected records and an explicit automated-review basis. Provisional submissions receive no awards. Resilience Spotter and Source Detective still need specialized checks and are not automatically awarded in v0.4. Confidence never follows votes or contribution counts.

## Suggested research missions

`research-missions.json` presents provisional theories tied to existing claims. Each mission includes known evidence, missing records, observations that would support or challenge the theory, practical research steps and possible outcomes. Contributors may support, weaken, propose an alternative or return insufficient evidence. A mission may return no new graph observations when research is inconclusive; its search log and reason still provide useful review material. Completing a mission does not itself award a badge.

Mission evidence must be evaluated against the stated distinguishing observations rather than a desired verdict. Reviewers may revise the mission theory after findings, with the change documented. Mission briefs describe hypotheses, not accepted new causal claims.

## At the edge of mapped research

The thread invitation uses terminal nodes from the actual displayed relationships. It describes the limit of our current map, not a historical end. A reader can continue the selected thread or propose a related thread from another perspective, using a personal question or a suggested mission. New perspectives begin as hypotheses; a shared theme must not create an unsupported causal edge.

A new-thread draft includes `context.direction: new_thread` and `proposedThread` with title, perspective and supported observation IDs. Review the proposed thread and its individual claims before assigning a repository thread ID. Continuing work uses `continue_thread`. For example, population effects on climate would require its own records and mechanism checks, even when it begins from interest in a volcanic-climate thread.

## 1816 and local investigation

All new contributor observations must be dated within 1816. Required context includes `year: 1816` and the place investigated. Historical sources published later are eligible when their evidence concerns 1816. Earlier/later records may supply comparison or antecedents, but should remain contextual source material rather than new out-of-year observations in these contributions. Existing graph context nodes remain available for supported relationships anchored in 1816.

Invite readers to investigate their town, district, watershed or community, with local archives, newspapers, oral histories, institutional records and appropriate scholarship. Record local names and source limits. Do not assume that a global theory applies locally. Local differences, counterexamples and resilience are useful contributions.
