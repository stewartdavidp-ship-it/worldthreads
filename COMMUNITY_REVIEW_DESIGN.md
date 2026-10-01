# Account-free contributions and automated evidence debate

Agreed direction: participation must not require a GitHub account, and routine review must not depend on a human reviewer. This is a design for the next release, not a deployed capability.

## Contribution flow

Pick a thread → receive a methodology prompt → research → paste/upload structured findings → automatic validation → source inspection → competing-explanation review → audit → correction request or publication.

A server accepts submissions into a private queue and returns an unguessable receipt. An optional email can support notifications; public credit uses a chosen display name. Credentials and contact information never enter the public research repository. Cloudflare Functions or a Worker can accept submissions, with D1 storing receipts, drafts and review events. GitHub remains an export and version-history destination. The current GitHub Pages site can call this service without requiring migration.

## Review outcomes

Structural rejection: missing fields, invalid dates, unsafe links or broken references; return specific corrections.

Provisional: publish structurally valid findings clearly marked as unverified when source access or substantive assessment remains unresolved.

Passed automated review: passage-level source checks, provenance dependency checks, alternative explanations and audits pass. This status describes the checks completed; it is not a guarantee of historical truth.

Disputed: credible counterevidence or unresolved competing explanations are attached.

Weakened or withdrawn: new evidence invalidates part or all of a claim; preserve its history and explain the change.

Agents should inspect sources separately from the contributor's supplied interpretation. Submitted text and fetched pages are untrusted data, not operational instructions. Review records include source versions, inspected passages, model/version, timestamps, reasoning summaries, failures and costs. Bounded retries prevent endless audit/fix loops; unresolved cases receive a public status rather than a human-review dependency.

## Factual supporting evidence and counterevidence

The public interface uses “Submit supporting evidence” and “Submit counterevidence.” Each entry identifies a claim, cites a source and exact passage, explains relevance and states limitations. Source-reliability concerns and alternative causes require evidence too. Unsupported opinion does not enter the claim assessment. Responses address evidence, never the contributor; personal criticism and adversarial scoring are excluded. Automated reassessment creates a new review event and updates affected relationships and threads. Preserve prior wording, confidence/status, evidence and the reason for every change. Recheck dependent claims without treating a change to one link as invalidating an entire thread automatically.

Popularity and vote totals never determine historical confidence. Several retellings of one account count as one witness. Supporting, disconfirming and inconclusive findings are all useful. Badges depend on recorded review results and can be revised when their underlying evidence changes.

## Remaining implementation

Build submission API and receipt page, queue and bounded review jobs, source-retrieval checks, structured reviewer outputs, debate/challenge interface, revision history, publication/export workflow and badge rules. Add spam/rate controls and spending limits. Replace current interface wording about GitHub posting and independent review only when the replacement service is deployed and tested.
