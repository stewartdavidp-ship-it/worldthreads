# WorldThreads Historical Knowledge Graph — Data Model v0.5

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

## Explorer contract (v0.3)

`mechanismIds[]` on each thread references the mechanism registry. Legacy `mechanisms[]` tags remain descriptive. Draw relationships from `subjectId` to `objectId`, never from neighboring positions in `nodeIds`: threads may branch and response predicates may point backward in time. `RESPONDED_TO` reads response → pressure; `PRECEDED` establishes chronology only.

Observations may include `sourceLocator` and `uncertainty`. `contextNode` identifies antecedent/outcome records outside the prototype year, not a separate evidence class. Approximate source dates must retain their actual precision; a publication date must not be mistaken for the date of an observation. Source `year: null` means publication year unknown.

Mechanism registries include `counterexamples[]`. Empty arrays mean counterexamples have not been documented, not that none exist. A thread may illustrate only part of a mechanism; say which steps lack evidence. Thread confidence is a curated assessment, not a computed probability.

## Research gap provenance (v0.4)

Each gap can include `observationIds[]`, `threadIds[]`, `remainingQuestions[]` and `updatedDate`. Partial progress must name the linked evidence and retain unresolved questions. Observation `gapRefs[]` links back to research questions. A new observation does not automatically close a broad gap.

`counterexampleObservationIds[]` on mechanisms references inspectable observations; `counterexamples[]` retains explanations. Counterexamples qualify deterministic/general claims and do not themselves establish a different cause.

`DOCUMENT_DATE` means the dated report/letter is known; its described event can precede that date. `dateBasis` states this distinction. `SEASON_RANGE` preserves reconstructed seasonal support. `extendedContextReason` explains why a multi-year record extends beyond 1814–1818. Region value `Oceans` is not counted as an additional continent.

Evidence type filters use the original evidence labels. Search, region, time-window and system filters combine. The 1816 filter includes any record whose date support overlaps 1816, including multi-year reconstructions; it does not turn them into annual measurements. Source `alternateUrl` may point to a university-hosted copy when publisher or archive delivery is limited.

## Historical objects (v0.5)

An object identifies a person, movement, polity, institution, place, natural feature, environmental episode, biological system, technology, work, event, policy, process or condition. These are stable things studied across observations, not evidence-bearing claims in themselves. `data/object-types.json` records allowed types/subtypes, including future categories such as earthquakes, wars, strikes and protests without inventing instances.

`data/objects.json` contains `id`, `type`, `subtype`, `label`, `description`, `observationIds[]`, `sourceRefs[]`, `focusDates`, `regions[]`, `researchStatus` and `identityNote`. A focus window is the span of linked evidence; it is not a person’s lifetime or the complete duration of a work or institution. The seed represents existing corpus evidence rather than comprehensive biographies or ranked influence. Composite legacy polity strings are retained on observations instead of being guessed into individual identities.

Each observation now has `primaryObjectId` and `objectRefs[]`. Object/observation membership is reciprocal. Sources on objects are the union of their linked observation sources. Person identities span their different actions; Mount Tambora and its eruption are distinct objects.

`data/1816/object-relationships.json` contains actual object endpoints, predicate, `relationshipKind`, causal status, confidence, explanation, source references, `evidenceObservationRefs[]` and `evidenceRelationshipRefs[]`. `HISTORICAL_CLAIM` edges project an existing observation relationship onto its primary objects while preserving its direction, wording, confidence, status and sources exactly. `PARTICIPATION` edges document attributed roles such as ordering or reporting. `CONTEXT` edges record location, identity or political context. Participation/context use ASSOCIATED and do not measure causal impact. Original observation relationships and threads remain intact.

A person’s role in an action does not establish the person’s motives. Connections affecting their work or actions are shown as indirect context, not silently promoted into personal influence claims. Missing incoming or outgoing influence links remain explicit gaps.

## Local research additions

Imported proposal JSON requires a claim, http(s) source URL, locator, date/place and limits. Local additions retain proposal kind, thread context, import time and Unreviewed status. They are stored separately in the browser and are not accepted observations, projected object links or changes to the registered graph. They can be selected in a thesis evidence table as explicitly labeled candidate evidence. A repeated import of the same claim/source/locator is not additional evidence.

### Source-specific support within an observation

An optional `sourceSupport` array records `sourceId`, `label`, `supports` and `limits` for each source reference. It distinguishes what different sources contribute without combining their roles into a single verification claim. Validation requires one entry per referenced source when present. Source cards, research briefs and new thesis exports expose these boundaries; it is not a source-authenticity score. WT-1816-0015 is the first audited example.


### Editorial starting questions (0.5.55)

`question-start.js` supplies optional thread-specific investigation prompts, separate from observations, relationships and mechanisms. Choosing a prompt deliberately copies its question into the player's editable draft; it supplies no answer or evidence role and earns no reward. Opening a record does not adopt a question. Existing questions and immutable portfolios are not migrated or rewritten; an existing question can be compared with a suggestion, then edited manually. New library/object investigations begin with an empty player question; completed guided cases retain their selected question, and explicit story handoffs preserve the player's writing.


### Visual evidence boundaries (0.5.57)

The first-story timeline's Record/Proposed link/Open question controls are session-only presentation state. They read existing records, REL-0007 and the audited unresolved scope; they do not generate observations, accepted links, source verification, player answers or rewards. The questioned/dashed bridge depicts an interpretation to test, not an estimated effect or probability. Selecting a hypothesis can highlight timeline connectors but keeps them dashed. Gap guidance can focus the existing reasoning field; only the player's writing changes the saved draft. Source/connection inspection retains its existing optional activity rules.


### Advisory review basis (0.5.58)

New panel prompts request schemaVersion 2. The schema adds `internal document support` to the existing finding bases. This means support within the supplied writing, not authentication of a historical source. Schema 2 inspected-passage findings require a matching `sourceChecks.url` whose status is `opened` and whose locator is nonempty. This is internal report consistency only; reported opening or inspection remains unauthenticated. Schema 1 remains accepted with its original validation and stored contents. No migration rewrites earlier reports. Human-facing basis disclosures derive from the finding and assistant-reported access, with a warning for an older unmatched passage claim. They never become evidence, a grading signal or a reward.
