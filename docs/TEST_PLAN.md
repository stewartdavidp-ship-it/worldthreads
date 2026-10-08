# WorldThreads test plan and coverage ledger

Updated: 8 October 2026. Latest targeted agent-perspective pass is recorded below. Earlier broad confirmation candidate: `69f427d` (27/27 expanded checks passed; earlier confirmations retained below) (first fix baseline: `3ba2895`) (earlier coverage baseline: `5da62dc`). Scope: single-player, browser-local prototype.

## What success means

A player can find a question worth investigating, distinguish evidence from inference, test a rival explanation, revise a claim, and file an honest, recoverable thesis portfolio. Rewards should make that work legible. Completing activities is not proof that the thesis is true.

A release needs separate evidence for functional correctness, historical reliability, and learning/usability. Passing one does not pass the others.

## Status rules

- **Tested:** a recorded check observed the specified behavior. The scope and evidence below delimit the claim.
- **Partial:** some behavior was checked; an important part remains untested.
- **Not tested:** no recorded execution supports a pass.
- **Known limit:** a capability the prototype does not supply; explain it rather than count it as a pass.

These are coverage statuses, not a claim that every suite was rerun today. Earlier runs are retained as historical evidence. Before a release, rerun all suites against the candidate commit and record results. A fix stays open until its regression check passes.

## Existing evidence inventory

| Check | Recorded scope | Baseline evidence |
|---|---|---|
| Data validator | IDs, dates, references, reciprocal object membership, exact projection of relationship claims | Previous passing runs; does not authenticate sources |
| explorer.cjs | Three story entries, all 23 thread relationship endpoints, filters, evidence dialogs, navigation, narrow viewport | Previous passing run; rerun for release |
| progress.cjs | Story gates, repeat-safe rewards, three case files, two challenges, resume, corrupted progress JSON | Previous passing run; rerun for release |
| objects.cjs | Person/place/hazard/invention entry, role versus change distinctions, object research, narrow viewport | Passed in the latest development pass |
| research-flow.cjs | Dutch game-to-thesis route, research gap, local candidate import, export, context resume | Passed in the latest development pass |
| argument-board.cjs | Evidence roles, explanations, citation notes, missing slot, changed record, resume | Previous passing run; rerun for release |
| examiner.cjs | Rival predictions, discriminator, retain/narrow/suspend, pending evidence, stale argument prevention | Passed in the latest development pass |
| ai-research.cjs | Brief reflects the question, rejects prose, accepts structured local candidate, deduplicates | Passed in the latest development pass; independent agent brief-and-return checked in Chrome, with manual source review |
| winning-game.cjs | Fresh full route, ten badges, 890 points for this route, research, revision, filing, exports | Passed in the latest development pass; points vary with optional activities |
| returning-player.cjs | Stale record assessment, changed evidence, second filing, immutable earlier download, shared candidate, empty slots, reload | Passed at baseline 5da62dc |
| Live Chrome walkthroughs | Fresh completion and returning-player version comparison | Agent walkthroughs with screenshots; not a human usability study |
| Research audit | Targeted source and causal corrections, regional and access limits | See RESEARCH_AUDIT.md; not a complete independent verification of the corpus |

The original nine browser suites use Chromium; follow-up suites add durability, interruption, adversarial research, accessibility, concurrent progress and route restoration. Narrow-viewport assertions check overflow; they do not establish touch usability, accessibility, or cross-browser compatibility.

## Coverage ledger

Stable IDs let future passes update the same case rather than accumulate disconnected reports. P0 = data integrity or blocked core journey; P1 = argument/evidence integrity or major usability; P2 = broader compatibility and polish.

| ID | Perspective / test | Status | Observable pass condition / remaining gap | Evidence |
|---|---|---|---|---|
| G01 | New player chooses a story | Partial | Understands the question and next action without coaching; visible entry paths already work | Explorer + Chrome; human comprehension untested |
| G02 | Earn all expedition cases and challenges | Tested | Required clues and interpretations gate advancement; fresh completion and repeat attempts behave correctly | Progress + winning |
| G03 | Reward farmer repeats actions | Tested | Reopening evidence, repeating answers and refiling do not award duplicate points | Progress + winning + returning |
| G04 | Player treats badges as truth certificates | Not tested | Player can explain that awards recognize activities, not source authenticity or thesis truth | Human interview required |
| G05 | Player takes a dead end | Partial | Can turn missing evidence into a source-specific research task without inventing closure | Research-flow; uncoached discovery untested |
| G06 | Player skips the game | Tested | Can begin a thread or object investigation without unrelated badges | Objects + board |
| E01 | Familiar person or invention entry | Tested | Incoming influence/context and outgoing claims are distinguishable; missing links can start research | Objects |
| E02 | Explore all registered threads | Tested | Rendered claim endpoints agree with registered data | Explorer; historical accuracy is separate |
| E03 | Detour and return | Tested | Evidence navigation and context switches preserve relevant drafts and deliberate empty slots | Explorer + returning |
| E04 | Empty search or sparse object | Tested | Shows absence honestly and permits a research question | Explorer + objects |
| T01 | Build a structured thesis | Tested | Required planning fields, evidence roles, explanations and locators persist and export | Research-flow + board |
| T02 | Counterargument actually changes the thesis | Partial | Recorded rival test can retain, narrow or suspend; scholarly strength requires independent review | Examiner + winning |
| T03 | Change argument, evidence or test record | Tested | Old role assignments/assessment cannot silently qualify the changed investigation | Examiner + returning |
| T04 | File, revise and compare versions | Tested | Earlier snapshot remains immutable, selected download matches it, comparison explains changes | Winning + returning |
| T05 | Superficial text satisfies the gate | Known limit | Structural completion is explicitly distinguished from academic quality; no semantic grading exists | Filing checks inspect completeness |
| T06 | Contradictory evidence and pending research | Partial | Pending result does not fabricate a conclusion; conflicting-source reasoning still needs human assessment | Examiner; independent agent source audit; human review pending |
| A01 | Ask an AI assistant for research | Partial | Brief contains scope, model, evidence and return schema; independent agent returned a candidate from the exact Chrome brief; manual source review narrowed it before Chrome import | AI-research |
| A02 | Import candidate and use it | Tested | Candidate remains local/unreviewed, selectable and exportable; registered graph unchanged | Research-flow + winning |
| A03 | Duplicate candidate in another context | Tested | Reuses one finding with context links; does not count as independent corroboration | Returning |
| A04 | Malformed prose, missing locator, unsafe URL scheme | Tested | Tested bad inputs reject without changing the corpus | AI + research-flow + winning; limited adversarial set |
| A05 | Plausible invented citation or irrelevant source | Tested | Synthetic fabricated source remains unreviewed; exclusion reason is retained, unusable selection blocks preparation, and restoration stays unreviewed | adversarial-research.cjs; no automatic source authentication |
| A06 | Huge files, HTML, Unicode, null/array shapes | Tested | Null/array/scalar JSON, oversized fields/files and credential URLs reject; HTML is inert and multilingual text survives | adversarial-research.cjs; bounded adversarial fixtures |
| D01 | Graph consistency | Tested | All registered references and projected claim directions validate | Python validator |
| D02 | Source passage supports observation | Partial | Audit records exact passage, date/place scope, source dependence and access limits | Targeted research audit; corpus-wide review incomplete |
| D03 | Relationship warrants causal language | Partial | Context/role does not become cause; alternative mechanisms and uncertainty retained | Data/UI distinctions + targeted audit; full independent review incomplete |
| D04 | Coverage represents affected populations | Partial | Coverage gaps are explicit; add regional/local perspectives with provenance | Africa, Indigenous views, household relief and other gaps remain |
| D05 | Completed thesis withstands scholarly critique | Partial | Independent agent source/reasoning critique completed; primary-record research and human historian assessment remain pending | BRAZIL_THESIS_REVIEW.md; THESIS_SOURCE_AUDIT.md |
| R01 | Reload and ordinary autosave | Tested | Draft, decisions, rewards and portfolios survive expected reload/context transitions | Research-flow + returning + winning |
| R02 | Storage unavailable or full | Tested | Injected quota/denied writes block stale filing; current session work exports and save recovery succeeds | durability.cjs |
| R03 | Two tabs edit the same investigation | Partial | Competing tabs require explicit choice; keeping a local draft preserves another investigation in its archive. Backup failure blocks replacement; latest-version recovery and unseen-write filing are checked. A complete multi-tab race matrix remains open | durability.cjs; concurrent-drafts.cjs; concurrent-progress.cjs |
| R04 | Corrupted stored records / old schema | Partial | Malformed draft shapes recover. Unsupported progress stays untouched. Unreadable research/portfolio originals are copied before replacement, with exact downloads and blocked writes on backup failure. Draft/archive migrations and deeper shape coverage remain incomplete | durability; schema-recovery; list-recovery |
| R05 | Data fetch failure or offline startup | Tested | Failed HTTP or network collection loads show retry; existing saved research survives and editing after load works offline | interruption.cjs; offline first-load HTML/assets not covered |
| R06 | Browser back, refresh and detour mid-task | Partial | Browser Back/Forward returns to the thesis stage; evidence detours and reload preserve drafts. Object modal Back/Forward and filtered library → thesis stage navigation pass; the evidence-close/next-scene race is fixed and regression-tested; broader route combinations remain open | interruption + returning + navigation-race |
| U01 | Narrow screen | Partial | Touch emulation and 390/320px reflow pass; physical-device use remains untested | accessibility.cjs + existing suites |
| U02 | Keyboard-only full winning route | Partial | Full winning route passes with keyboard activation/text entry; shelf Tab access and dialog cycling pass. Actual Tab traversal now completes the route; human discoverability remains open | winning-game keyboard mode + accessibility |
| U03 | Screen reader, zoom and contrast | Partial | Visible form labeling, modal focus cycling, Escape and global focus styles checked; 13 sampled screens passed automated semantic/contrast checks after a contrast fix; real screen-reader checks remain open; actual Chrome 200% zoom passed on the story, source dialog, five thesis stages and feedback form | accessibility.cjs; no accessibility certification |
| U04 | Safari, Firefox and private browsing | Partial | Complete route has passed in Firefox and WebKit engines; branded Safari/private-mode settings require separate checks | winning-game engine runs; final reconfirmation recorded below |
| U05 | Long text and non-English research notes | Tested | Long multilingual title/notes reflow at narrow widths and retain exact characters/newlines in export | accessibility.cjs |
| H01 | Uncoached beginner | Not tested | Can explain their question, evidence limit and next research move; record confusion and assistance | Real participant needed |
| H02 | Skeptical advanced historian | Not tested | Can distinguish author interpretation from graph claims and critique a filed thesis | Independent reviewer needed |
| H03 | Returning player after several days | Partial | Saved state works; player can recover purpose and next action without rereading everything | Returning automation; delayed human recall untested |

## Next product-validation pass — 7 October 2026

The reliability baseline is established within its tested scopes. The next priority is product purpose, uncoached comprehension, reasoning and motivation. See PRODUCT_REVIEW.md for a bounded comparison of official product patterns and the proposed hypotheses. No production UI change or human-study completion is implied by this review.

One reviewer reportedly asked whether the site was for education or entertainment. Log this as an early positioning signal, not a representative study or a completed H01 session. The user confirmed the purpose: an education tool that uses an entertainment approach; factual history should drive curiosity first and game elements keep investigation interactive. Test whether the interface communicates this settled purpose. A short explanation supported by evidence, with thesis research as optional depth, is the proposed first outcome.

| ID | New perspective | Status | Observable condition / proposed test | Evidence |
|---|---|---|---|---|
| P01 | Purpose and player role | Partial | After a brief uncoached look, describes learning through curiosity and evidence-based investigation; current versus purpose/promise variant | One user-reported ambiguous first impression; structured test pending |
| P02 | Hook and first useful inference | Not tested | Chooses a question, interprets evidence and explains one resulting change; record time and assistance rather than counting clicks | Beginner pilot needed |
| P03 | Choice has an evidential consequence | Not tested | Explains why one next source or comparison could distinguish rivals; another choice changes the investigation meaningfully | Task-choice prototype and observation needed |
| P04 | Reasoning transfers to unfamiliar evidence | Not tested | On a new source pair, separates observation, interpretation and unsupported causal claim without reusing the game's answer | Independent transfer task needed |
| P05 | Progress means improvement | Not tested | Explains how the argument or uncertainty changed and what remains; rewards do not substitute for that explanation | Human explanation and artifact comparison needed |
| P06 | Case grows into thesis | Not tested | Short case brief naturally develops into deeper research; record intimidation, abandonment and unnecessary fields at transition | Compare current thesis entry with scaffolded-case concept |
| P07 | Trust remains calibrated | Not tested | Distinguishes badges, format acceptance, local candidates and authenticated evidence; retains honest uncertainty after an inaccessible/contradictory source | Human adversarial research task; complements G04/A05/T06 |
| P08 | Return restores purpose | Not tested | After 48–72 hours, identifies claim, weakest link and next useful research move without coaching | Delayed human test; complements H03 |
| P09 | Factuality survives engaging narration | Not tested | Distinguishes source-grounded content, interpretations, hypotheses and unreviewed proposals; missing evidence stays open rather than becoming invented history | Human source/narrative review; complements D02/D03/A05 |
| P10 | Thesis → AI panel → stronger next version | Copy/return/presentation flow tested; external review quality and human revision pending | Exports thesis/evidence packet with prompt; critique links objections to claims and inspected passages/access limits; names supported strengths and unsupported steps; gives research hints without supplying the thesis, causal answer or finished rival; researcher records responses and makes a traceable revision without promoting AI feedback into fact | panel-review.cjs; Chrome local playthrough; AI_PANEL_REVIEW_PROMPT.md; real external assistant/human pilot remains pending |

Order: P01 → P02/P03 → P06 → P04/P05/P07/P09 → optional P10 → P08. Run a small diagnostic pilot before a broad interface redesign or corpus expansion. Four to six beginners plus a separate advanced reviewer is a practical first round, not proof of population-level outcomes. Compare variants with fresh participants or counterbalanced order; record prior exposure and assistance. Human learning, motivation, source judgment and technical completion stay separate outcomes. Working timings are hypotheses, not validated thresholds. The optional post-thesis panel is a simulated advisory review of factual claims and reasoning, without grading, ranking or comparison to other writers. Test the manual export/prompt/revision loop before building import or scoring features. It does not certify academic quality. None of the new cases is passed yet.

Retain the existing 41-case ledger and 27-suite confirmation as the functional/source-coverage baseline. The new product cases add questions that scripted completion cannot answer. Continue known integrity fixes when reproduced; otherwise prioritize human/product evidence over unchanged-suite repetition.

## Original ordered passes (completed within the recorded automated scopes)

1. **Durability:** R02, R03, R04. Inject write failures, quota exhaustion, malformed stored drafts and conflicting tabs. Try filing immediately after a failed save. Verify downloaded data against the visible current draft.
2. **Interrupted investigation:** R05, R06. Fail one data fetch, lose network, refresh mid-stage, return from evidence and restart. Preserve a truthful recovery path.
3. **Adversarial researcher:** A05, A06, T06. Use synthetic fabricated citations, irrelevant but valid sources, recycled claims, contradictions and oversized/malformed returns. Check that acceptance never implies verification.
4. **Different ability and device:** U01–U05. Complete a keyboard-only journey, then reader/zoom and real touch checks; follow with Safari and Firefox.
5. **Research examiner:** D02, D03, D05. Review one complete thesis claim by claim, including exact source passages and rival predictions. Log unresolved access rather than assume agreement.
6. **Human first impression:** H01–H03, G01, G04, G05. Observe an uncoached beginner and an experienced researcher. Ask what they are trying to prove, what could change their mind, and what the next action earns. Separate interface help from research help.

## Execution and recording

For each pass, record: case ID; date; commit; browser/device; starting state; exact action; expected behavior; observed behavior; artifact or assertion; issue/fix; rerun result. Use clean profiles for new players and deliberately preserved profiles for returning players. Synthetic sources must be labeled as test fixtures and must never enter the registered corpus.

A failure record should describe the player's consequence, not just an exception. Example: “A failed save followed by filing exported the previous argument while showing the current one.” Link the regression test and mark the case tested only after it passes.

### Run log

| Date | Commit | Cases | Execution / outcome | Next action |
|---|---|---|---|---|
| 2026-10-05–06 | Through 5da62dc | Existing suite scopes above | Prior automated and Chrome passes; boundaries reconstructed from suites and recorded development results | Establish explicit coverage ledger |
| 2026-10-06 | 5da62dc + plan | D01 | Data validator rerun: PASS (78 observations, 55 relationships, 173 objects, 197 links) | Historical accuracy remains separately partial |
| 2026-10-06 | 5da62dc + plan | All ledger IDs | Planning review completed; unexecuted cases remain marked untested | Begin durability pass R02/R03, then interrupted journey |

### New execution template

- Case ID and priority:
- Date / commit / environment:
- Starting state and fixture:
- Actions:
- Expected / observed:
- Evidence:
- Status and player consequence:
- Fix and regression result:
- Remaining limits:

## Release checks

Run the data validator, JavaScript syntax checks and all functional browser suites listed in tests/run-plan.cjs, optional semantic accessibility audit, and keyboard/Firefox/WebKit completion on the release candidate. Record exact results here. Complete a live browser smoke test of a fresh and returning investigation. Any unresolved P0 issue blocks a claim of a dependable core journey. Describe partial accessibility, source review and human-study coverage explicitly.

There are no multiplayer, login, cloud-sync or automated academic-review capabilities to certify. AI handoff is a manual brief-and-return workflow. Historical review remains a separate, ongoing obligation.

## 6 October ordered fix pass

Fix commit: `3ba2895`. Completed durability → interrupted investigation → adversarial research → keyboard/touch/browser-engine passes → targeted Brazil thesis critique. Each functional fix has a regression check. All JavaScript syntax checks and the data validator passed after the fixes.

The earlier confirmation pass found two assertions tied to a renamed export heading; familiar wording was restored, retaining the separate unreviewed candidate bibliography. The first complete confirmation passed 16/16 at `3ba2895`. An expanded confirmation uses `tests/run-plan.cjs`; its JSON output records commit, per-suite result and completion time. Do not count a started run as a pass.

The new suites are durability, interruption, adversarial-research and accessibility. Run the baseline thirteen, keyboard completion, then Firefox and WebKit complete routes. The revised keyboard helper reaches controls through actual Tab traversal, activates with Enter/Space and types text; the complete winning route passed. Human discoverability remains untested.

Remaining human/source checks: G01/G04/G05, H01/H02/H03, physical devices, real screen-reader/zoom/contrast evaluation, complete schema/multi-tab/route matrices, source independence, full original-source corpus review and a historian’s thesis examination. These are open obligations, not defects claimed fixed by browser automation.

For a human pass, give a new player no procedural coaching. Ask them to choose a question, identify one supporting and one challenging record, state a limit, plan missing research and file a bounded argument. Record assistance, confusion, perceived goal, understanding of rewards and what they think would change their conclusion. An experienced reviewer should then challenge the same exported document claim by claim. No participants have yet run this protocol.

### Expanded follow-up confirmation

Additional regressions cover concurrent progress and modal/filter navigation. Candidate source details now expand on demand; AI briefs require the principal claim to match the principal source. The independent AI return was manually narrowed before import because its first version combined documents. A new 19-run confirmation includes these regressions, genuine Tab completion, Firefox/WebKit completion and the optional axe audit. Results are recorded separately; a started run is not a pass.

### Confirmation run history

- `3ba2895`: first complete confirmation passed 16/16.
- `0afe8b3`: expanded confirmation passed 18/19; interruption reload failed twice. Closing a modal performs asynchronous browser-history navigation; the test tried to reload before that navigation settled.
- `eb09624`: interruption regression now explicitly waits for the modal route to finish. Isolated rerun passed. Complete confirmation passed **19/19** on `eb09624`: fifteen Chromium functional suites, thirteen-screen axe audit, actual Tab-only completion, Firefox completion and WebKit completion.
- Live Chrome on port 8768: candidate survives reload, stays unreviewed, can be assigned as a challenge with written limits; Back restores the evidence stage. No import points or accepted graph mutation.

The expanded semantic audit sampled 13 screens with no detected WCAG A/AA violations. Incomplete background/native checks remain manual obligations. This does not certify accessibility.

Manual audit triage: the stage-strip label was corrected with a semantic group role; the × close icon has the accessible name “Close” but still needs speech/reader usability testing. Contrast checks obscured by gradients, pseudo-elements or overlap remain manual. Do not treat axe incomplete checks as passes.

Final functional confirmation: all 19 scenarios passed at `eb09624`. The last change adds only `role="group"` to the investigation-stage strip; its separate thirteen-screen semantic accessibility recheck passed with zero detected violations and removed the stage-strip warning. No game or persistence behavior changed after functional confirmation. The initial expanded failure report is retained alongside the final result.

## State-aware feedback pass — 6 October 2026

| ID | Check | Status | Evidence / boundary |
|---|---|---|---|
| F01 | Capture the actual view, selected records and game progress | Tested | Prototype feedback suite; story/thread context, stage, record IDs and startup status |
| F02 | Capture published clue-comparison state | Tested | Published-interface preview suite; selected/seen/pinned leads, stance and entered-work flags |
| F03 | Keep private research out of diagnostics | Tested | Client preview and server whitelist; private thesis/question text, extra fields and private URL parts excluded |
| F04 | Lost acknowledgement, retry and duplicate click | Tested | Real Worker logic plus in-memory SQLite; same request recovers one stored report |
| F05 | Malformed input, rate limits, origins and unavailable storage | Tested | Service suite; rejected writes do not claim success, limits use atomic SQL |
| F06 | Feedback from an evidence dialog | Tested | Both frontend suites; native dialog stacking and focus return preserve investigation state |
| F07 | Feedback after failed collection startup | Tested | Prototype suite; form remains usable, failure status and resource location captured |
| F08 | Mobile, keyboard and accessibility | Partial | 390px reflow, sampled axe rules and complete keyboard game pass; physical devices and human discoverability still open |

Four service cases, the prototype feedback suite and the published-interface feedback suite passed. The complete Tab-only winning game also passed with the persistent button and early diagnostic capture. The Worker was built/deployed; its live health and invalid-input responses were checked without submitting a synthetic production message. `tests/run-plan.cjs` includes feedback when axe is enabled; the published preview suite is enabled only with `WORLDTHREADS_PUBLISHED_PREVIEW`.

Feedback is private operator input, not a historical contribution, an AI-reviewed source or a reward activity. See FEEDBACK.md for captured state, storage and retention, inbox operation and test/deployment commands.

## Return to the plan — 6 October 2026

**U03, actual browser zoom:** PASS within the recorded scope at `97918e0`, Chrome desktop, single-player preview on port 8768. Set Chrome to 200% using its native zoom controls (confirmed in Chrome’s accessibility tree). At the resulting 855×426 CSS viewport, the story shelf, Tambora story, expanded source dialog and all five thesis stages had no horizontal page overflow. Source expansion and dialog close worked. The feedback form opened and its Cancel button was reachable; closing restored focus to Share feedback. Existing research text was preserved, and browser zoom was restored to 100%. No code fix was needed. Screenshot: `worldthreads-thesis-200-percent-chrome.png` in the delivered outputs. This does not establish screen-reader usability, a complete zoom/device matrix or human comprehension.

Next: reconfirm the complete functional plan on the feedback-enabled candidate, then broaden the remaining concurrent-draft and navigation cases. Human beginner/historian reviews and original-source verification remain separate obligations.

### Remaining work queue

1. **R03/R04/R06:** broaden races between draft resolution, context switching and filing; unsupported schema versions; combined object/evidence/filter/history detours. Preserve a reproducible failing case before changing behavior.
2. **D02/D03/D05 and T02/T06:** review another filed thesis against exact passages, source dependence, causal scope and a rival explanation. Inaccessible sources stay unresolved.
3. **U01/U03/U04:** real screen reader, physical touch device, further zoom sizes and branded/private browser settings. Engine automation does not close these cases.
4. **G01/G04/G05 and H01–H03:** uncoached participant and historian sessions. Test whether players know their goal, what evidence would change their claim, and what badges actually mean. Agent walkthroughs cannot substitute for these participants.

### Navigation race found during reconfirmation

The feedback-enabled baseline `97918e0` passed **20/21** expanded confirmations, with WebKit failing during the first story’s progression. An isolated rerun also stalled during case filing. A deterministic regression delayed the actual `history.back()` caused by closing evidence, then advanced the story before releasing that history event. Before the fix, the delayed event reopened the old modal instead of preserving the new scene. This is a player-visible navigation race, not a failure to interpret historical evidence.

The fix queues a later route while the evidence-close history traversal is pending, then retains that route when the traversal finishes. A second close during that interval shares the pending transition. The new `navigation-race.cjs` passes in Chromium and WebKit; the existing navigation matrix passes. The full-route test also waits for the evidence return to settle before its next planned step; the separate race test deliberately omits that wait. Chrome’s immediate evidence-close → next-scene walkthrough preserves the later scene. Full final confirmation is recorded only after completion.

A subsequent confirmation at `48fce4f` passed **21/22**; WebKit intermittently could not select a case checkbox while scene scrolling continued, with the checkbox label or sticky header intercepting the target. The isolated full WebKit route had passed, so that isolated pass did not close the final confirmation. Scene changes, thesis-stage navigation and experience switches now scroll immediately instead of animating while the player attempts the next control. This prevents route focus and animated page movement from competing.

### Final confirmation after navigation fixes

**PASS: 22/22 on `c77250d`**, 6 October 2026. The final run includes sixteen core Chromium functional suites (with the new evidence-close race regression), thirteen-screen semantic audit, both feedback frontend suites, actual Tab-only winning route, Firefox winning route and WebKit winning route. The complete WebKit route also passed in isolation after scrolling was made immediate. Four feedback-service cases and the data validator passed separately. Repository validation checks on the pushed candidate passed.

The prior 20/21 and 21/22 reports remain retained. The final JSON report identifies each execution and candidate commit. Remaining partial cases stay partial: a complete tab/schema/route matrix, real screen reader and physical devices, uncoached participants, historian review, and corpus-wide original-source verification. The fixes are in the single-player prototype branch / PR #2. This confirmation does not certify the older published research frontend’s entire journey.

## Display-control restoration — 6 October 2026

The published research frontend already includes the Aa display control. The single-player test branch lacked it. The same control is now restored in the prototype: Auto / Light / Dark and Normal / Large / Extra-large / Largest text (100%, 112.5%, 125%, 140%). Fresh prototype visits retain dark mode; saved explicit preferences are honored. Auto follows device changes. The selected settings apply before first paint.

Fixed type sizes now use relative units so the content responds to the size control. Light-mode surfaces, evidence and thesis fields retain distinct uncertainty/dispute accents. Largest-size testing found and fixed a narrow header overflow. `tests/appearance.cjs` checks all preferences, actual story-text growth, reload persistence, Auto/explicit-theme behavior, Escape/focus return, denied-storage honesty and largest-size reflow. Twelve sampled display screens had no detected WCAG A/AA violations. The full confirmation below remains separate.

U06: **Tested within the automated scope above.** Real screen-reader users, physical devices and uncoached discoverability remain open. Add appearance to the optional accessibility run in tests/run-plan.cjs.

Final display-restoration confirmation: **23/23 PASS at `f8a2b9e`**. Includes the previous functional plan, new display-preference/reflow audit, feedback, full keyboard journey, Firefox and WebKit completion. Sampled default-theme and largest-size light-theme audits found no detected WCAG A/AA violations; incomplete/manual checks remain open. Chrome also confirmed that the Aa control appears, settings survive reload, and light/largest applies visibly. The user preview was restored to Dark / Normal after the walkthrough.


### Concurrent-draft follow-up — R03

A reproducible failure showed that Brazil work in one tab could replace a saved Dutch investigation in another tab when the player chose “Save this page’s draft instead.” The other investigation had no archive and could be lost after that tab closed. Conflict resolution now archives the different saved investigation before replacing the active draft. If that archive fails, replacement is blocked, the saved investigation remains intact, and the player sees a recovery explanation. Same-investigation version choices remain explicit.

`tests/concurrent-drafts.cjs` passes four scoped cases: download current unsaved edits and preserve/restore the different investigation; blocked protective archive; load the latest other-tab version and reload; reject stale filing even before a storage event arrives. R03 remains partial because these tests do not establish an exhaustive interleaving matrix or atomic browser storage. Complete expanded confirmation: **24/24 PASS at `f6054ef`**. This includes all four concurrent-draft cases, previous functional suites, appearance/feedback audits, the full keyboard journey, and Firefox/WebKit completion. Historical graph validation also passed. Report: `worldthreads-draft-conflict-confirmation.json` in delivered outputs. Remaining source, human usability, screen-reader and exhaustive race/schema reviews stay open.


### Unsupported saved-progress follow-up — R04

A regression seeded a version-2 progress file, then entered a story. The old reader treated the unknown version as empty progress and the next activity silently replaced the original file with version 1. The fix preserves unsupported progress without interpreting its badges or case completions. A visible notice explains that new activities are session-only, and an export downloads the original stored bytes. The app does not claim to migrate an unknown schema.

`tests/schema-recovery.cjs` covers newer, older, string-valued and missing progress versions; preservation after entry/reload; exact recovery export; an unsupported write from another tab; and continued loading of supported progress and legacy unversioned thesis drafts. The recovery notice fits at 320px and the sampled automated accessibility audit detected no WCAG A/AA violations. This pass protects the existing versioned progress store. Thesis drafts, research candidates and portfolio lists currently use unversioned record shapes; a complete migration/shape matrix remains open, so R04 stays partial.

Complete expanded confirmation: **25/25 PASS at `ef68181`**. Includes the new schema-recovery suite, all prior functional checks, appearance/feedback, the full keyboard route, and Firefox/WebKit completion. Historical graph validation also passed. Report: `worldthreads-schema-recovery-confirmation.json` in delivered outputs. Screenshot: `worldthreads-unsupported-progress.png`. No historical claims or source judgments changed in this pass.


### Unreadable research and portfolio collections — R04

The next regression reproduced silent loss of unreadable research entries when a player imported a new proposal. Research imports, cross-context linking, candidate exclusion/restoration and portfolio filing now preserve the exact original collection before replacing a list containing unsupported records or malformed JSON. A failed protective write blocks replacement. Separate originals remain separate recovery copies; they do not count as evidence, filed portfolios or badges. Readable entries remain usable, and the player can continue after the original has been preserved. Recovery controls sit in collapsed details in the research and presentation stages.

`tests/list-recovery.cjs` checks malformed JSON, unknown list/envelope shapes, exact download and reload recovery, failed import backup, failed portfolio backup without a reward, successful filing retry, mixed valid/unknown research during candidate exclusion, multiple originals and 320px reflow. Portfolio preparation in this suite is a fixture for storage checks, not a historical or scholarly assessment. R04 remains partial for draft/archive migration and deeper record-field validation.

Complete expanded confirmation: **26/26 PASS at `0b91acb`**. Includes the new list-recovery cases and all prior functional suites, display/feedback audits, keyboard completion, Firefox and WebKit completion. Historical graph validation passed. Report: `worldthreads-list-recovery-confirmation.json` in delivered outputs. Original-source review and human usability checks remain open. Next substantive pass: D02/D03/D05 and T02/T06, reviewing a filed thesis against exact source passages, shared-source dependence and a rival explanation.


### Filed-thesis source stress test — D02/D03/D05 and T02/T06

An independent agent reviewed the Brazil thesis in the complete-game test and inspected its three cited institutional web sources. The direct Câmara transcription was available; the corpus access note now records that successful follow-up, while original printed legislation, payments and attendance remain unverified. The revised thesis attributes its retrospective chronology and preserves the disagreement between building readiness and inauguration. See THESIS_SOURCE_AUDIT.md for inspected passages, scope, limits and discriminating research tasks. Source access does not certify the thesis or establish that distinct institutions used independent underlying evidence.

A failing regression showed that the source-overlap warning missed two shared-source records when a third distinct source was present. Shared references and matching registered/candidate URLs now generate entry-specific provenance reminders. Distinct links receive no independence verdict. Reminders appear during defense and presentation and persist in the thesis export and filed portfolio snapshot. `tests/source-dependence.cjs` covers partial overlap, mixed registered/candidate overlap, fragment variants, exports and distinct-link honesty. The complete-game example was narrowed to retain the contradictory retrospective building dates; original class and payment research remains open.

Complete expanded confirmation: **27/27 PASS at `69f427d`**. Includes source-dependence regression, revised full-game thesis with provenance reminders preserved in its downloaded portfolio, prior functional/recovery checks, appearance/feedback audits, keyboard completion, Firefox and WebKit. Historical graph validation also passed. Report: `worldthreads-source-review-confirmation.json`; test-generated example: `worldthreads-source-reviewed-example-portfolio.json` in delivered outputs. These ledger cases remain partial for corpus-wide source verification, human scholarly review and broader provenance dependencies.


### Public single-player release

PR #2 merged at `0a30f47`; release preparation `ba54257` passed both validation checks. GitHub Pages now publishes the static root of `main`, with successful deployment run `37564799359`. The prior interface remains on `gh-pages` for rollback. The public review URL is https://stewartdavidp-ship-it.github.io/worldthreads/.

The complete `winning-game.cjs` route passed against the actual public URL: three cases, two challenges, ten badges, AI research return, rival test, narrowed thesis, provenance snapshot, local filing, immutable download, duplicate protection, reload and mobile. Chrome independently showed the new story shelf, dark/normal display controls and feedback dialog; opening/canceling feedback preserved the homepage. No synthetic production feedback was submitted. Screenshot: `worldthreads-public-player-release.png`; release record: `worldthreads-public-release.json` in delivered outputs. The earlier 27-suite confirmation remains the broader functional baseline; this public check does not close source/human/manual gaps.

## 7 October 2026 — quieter opening pass

Reviewer feedback: the opening felt too busy. The story entrance now leads with the educational purpose and three question cards. Decorative card diagrams and repeated introductory copy were removed; goals/rewards are disclosed inside the expedition section, and the field journal follows the story shelf. Active stories retain the progress summary above their scenes. Display controls, library/object entry points, saved-draft resume and evidence/uncertainty distinctions remain available.

Validation: quiet-opening, progress, winning-game, navigation-matrix, appearance and semantic-accessibility passed against the local candidate. The full winning route still reached all 10 badges / 890 points. Largest text reflow was checked at 320px in light and dark themes; an opening-heading overflow was found and fixed. Existing progression tests were updated to open the now-collapsed expedition before inspecting its contents. Sampled automated accessibility checks detected no violations; unresolved manual checks remain. Chrome visual review completed. This is functional and visual verification, not evidence that new participants find the opening calmer or clearer. P01/P02 still need an uncoached human follow-up.

## 7 October 2026 — published opening follow-up

Production e0e03f9: quiet-opening, quiet-opening with keyboard activation and returning-player passed. Live Chrome walkthrough verified clue gating, a non-answer-revealing prompt after an unsupported interpretation, bounded supported interpretation and shelf resume. 390px opening reflow passed. No production feedback submission. P01/P02 remain unvalidated by uncoached human participants.

New visible weak spot: the first story scene shows points/trail status, investigation stages, scene track and an interactive map before the clue task; interpretation controls lie further down. Next candidate should prioritize the current question and evidence workbench, with one compact progress indicator and an optional broader map. This is an agent layout assessment, not proof of participant distraction. See delivered WorldThreads opening test.md for reviewer questions and scope.

## 7 October 2026 — visual story pass

Story cards now use native SVG illustrative scenes and shorter text. The Dutch evidence workbench uses visual record symbols with explicit illustrative labels and source-check actions. Selection/inspection states remain tied to the existing clue records. The current question and evidence task precede the optional interactive story overview; process stages are expandable and the duplicate scene track is removed. Other guided scenes have labeled illustrative artwork. No new historical claims, geographic routes, quantitative charts or reconstructions were added.

Local validation: quiet-opening (mouse and keyboard), winning-game, appearance and semantic-accessibility passed. The complete game-to-thesis route still reached all 10 badges / 890 points. The explorer test was adapted to open the optional story map before clicking the frontier; the adapted explorer suite passed. Scene art, sources and unresolved frontiers are separate. Chrome visual review completed. Automated accessibility checks remain sampled; human interest and comprehension remain untested.

## 7 October 2026 — first-story visual evidence and animation

The harvest story now leads with an interactive geographic locator, alternate NASA photo/zoom and conceptual mechanism-animation views, a documentary duration graphic, Korean administrative-count and paddy-tax graphics, and an interactive research frontier. The locator uses public-domain modern land outlines, approximate markers and no historical borders or atmospheric routes. Source images, explanatory diagrams and derived evidence counts have distinct visible labels; media views earn no points. See HARVEST_MEDIA.md for provenance and limits.

Validation passed locally: harvest-media (including sampled axe checks on locator, mechanism, prefecture and paddy graphics, light paddy view; 320px map hit targets; image failure; reduced motion; timer cleanup; exact 17/336 count and separate 11.2% denominator), winning-game (all 10 badges / 890 points through thesis filing), appearance, semantic-accessibility and explorer. After final visual-first ordering, winning-game, appearance and sampled accessibility were rerun successfully. Chrome verified the real NASA image, photo/mechanism switching and play control. No production feedback was submitted. Human engagement and educational transfer are still untested.

### 7 October 2026 — first-story reasoning pass

- Tested: player connection highlights a labeled hypothesis; local context stays distinct from the registered regional relationship.
- Tested: a written prediction opens the Korean chart; revised claim/limit/next-source draft persists and downloads.
- Tested: changing a tested prediction invalidates assembled status; another tab's draft is preserved.
- Tested: sampled WCAG checks and 320px/light reflow on the new comparison; existing full winning-game and harvest-media regression scenarios pass.
- Not established: learning outcomes, historical quality of player-written claims, or independent archival verification. The own-argument board remains separate from guided case badges; these badges do not certify the thesis.
- Next human pilot: ask a fresh learner to predict, reveal, revise and explain which relationship has source support. Observe whether they can name a specific missing record without being supplied the conclusion.

### 7 October 2026 — Chrome visual agent review and response

An explicitly requested agent reviewed the first story in Chrome using a labeled local draft on localhost, preserving existing work on the other preview origin. This is a simulated player review, not a human usability study.

Feedback: the Czech board felt like a form; the connector change was too small. Revealing Korea focused a button below the chart and scrolled past the reveal. Dense source credits and three writing fields dominated the comparison. The Amsterdam finale felt like an unexpected topic change.

Changes: three selectable/scrubbable evidence landmarks now update an illustrated scene, dated finding and direct record access. Proposed contribution uses a solid connector; a sequence remains dashed. There are no invented measurements or interpolated trend lines. Source credits and context use labeled native expansions. Secondary writing fields expand separately; denominator and household-access limit stay visible. Reveal focuses the chart heading; a compact evidence pair supports revision. The player's argument precedes an optional Amsterdam investigation. Reopening unchanged reports preserves the decision; testing a changed prediction clears it.

Agent recheck: noticeably more visual and less cluttered; landmark dates distinguish weather, harvests and later prices; chart reveal and reduced text helped. Last refinements about repeat-comparison clearing and the standalone Amsterdam button were also addressed. Browser checks cover landmark clicks/keyboard scrub, qualitative limits, reduced motion, narrow reflow, reveal focus, collapsed detail, argument-before-optional-investigation ordering, saving/export and stale/conflicting drafts. The existing keyboard winning-game and harvest-media regressions pass.

Next: a human first-impression and explanation test; review whether animated landmarks teach sequence vs causation. Possible future extension: visual retain/narrow/suspend scope states and authentic archival images, once suitability and reuse are verified. Do not equate agent preference with learning effectiveness.

### 7 October 2026 — researched rain/calendar extension

- Source checked: Kim (2023) section 3/table 2/figure 4, independently checked by an agent; diary originals and Wada compilation not directly authenticated.
- Added three bounded observations, four evidence/place objects and two explicitly associated cross-site comparisons. Historical graph validation passes: 81 observations, 57 relationships, 23 threads, 48 sources; 177 objects and 199 object connections.
- Chrome agent found a real returning-session data-cache failure. Versioned corpus requests with revalidation fixed it; Chrome recheck displayed the correct bars and dates. Agent then requested simultaneous visibility; desktop now puts rainfall and farming panels side by side.
- Tested: exact rainfall values, reported dates, season selection/calendar shading, shared rainfall scale, desktop two-panel layout, mobile/light layout, reduced motion, keyboard controls, no media rewards and sampled accessibility.
- Regressions passed: saved inquiry, full winning-game, explorer relationships, load interruption/retry and feedback capture.
- Research limit preserved: Seoul rainfall is not Iljik rainfall, a first-harvest date is not completed harvest, temporal alignment is not causation, and Table 2's day-difference discrepancy remains documented.
- Still untested with humans: whether users infer the cross-site limitation or treat the shaded farming window as a causal simulation. Ask them what additional local evidence they need.


## First-story full playthrough — 7 October 2026

Played in Chrome on a separate local origin from a fresh player to a locally filed portfolio: Tambora context → Czech visual sequence → uniform-failure prediction → Korean counterexample → calendar comparison → narrowed claim → case earned → thesis planning → evidence roles and honest passage-check limits → AI research brief → pending rival test → further revision → evidence reassessment → portfolio and manuscript downloads. The final round earned 235 points and five badges; completing other stories is not required to finish this research round.

Fixed the break between the independent story argument and thesis. An explicit action carries the player's claim, boundary, next question and three starting records into a fresh thesis without assigning checked evidence roles. Existing theses remain intact. Prediction/decision history persists through saves and exports. Corrected the Korean thread's irrelevant disease-attribution description.

`harvest-full-story.cjs` replays the complete journey, verifies the research brief, unresolved test, saved revision, current evidence roles, portfolio filing, story-history export, reload, preservation on reentry and mobile width. It uses the manually played thesis as a reproducible example; it does not certify the historical interpretation.

Remaining weaknesses: old Tambora/Czech records have incomplete record-specific uncertainty/locator fields; national Korean classifications and geographically mismatched rainfall/farming sources cannot establish household food access or explain local harvest mechanisms. The examiner transition requires substantial writing and feels more like a research workspace than the earlier visual investigation. A human first-player test must assess whether that transition is clear and motivating. The panel handoff was then added below; a real external-assistant review and human response pilot remain pending.


## Copy-and-return AI panel presentation — 7 October 2026

The selected filed portfolio now offers a self-contained five-role review prompt and copy control. The player pastes it into an assistant, then pastes its JSON into WorldThreads. The schema specifies claim IDs, evidence basis, source-access status, bounded research hints, disagreements and defense questions; it rejects grading/replacement-thesis fields. Reviews are attached to the exact filed version and stored apart from evidence, drafts and badges. Returned source checks remain assistant-reported. The presentation expands one reviewer at a time and saves the player’s accept/investigate/retain/suspend response and reasoning. The combined presentation is downloadable.

Verified in Chrome using an advisory critique authored from the supplied playthrough document, with no original-source checks claimed. Automated `panel-review.cjs` checks complete prompt contents, malformed/grading/unsafe-source and wrong-version rejection, fenced JSON, duplicate protection, response persistence, unchanged thesis/progress, presentation export, version isolation, reload, narrow/light layout and sampled accessibility. Test output is explicitly a fixture; it does not demonstrate external AI review quality or independent historical authentication.


## Actual ChatGPT clipboard round trip — 8 October 2026

Used the Chrome-played first-story thesis on the separate test origin. Copied the generated 27k-character review prompt, pasted it into a new signed-in ChatGPT conversation (long paste became a text attachment), sent it, and copied the returned five-role critique. The original plain-JSON instruction exposed a real interoperability failure: ChatGPT's rendered-message Copy escaped URL colons as `https\://`, producing invalid JSON. WorldThreads rejected the response and preserved the paste. A formatting-only follow-up returned literal JSON in a code block; its code Copy imported the same critique successfully (five roles, twelve concerns).

Updated the exported prompt to request one fenced JSON code block and instruct the player to use its Copy button. Updated the return UI and parse-error guidance. No automatic URL repair or silent rewriting of the critique is performed.

Repeated from a fresh ChatGPT conversation using the corrected prompt: code-block Copy → paste unchanged into WorldThreads → import succeeded on the first return, with five roles and thirteen concerns. The result was attached to the correct filed version and exported in the presentation. ChatGPT reported all four external references as not checked; this verifies the genuine assistant interaction and presentation flow, not original-source authentication.

Successful conversation: https://chatgpt.com/c/6ac71851-d4d0-83ea-afb0-0e2069a1bea0 . Initial failure/format repair: https://chatgpt.com/c/6ac71777-e23c-83e9-9433-4ddf67734ff1 . These are account conversation links, not public share links.

The real review identified question/claim scope mismatch, missing passage checks and inconsistent source-access metadata. It also labeled some positive internal-document findings with the schema's 'internal inconsistency' basis; review commentary still requires human interpretation. A future schema can distinguish internal-document support from inconsistency more precisely. `tests/fixtures/chatgpt-panel-review.json` preserves the actual successful assistant response for import regression testing; test request IDs are adapted only to the isolated test portfolio.

The real assistant returned a long synthesis; the presentation now shows a short opening with an explicit expansion for the complete synthesis and evidence boundary. The original critique remains intact in storage and downloads. Import regression, persistence, version isolation, narrow/light layout and sampled accessibility passed after this adjustment.


## Guided response to the panel — 8 October 2026

Replaced the report-first presentation with an opening strength, one challenge at a time and a closing record of the player's decisions and unresolved research. Argument-wide causal concerns come first when present. Claim and evidence controls expand the relevant filed snapshot; registered sources remain available as evidence detours. The player chooses accept, investigate, retain or suspend and supplies their own reasons. Skipping preserves an open question. Response progress counts recorded decisions, not correct answers. The full unchanged critique stays behind an expansion; revisions still require the player's working draft and a new filing. The request copies in one action, with its long contents behind an inspection control.

Chrome: inspected the genuine 13-concern ChatGPT review, followed claim/evidence controls and skipped all questions to verify that the ending preserves all 13 as open rather than claiming a successful defense. Automated regression also recorded a response, reloaded, checked version isolation and export, deliberately blocked a save and confirmed navigation could not discard the unsaved note, carried unanswered questions to the ending and returned to revision. First-story full playthrough, draft durability, graph validation, narrow/light layout and sampled accessibility pass.

Remaining human test: does a new player understand what evidence would justify their decision? This is a more focused response workflow, not yet proof that the thesis-writing stage feels as visual or motivating as the story. AI findings and source access remain advisory and assistant-reported.


## Is returning from the assistant worth it? — 8 October 2026

The default handoff now copies a prose discussion brief with the filed claims and evidence. It requests no JSON or return to WorldThreads. The structured critique path is optional. A formatted report alone is not sufficient value to justify the return.

The optional return provides a visual claim-to-record map using the player's filed roles, a citation dependency diagram with selectable sources, and a chosen challenge carried into the research desk without overwriting research notes. Citation lines show registered references in the filed snapshot; neither multiple citations nor an AI critique establish independent corroboration or checked passage support. Decisions are progressively disclosed.

Verified in Chrome with the existing genuine 13-concern review: source highlight, chosen challenge → research desk → original challenge, unchanged decision count. Isolated browser regression verifies the default clipboard contains the actual thesis and no required JSON, exact record expansion, source highlighting, research-note preservation, wrong-version isolation, durable responses, mobile/light and sampled accessibility.

Human evaluation: compare reading the critique in the assistant with the optional returned map. Can the reviewer identify which record/source underlies a challenged claim, distinguish context from support, and choose a research action more easily? If the map does not improve these tasks, simplify the return further. Still to explore: visual before/after comparison of a revised thesis and its changed evidence links, and a source-unavailable scenario that shows affected claims without declaring them false. Conversational follow-up remains in the assistant.


## Human-facing review and focused detail panels — 8 October 2026

The active question screen now starts with a plain-language question, a short excerpt of the actual AI concern, Show me the evidence, and three primary next steps: rethink the claim, seek evidence or leave it unresolved. Keeping the claim remains available as an additional choice. A reason field appears after choosing, and appropriate actions lead to revision or research. Reviewer roles, identifiers, citation graphs and response counts are removed from the main active view. The ending keeps decisions and open-question counts behind an expansion.

Evidence opens in a native modal panel comparing the player's filed claim with the relevant recorded observations. Full claim, passage notes, source references and uncertainty are available through Read more. Full AI reasoning and evidence connection graphics have their own detail views. Closing the panel or pressing Escape restores focus to the originating button and preserves the main-page position and response. Nothing rewrites a thesis or certifies evidence.

Verified in Chrome against the existing genuine review: question → evidence comparison → return to the same question. Browser regression verifies no connection map on the main screen, expanded source access, notes preserved across the panel, Escape/focus return, failed-save navigation blocking, research return, version isolation, export, narrow/light layout and sampled accessibility for both the question and modal. Next human check: can a reviewer identify the next action without knowing the model or reading the full report?


## Independent agent perspectives — 8 October 2026

Three agents tested isolated browser sessions rather than sharing a player or changing user work. Newcomer began fresh and reached a provisional first-story claim. Skeptic and assistant-first perspectives used a filed example and the previously genuine ChatGPT response, adapting only its request ID. This is task-based agent evidence; human intuition and learning remain unproven.

| Perspective | Observed weakness | Change and confirmation | Remaining gap |
|---|---|---|---|
| Newcomer | Disabled thesis handoff after optional writing was skipped; empty labels and no direct recovery | Ending names every missing prerequisite; each recovery link opens and focuses its exact field, preserves the claim; independent agent retest and inquiry-recovery regression | Ending still has competing destinations; evidence metadata remains dense |
| Skeptical researcher | Historical record button not routed from body-mounted comparison; subsequent history restoration collapsed review and could change selected filed version | Modal-specific record routing, live review return and nested-inspector close without rebuilding thesis; independent detour retest and panel-review regression with multiple versions | Human interpretation of comparison remains to test |
| Skeptical researcher | Challenged research question hidden; retention visually secondary | Question is shown beside claim; retain has equal visibility; independent retest | Four choices need human evaluation |
| Assistant-first returning player | Review and research task buried after reload; note-writing appeared prerequisite to research | Exact-version Continue my review / Continue this research question actions, direct research action and visible suggested next step; independent retest and panel-review regression | Descriptive-versus-causal distinction still demands mental comparison |

Targeted checks: panel-review, harvest-full-story, inquiry-recovery and navigation-race. These are not a rerun of the entire historical release matrix. Existing data/draft/review uncertainty boundaries remain unchanged. Backlog includes the user's badge-icon request; see BACKLOG.md.
