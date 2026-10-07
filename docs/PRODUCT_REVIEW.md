# WorldThreads: product and test-plan review

7 October 2026. This is a preliminary comparison of official product material and the live WorldThreads opening screen, plus review of the existing coverage ledger. It is not a comparative user study, a full hands-on playthrough of the other products, or evidence that their patterns will improve WorldThreads. No production UI changes were made in this review.

## Confirmed product purpose

The user confirmed that WorldThreads is an education tool taking an entertainment approach. Factual historical information should drive curiosity first; game elements keep the investigation interactive. The product purpose is now settled for this plan. The audience and best opening still require testing.

Recommended initial audience: curious non-experts. Recommended first outcome: an explanation the learner can support and qualify, with a longer thesis as optional depth. These are design recommendations, not established audience findings.

The user's first reported reviewer question was: “is this for education or entertainment?” This is one qualitative signal of ambiguity, not a representative study. The site currently combines a question-led story shelf, expedition badges, a research library and academic thesis fields. Those elements can suggest different purposes.

Proposed promise to test: “Learn history by investigating it.”

Proposed opening instruction to test: “Follow your curiosity through real history. Explore the evidence, connect the clues, and build an explanation you can defend.”

Factuality is a content requirement, not a claim that every current source has been independently authenticated. Distinguish documented observations, source authors’ interpretations, causal hypotheses and unreviewed learner/AI proposals. Never invent historical dialogue, motives, events or missing evidence to make a puzzle solvable. An unresolved question is a legitimate outcome.

## What we have accomplished

The last broad confirmation passed 27 automated suites on 69f427d. The release preparation passed CI, PR #2 was merged, and the complete player journey passed against the published site. This supports a functioning route, not a learning-outcome claim.

- Three guided stories connect to 23 research threads and object-based entry points.
- Case tasks, expedition progression, repeat-safe rewards and returning-player state work in tested scopes.
- Players can build an evidence board, import unreviewed AI research, test a rival, revise, file and download a portfolio.
- Navigation, failed saves, competing drafts, unsupported progress and unreadable record collections have regression coverage and recovery paths.
- Dark/light and text size controls, feedback, keyboard completion, narrow reflow and Firefox/WebKit engine completion are checked within recorded scopes.
- A targeted independent-agent source audit narrowed the Brazil thesis, retained contested chronology and improved source-dependence reminders.

The existing core ledger has 41 cases: 20 Tested, 17 Partial, three Not tested and one Known limit. These are case statuses, not percentages of product quality or separate suite counts. Source authentication, human historical review, physical devices and screen-reader use remain incomplete.

## Where our method has been narrow

A scripted agent knows the destination and can supply well-formed research text. That makes it effective at finding loss, broken navigation and stale assessments. It cannot establish that a novice knows why to start, understands the evidence, chooses a useful research move or wants to return.

We repeatedly tested whether the intended route could be completed. The next question is whether someone forms and improves their own explanation while using it. More green functional suites cannot answer that question.

## Relevant comparisons

The documented features below are observations; the proposed WorldThreads benefits are design hypotheses.

| Reference | Documented pattern | Hypothesis for WorldThreads | Boundary |
|---|---|---|---|
| [Return of the Obra Dinn](https://obradinn.com/) | The official premise gives the player an insurance-investigator role and a concrete assessment to prepare. | State the learner’s role and outcome before presenting the tools. Let curiosity lead to a visible investigation. | Fictional deduction can have authored answers. Historical research must retain disputed or incomplete conclusions. This review inspected its official premise, not a full game session. |
| [Zooniverse workflow guidance](https://help.zooniverse.org/getting-started/example/) | Tasks have concise non-expert instructions, optional contextual help and linked subsequent steps. | Put the immediate evidence task in front; reveal method and provenance detail when needed. | Classification workflows are not open historical arguments. Small tasks still need to reconnect to the player's claim. |
| [Kumu focus](https://docs.kumu.io/guides/focus) | Focus temporarily hides unrelated parts of a map around selected elements/connections. | Keep the current question and immediate evidence neighborhood visible; let the graph unfold around decisions. | A connection map alone does not explain importance or establish causation. WorldThreads has already borrowed local-focus ideas; test their comprehension rather than merely adding more graph controls. |
| [Zotero related items](https://www.zotero.org/support/related) | Notes and sources can be explicitly related; following a relation opens the linked item. | Preserve a visible route from claim to interpretation to passage to source and back. | Reference organization can become another information collection. Every saved item needs an explained role in the current case. |

Supporting research-education guidance: the [Library of Congress primary-source analysis approach](https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/guides/) separates observing, reflecting and questioning. The official search preview supports that limited description; direct guide-page/PDF retrieval failed in this pass. Treat it as a framework lead, not a completed interface benchmark.

An attempted Zooniverse Ancient Lives example showed no available data and was not used as evidence of a successful current volunteer task. Product availability must be checked before assigning comparator tasks to participants.

## What makes the UI worth testing

1. **Purpose:** the player can state what kind of experience this is and what they are trying to accomplish.
2. **A compelling question:** a specific human uncertainty makes the evidence matter.
3. **Thinking before feedback:** the player makes an interpretation or chooses a source, then sees why that decision changes the case.
4. **A visible argument:** “My explanation / evidence that supports it / evidence that challenges it / what remains unknown.” The graph, journal and thesis should be views of that same investigation.
5. **Manageable detail:** show the current decision, relevant evidence and one useful next action; keep the rest available on demand.
6. **Meaningful progress:** progress marks an improved or qualified explanation. Opening a panel may record activity, but it cannot demonstrate learning.
7. **An honest endpoint:** a bounded, defensible case with an explicit gap can be a success. A filled thesis form is not proof of accuracy.

Live-opening hypothesis: the empty points/badge panel precedes the main question and may frame success as collection. Test a question-first variant against the current opening. This is a design suspicion, not an observed participant outcome.

The case-to-thesis transition also deserves its own test: eleven planning fields may feel like a new assignment instead of a continuation of the player's case. Compare it with a compact case brief that grows into methods, chapters and historiography only as the player opts into deeper research.

## Next passes in order

1. **Positioning:** the user has chosen education through curiosity and interactivity. Test whether the current opening and a one-sentence promise variant communicate that purpose. Ask what the site is for before explaining it; do not ask a leading education-versus-entertainment question.
2. **First useful inference:** use one Dutch-relief case. Observe the first five minutes without coaching. Identify when a source changes the player's explanation, not just when the first badge appears.
3. **Case-to-research transition:** ask for a short defended case, then offer deeper research. Observe whether the thesis is a natural continuation and whether AI helps inspect evidence rather than supply conclusions.
4. **Learning and trust:** present an unfamiliar source problem and a plausible unsupported AI return. Check observation versus inference, source dependence, calibration and willingness to keep a claim unresolved. Test that narrative engagement does not lead learners to treat invented or unreviewed material as historical fact.
5. **Delayed return:** after 48–72 hours, ask the player to recover their claim, its weakest link and their next research action.

Use four to six uncoached curious beginners for an initial diagnostic round and a separate experienced-history reviewer for argument/source assessment. Those numbers are a practical pilot size, not a statistical validation target. Include a mobile participant and a keyboard/screen-reader participant where available. The user's reviewer is useful early evidence, but does not count as a completed protocol.

If comparing current and proposed openings, use separate fresh participants or counterbalance order and report prior exposure. Reusing the same person after explaining the site does not give a clean first-impression result.

Record comprehension, reasoning, motivation and mechanics separately. Measure assistance, first useful inference, abandonment point, confidence before/after contrary evidence, and recovery of purpose. Targets such as a 20-second orientation check or five-minute first inference are working targets to revise after observation, not research-backed universal cutoffs.

Keep automated regressions as the reliability baseline. Run them after behavioral changes, rather than repeatedly rerunning the unchanged entire plan while human/product questions remain unanswered.


## Proposed post-thesis AI panel

The user proposed taking a completed thesis to their own AI assistant with a panel-review prompt. Treat this as a further investigation loop: export thesis and evidence packet → simulated panel critique → claim-linked objections → researcher response → source work and revision → another saved version. Initial case-building should remain approachable; panel review is an optional deeper step.

Proposed review roles: historical context, source audit, causal criticism, scope/perspectives, and argument clarity. A single assistant producing five roles is a simulated panel, not five independently recruited experts. Critique should name the challenged claim, the inspected passage or access limit, the objection, and a research action. Different reviewer views should remain visible.

The user confirmed critique without grading: challenge the facts and thesis, without ranking or comparison to other writers. The next outcome is a response record, not an AI approval badge. The researcher can accept a correction, investigate, retain with reasons, narrow or suspend. Any new source suggestion remains a lead until checked; review feedback should not enter the historical corpus as fact.

A reusable manual prompt is supplied in AI_PANEL_REVIEW_PROMPT.md and the delivered outputs. No integrated panel feature, automatic critique import or academic evaluation is implemented by this planning pass. First test the manual loop on a real exported document. Evaluate whether the critique is specific and useful and whether the revised thesis is better supported, rather than how many objections or favorable votes it produces.
