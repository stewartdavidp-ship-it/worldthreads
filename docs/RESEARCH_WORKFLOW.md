# Research → Review → Audit → Fix

Every observation and relationship is a separate claim. Confidence measures support for that claim; workflow status measures review progress. Neither substitutes for the other.

## 1. Research
Select a research gap and a bounded place/time/question. Read the full relevant source, record bibliographic details, access date and a page/section locator. Record the smallest supported claim, dates, geography, evidence type and uncertainty. Use `evidence.json` to connect claims to inspected passages. Distinguish an archival original inspected directly from a historical report cited through a later author. Sources repeating the same underlying report are not independent corroboration. Do not infer missing numbers or continuous effects from isolated reports.

## 2. Review
Compare each clause with its supporting passage. Check dates, geographic scope, measurement units, alternative explanations and source dependence. Review relationships separately: co-occurrence does not establish causation. Narrow, split or withdraw unsupported claims. Record reviewer, decision and limitations. A self-check may produce `pending_independent_review`; only a recorded independent review may produce `approved`. Confidence may rise with stronger support while independent review remains pending.

## 3. Audit
Run `python3 scripts/audit.py`. The audit checks duplicate IDs, dangling references, thread endpoints and evidence references. It reports legacy records lacking claim-level evidence as warnings; they are not automatically verified. It blocks missing locators, invalid evidence references and an approved review with no independent reviewer. This is a structural/provenance check, not proof of historical truth. Independent review must inspect the actual sources.

## 4. Fix
Resolve audit errors before publishing a revision. For each substantive correction, record old claim, new claim, supporting locator and reason in a review log. Preserve stable IDs and explain date/meaning changes. Keep unresolved issues in research gaps; do not mark an entire region complete because one thread was added. Rerun the audit and check changed browser behavior. Publish the revision with remaining warnings and review limits stated.

## First batch
The local Tambora batch has claim-level evidence and scholarly corroboration, with independent review still pending. Its maritime observation was narrowed to a dated 1819 report. Recovery beyond the core 1814–1818 window requires explicit context labeling. Legacy records still need passage-level audit.

## Challenge the preferred explanation

Before approving a causal claim, explicitly search for rival explanations,
cofactors, prior vulnerabilities, counterexamples and resilience factors. Record
search scope, sources inspected, contrary results and unresolved questions.
Alternatives may interact rather than compete. Do not downgrade one merely
because evidence has not yet been collected. State what observations would
distinguish mechanisms, and keep rejection reasons in the review log.

The first famine example records relief capacity as a plausible cofactor and
pre-existing insecurity as an unresolved research question. Targeted alternative
research and independent review remain pending. Automated audits cannot perform
these substantive historical judgments.
