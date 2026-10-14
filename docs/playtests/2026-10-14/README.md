# Three-perspective live playtest — 14 October 2026

Baseline: live v0.5.51, commit be62b18. Three independent agents used separate fresh Chromium contexts; newcomer also inspected Chrome read-only. No shared drafts or registered historical data changed. Agents did not inspect implementation/tests to learn the route. These are simulated perspectives, not human participants, measured retention or scholarly review.

| Perspective | Ease /5 | Interest /5 | Likely return /5 | Completed scope |
|---|---:|---:|---:|---|
| Curious newcomer | 3 | 4 | 2 | First story, prediction/reveal/revision, story reward, thesis handoff, research/rival workspace inspection |
| Student writing a thesis | 3 | 4 | 3 | First story, own bounded claim/question, thesis handoff and evidence-board entry |
| Skeptical researcher | 3 | 4 | 3 | Mary Godwin → Frankenstein → thread → own thesis → rival predictions/source plan |

## Shared finding

All three found an intriguing evidence question but lost momentum at the transition to a generic thesis workspace. Many similar disclosure sections obscure the next meaningful action. The largest opportunity is to retain the player's question and graphical claim/evidence/gap trail, with one concrete next task and the full workspace available on demand. More decorative animation is not the first priority.

The prediction-before-reveal sequence and honest unlike-unit charts were the strongest newcomer/student moments. The researcher valued person/object entry, explicit gaps and source-versus-causal distinctions.

## Prioritized next pass

1. Correct the revisited story map: completed scenes4–6 are labelled Not reached when returning to scene3, while the header correctly says6/6 scenes. Reproduced by student; code inspection confirms map uses current step rather than visited progress. Functional user impact: previously reached stops are disabled. Needs fix and regression, not marked resolved.
2. Keep a compact visual investigation around the own question at thesis entry; make one next action prominent and show the growing document/result. Validate on first-story and object-entry paths.
3. Rename/direct the source milestone: record/source-limit inspection is not the nested registered-source expansion that earns progress. Newcomer established the latter works; this is discoverability, not a proven scoring defect.
4. Make the scene3 evidence-connection task's role clear before the ending routes players back; distinguish examining a registered connection from writing one's interpretation.
5. Focus thread navigation rather than showing all81 library records around the chosen question. Replace game-only language on direct research entry and first-test machine-state wording.
6. Audit the Frankenstein conception/manuscript record's source-specific uncertainty; current generic missing-note warning does not tell a researcher which source supports which part. No new scholarly verification was performed here.

## Functional control and limits

Independent scripted live control: winning-game.cjs passed fresh player →3cases→2challenges→all10badges/890points→fixture AI return→rival→revision→evidence reassessment→portfolio/export→duplicate/change guards→reload/mobile. This uses implementation-aware instructions and labelled synthetic AI returns. It establishes functional completion within that route, not discoverability, learning or authentic AI review.

The independent persona runs were stopped at84% account usage to respect the user's90% ceiling. None completed research-return→rival-decision→portfolio unassisted; researcher did not test delayed return or optional custom comparison. Do not mark these as persona E2E passes. Next run should start from saved/recorded checkpoints and cover those missing segments before broadening features. No UI fixes were published during this baseline pass.

Reports: [newcomer](newcomer.md), [student](student.md), [researcher](researcher.md).

## Follow-up on local 0.5.52

The [returning student](student-retest.md) completed research planning, a labelled interface-fixture return, a pending rival decision, evidence roles with honest original-source access limits, planning, local portfolio filing and export. Overview ease4/5 and return4/5 are repeat-agent judgments; advanced workspace ease3/5 prompted a further focused-activity view that hides unrelated tools while retaining an explicit full-workspace option. This refinement has regression and Chrome inspection, not a second complete student run.

The [returning researcher](researcher-retest.md) reported improved overview clarity and first-test language within a short pass; source return and completion were not successfully tested there. The [newcomer retest](newcomer-retest.md) failed during test setup and provides no updated score. Do not combine these with the baseline into a claim of three successful post-change E2E completions.
