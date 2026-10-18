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


### Returning to a filed investigation (0.5.59)

The overview's review/research suggestion is derived from existing portfolio fingerprints, exact context and filed timestamp, saved critique, player response and chosen research concern. No new stored state is introduced. A critique is recommended as current only if its portfolio fingerprint equals the working draft fingerprint. Earlier valid reviews remain accessible with a changed-draft warning. An open concern is one without a completed player response or one deliberately left for investigation/suspended judgment; this is workflow status, not truth or source verification. Updating a response or selecting a research concern refreshes the overview. Completed filing refreshes it as well, preventing another generic filing prompt for an unchanged filed draft.

The optional next-question preview and review action carry the same concern ID. Viewing the suggestion does not change a saved cursor; deliberately resuming it uses the existing review-position save. Generic review-resume controls continue to honor their saved position.


### Dutch relief tracing (0.5.61)

The selected relief-trace checkpoint is session-only presentation state. The activity uses WT-1816-0034 and WT-1816-0035 as distinct documentary tracks, with a source-search question rather than a fabricated receipt record. It asserts neither common shipment identity nor verified recipients. It adds no observation, relation, mechanism, reward or storage schema. Its research action invokes the existing thread-draft handoff and research focus. Existing drafts, notes and source-role decisions use their original saving/recovery/version rules; no extra story notebook is created.


### Andes pair exploration (0.5.61)

Pair selection and reveal state are session-only. The activity reads existing records WT-1816-0060/0030/0031 and their direct relationships REL-0046/0023. A missing direct relationship is not a claim of no historical influence, and a transitive graph path is not promoted to a new causal assertion. Inspecting the activity assigns no evidence role or reward. A deliberate thesis handoff may prioritize the chosen pair among the new draft’s initial records; IDs must belong to that thread. Existing or archived draft selections/writing are preserved. No new storage field or historical graph data is added.


### Andean dispatch reading (0.5.62)

WT-1816-0030 retains its identity/date range while adding a source-specific contemporary plan in later transmission (SRC-053) alongside the institutional sequence. These are separate support roles, not independently authenticated corroboration. Source metadata distinguishes the 1817 report date from the 1963 edition. No plan is promoted to a completed delivery, new causal edge or quantitative time series. Object source unions and REL-0046’s existing claim projection are synchronized; older filed snapshots are not rewritten.

The two-clock diagram and chosen reading/reveal are session-only presentation state. They change no thesis, role, graph, point or schema. Moving to research after the case uses the existing draft/archive safeguards and may seed the crossing record only into a fresh draft. The visual does not simulate travel, infer route coordinates or count a correct reading as historical verification. Normal story continuation remains available without doing this optional reading exercise.

A dispatch research action can supply an editorial question/source lead only when the target draft is genuinely empty, before default case planning is filled. A saved or archived draft is preserved even if its savedAt field is absent. Existing research questions, source plans and notes are not overwritten; an ephemeral dispatch-lead card provides comparison on that explicit route. No claim, evidence role or verified event is seeded.


### Reported package quantities and transmission (0.5.63)

Optional observation reportedQuantities is a list of item/value/unit entries for separately stated counts. Values must be nonnegative numbers and item/unit labels nonempty. These are reported counts, not normalized weights or independent verification. WT-1816-0082 keeps líos of charque and fardos of biscuit separate; no arithmetic total, mass or ration denominator is generated. Source-specific limits and both counts travel into AI context and exports.

The later report has its own observation, author/event/location objects and an ASSOCIATED context relation to the overlapping crossing window. It does not validate a past ration issue or increase MECH-007 confidence. Discovery/quantity-detail state is session-only, and the native document fold changes no assertion or reward. Only an explicit research handoff can seed the found report into an empty draft’s initial records; existing drafts/portfolios remain untouched.

Source provenance reminders group normalized source/edition URLs, naming every referenced document title in a group. A shared URL can contain different documents; it is a cue to investigate identity/transmission, not a verdict that the claims are the same or independently corroborated.

MECH-007 research design (0.5.64): nonempty inputs/processes/outcomes describe conditional hypotheses and explicitly missing intermediates; they do not add observation-level support or change status. Optional `researchTests` is a set of question/source-search designs with stable local IDs, existing observationIds, a discriminating-evidence description and a limit. `knownLabel`, `knownStatus`, `missingLabel` and `icon` render the question graphic. Observation references identify the starting records, not independent verification of the hypothesis. The validator checks required text, unique design IDs, allowed icons and membership in a prototype thread. No new historical relationships/object projections, source identities, player storage keys or reward rules are introduced. The chosen design is session-only. Only an explicit handoff may seed an otherwise empty research draft through the existing infrastructure; a saved plan is retained and a comparison lead displayed separately.

0.5.65 reported comparison: WT-1816-0083 stores 130 reported sent and 124 reported received as separately labelled mule counts, preserving their single-reporter provenance. The six-mule difference is a UI calculation/comparison only, not an observation of losses or a saved death/attrition rate. A later report from the same commander is another reported act, not independent corroboration. Exact report dates do not date the receipt itself. Its overlapping-context relationship retains ASSOCIATED and an exact object projection. The session-only comparison interpretation never edits the graph, rewards or thesis. Only explicit research handoff may seed the shared empty draft; saved writing/plans retain their existing values and receive a separate comparison lead. Page images are attributed later printed evidence, not authenticated autographs.

0.5.66 alternate source access: SRC-022 keeps its DOI and stable identity, adding the existing `alternateUrl` field for the university repository’s copy. The source inspector already renders this field. New AI briefs and current thesis bibliographies now retain it, labelled as the same publication; it does not create another source or independent corroboration. Validator requires an HTTPS alternate when supplied. Four Dutch observation sourceSupport/locator/uncertainty fields gain precise scope without changing dates, quantities or confidence. Two response explanations and their object projections are synchronized; stored portfolio records/references stay version-specific.

0.5.67 source trails: GAP-013 has optional sourceRefs and sourceTrail entries containing stable local IDs, STUDY/CATALOG/MISSING kind, access-status wording, exact locator, scope/limit, a research question, source-search plan and existing recordIds. Non-missing entries reference a gap source; a missing entry has null sourceId rather than an invented document URL. Validation checks required text, unique IDs, kinds, source registration and record membership. A finding aid may be registered for retrieval while remaining absent from observation sourceRefs; it supplies no independent historical claim. The generic gap view exposes its source/retrieval links, and the Dutch post-case UI reads the structured trail. Four existing Dutch records gain GAP-013 references; source/observation identities and object projections remain intact. Source-role cards use a distinct class so opening retrieval metadata cannot trigger the inspector’s source-progress listener. Choice/open state is session-only; saved writing, portfolios and reward/storage schemas remain unchanged.
