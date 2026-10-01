# WorldThreads Historical Knowledge Graph — Data Model v0.2

WorldThreads separates **what is observed** from **what is inferred**.

## Core layers

1. **Sources** — books, papers, archives, datasets, museums, primary documents.
2. **Observations** — smallest evidence-bearing historical records.
3. **Entities / Places** — people, polities, organizations, works, technologies and geography.
4. **Relationships** — evidence-supported links between nodes. Relationships have their own confidence and sources.
5. **Mechanisms** — reusable hypotheses about recurring historical processes.
6. **Threads** — curated traversals through observations/relationships that explain a historical process.
7. **Research gaps** — explicit unknowns so absence of data is never confused with absence of history.

## Observation

Required fields:
- `id`
- `title`
- `startDate`, `endDate`, `datePrecision`
- `continent`, `region`, `historicalEntity`, `place`
- `observation`
- `coverageType`: EVENT | CONDITION | TREND | TRANSITION | PERSON | OBJECT | WORK | STATISTIC
- `system`: EARTH | BIOSPHERE | PRODUCTION & RESOURCES | HUMAN SYSTEMS | POWER & CULTURE
- `topic`
- `analyticalRole[]`: STATE | PRESSURE | SHOCK | RESPONSE | OUTCOME | RESILIENCE | ADAPTATION
- `evidenceType[]`
- `confidence`
- `sourceRefs[]`
- `researchStatus`

Optional quantitative fields:
- `value`, `unit`, `baseline`, `anomaly`, `uncertainty`
- `latitude`, `longitude`

## Relationship

Relationships are claims, not facts.

Fields:
- `id`
- `subjectId`
- `predicate`
- `objectId`
- `causalStatus`: CAUSAL | CONTRIBUTORY | ASSOCIATED | CONTESTED
- `lag`
- `explanation`
- `confidence`
- `sourceRefs[]`
- `alternatives[]`

Predicates:
- CAUSED_BY
- CONTRIBUTED_TO
- EXACERBATED_BY
- ENABLED
- CONSTRAINED
- RESPONDED_TO
- ACCELERATED
- DISRUPTED
- COINCIDED_WITH
- CONTESTED_CONNECTION
- ADAPTATION_TO
- PRECEDED
- DOCUMENTED_BY

## Source

Fields:
- `id`
- `type`
- `authorOrOrg`
- `title`
- `year`
- `url`
- `quality`
- `topics[]`
- `notes`

## Thread

A thread is a reader-facing path through the graph, not a separate historical truth.

Fields:
- `id`
- `title`
- `subtitle`
- `description`
- `nodeIds[]`
- `relationshipIds[]`
- `mechanisms[]`
- `scope`
- `confidence`

## Mechanism

A mechanism is a historical hypothesis that can be compared across cases.

Example:

`environmental shock → production loss → scarcity → price pressure → social stress → response`

Mechanisms must track counterexamples and resilience factors. They are not deterministic laws.

## Context window

The prototype year is 1816, but the graph may include nodes from 1814–1818 whenever they are necessary to explain antecedents, lagged outcomes or persistence.

## Causal review

A relationship may carry `causalReview`: `primaryExplanation`, `assessment`,
`priorConditions`, `alternatives`, `counterevidence`, `distinguishingEvidence`,
`searchStatus` and `reviewStatus`. Alternatives are objects with stable IDs,
explanation, kind (rival explanation, cofactor or prior condition), assessment,
sourceRefs, locator/evidenceNote and distinguishingEvidence. Assessments are
supported, plausible, contested, contradicted or unresolved.

An alternative with no source is a research question, not an established fact.
Counterevidence must distinguish not searched, searched but not found and actual
contradictory observations. Source count alone does not establish independence.
Evidence records link to the specific observation or relationship they support.
