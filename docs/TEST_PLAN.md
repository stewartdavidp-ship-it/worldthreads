# WorldThreads test plan and coverage ledger

Updated: 6 October 2026. Baseline: `5da62dc`. Scope: single-player, browser-local prototype.

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
| ai-research.cjs | Brief reflects the question, rejects prose, accepts structured local candidate, deduplicates | Passed in the latest development pass; no independent external AI session |
| winning-game.cjs | Fresh full route, ten badges, 890 points for this route, research, revision, filing, exports | Passed in the latest development pass; points vary with optional activities |
| returning-player.cjs | Stale record assessment, changed evidence, second filing, immutable earlier download, shared candidate, empty slots, reload | Passed at baseline 5da62dc |
| Live Chrome walkthroughs | Fresh completion and returning-player version comparison | Agent walkthroughs with screenshots; not a human usability study |
| Research audit | Targeted source and causal corrections, regional and access limits | See RESEARCH_AUDIT.md; not a complete independent verification of the corpus |

The nine browser suites use Chromium. Narrow-viewport assertions check overflow; they do not establish touch usability, accessibility, or cross-browser compatibility.

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
| A01 | Ask an AI assistant for research | Partial | Brief contains scope, model, evidence and return schema; actual external assistant session still needed | AI-research |
| A02 | Import candidate and use it | Tested | Candidate remains local/unreviewed, selectable and exportable; registered graph unchanged | Research-flow + winning |
| A03 | Duplicate candidate in another context | Tested | Reuses one finding with context links; does not count as independent corroboration | Returning |
| A04 | Malformed prose, missing locator, unsafe URL scheme | Tested | Tested bad inputs reject without changing the corpus | AI + research-flow + winning; limited adversarial set |
| A05 | Plausible invented citation or irrelevant source | Not tested | UI must not imply validation from schema acceptance; investigator can reject or quarantine it | Test with clearly labeled synthetic fixtures |
| A06 | Huge files, HTML, Unicode, null/array shapes | Partial | Inputs fail safely or render as text; no execution, crash or data loss | Size guard exists; comprehensive adversarial checks absent |
| D01 | Graph consistency | Tested | All registered references and projected claim directions validate | Python validator |
| D02 | Source passage supports observation | Partial | Audit records exact passage, date/place scope, source dependence and access limits | Targeted research audit; corpus-wide review incomplete |
| D03 | Relationship warrants causal language | Partial | Context/role does not become cause; alternative mechanisms and uncertainty retained | Data/UI distinctions + targeted audit; full independent review incomplete |
| D04 | Coverage represents affected populations | Partial | Coverage gaps are explicit; add regional/local perspectives with provenance | Africa, Indigenous views, household relief and other gaps remain |
| D05 | Completed thesis withstands scholarly critique | Not tested | Independent reviewer challenges premises, source independence, counterevidence and conclusion | A filed pilot is not a defended thesis |
| R01 | Reload and ordinary autosave | Tested | Draft, decisions, rewards and portfolios survive expected reload/context transitions | Research-flow + returning + winning |
| R02 | Storage unavailable or full | Not tested | Failed write cannot claim durable success or file a stale draft; recovery preserves current work | P0 next pass |
| R03 | Two tabs edit the same investigation | Not tested | No silent overwrite; conflict or recovery path is visible | P0 next pass |
| R04 | Corrupted stored records / old schema | Partial | Corrupted progress JSON resets safely; other keys and migrations need fixtures | Progress only |
| R05 | Data fetch failure or offline startup | Not tested | Clear retry/recovery state; no misleading empty corpus or broken core flow | P0 next pass |
| R06 | Browser back, refresh and detour mid-task | Partial | Active context and unsaved state remain intelligible across all entry routes | Some navigation tested; full route matrix absent |
| U01 | Narrow screen | Partial | Existing 390px overflow checks pass; touch targets and real-device interaction remain | Browser suites |
| U02 | Keyboard-only full winning route | Partial | Every action reachable, focus visible/returned, no trap; full journey untested | Enter card and dialog focus checks only |
| U03 | Screen reader, zoom and contrast | Not tested | Understandable reading order/labels, announcements, usable zoom and dark-mode contrast | Dedicated accessibility pass required |
| U04 | Safari, Firefox and private browsing | Not tested | Core journey works or accurately explains unavailable persistence | Chromium coverage only |
| U05 | Long text and non-English research notes | Not tested | Labels, imports, comparisons and exports remain readable and preserve text | Include diacritics, long titles and multiline notes |
| H01 | Uncoached beginner | Not tested | Can explain their question, evidence limit and next research move; record confusion and assistance | Real participant needed |
| H02 | Skeptical advanced historian | Not tested | Can distinguish author interpretation from graph claims and critique a filed thesis | Independent reviewer needed |
| H03 | Returning player after several days | Partial | Saved state works; player can recover purpose and next action without rereading everything | Returning automation; delayed human recall untested |

## Next passes, in order

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

Run the data validator, JavaScript syntax checks and all nine browser suites on the release candidate. Record exact results here. Complete a live browser smoke test of a fresh and returning investigation. Any unresolved P0 issue blocks a claim of a dependable core journey. Describe partial accessibility, source review and human-study coverage explicitly.

There are no multiplayer, login, cloud-sync or automated academic-review capabilities to certify. AI handoff is a manual brief-and-return workflow. Historical review remains a separate, ongoing obligation.
