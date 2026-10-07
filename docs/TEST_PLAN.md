# WorldThreads test plan and coverage ledger

Updated: 6 October 2026. Current confirmation candidate: `f6054ef` (24/24 expanded checks passed; earlier confirmations retained below) (first fix baseline: `3ba2895`) (earlier coverage baseline: `5da62dc`). Scope: single-player, browser-local prototype.

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
| T06 | Contradictory evidence and pending research | Partial | Pending result does not fabricate a conclusion; conflicting-source reasoning still needs human assessment | Examiner; independent review pending |
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
| D05 | Completed thesis withstands scholarly critique | Partial | Independent agent source/reasoning critique completed; primary-record research and human historian assessment remain pending | BRAZIL_THESIS_REVIEW.md |
| R01 | Reload and ordinary autosave | Tested | Draft, decisions, rewards and portfolios survive expected reload/context transitions | Research-flow + returning + winning |
| R02 | Storage unavailable or full | Tested | Injected quota/denied writes block stale filing; current session work exports and save recovery succeeds | durability.cjs |
| R03 | Two tabs edit the same investigation | Partial | Competing tabs require explicit choice; keeping a local draft preserves another investigation in its archive. Backup failure blocks replacement; latest-version recovery and unseen-write filing are checked. A complete multi-tab race matrix remains open | durability.cjs; concurrent-drafts.cjs; concurrent-progress.cjs |
| R04 | Corrupted stored records / old schema | Partial | Malformed draft, candidate and portfolio shapes recover; unsupported historical schemas still need a complete migration matrix | durability + progress |
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
