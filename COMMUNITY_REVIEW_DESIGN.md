# Account-free contributions and automated evidence debate

Agreed direction: participation must not require a GitHub account, and routine review must not depend on a human reviewer. Implemented in v0.4 through the account-free Worker/D1 service. See docs/COMMUNITY_SERVICE.md for exact deployed behavior and remaining extensions.

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

## Implementation scope and further extensions

The submission API, private receipts, bounded review jobs, HTML/plain-text retrieval, factual evidence forms, review events, graph publication, hourly public repository snapshots and three automated recognition rules are implemented. Deep PDF/scan retrieval, specialized provenance/resilience badges and later-year expansion remain future extensions. The service labels unresolved claims explicitly rather than creating a human review dependency.

## Showing contributions in the historical graph

Facts are observation nodes with dates, places and passage-level evidence. Relationships are separately assessed edges with mechanism, direction, timing, evidence and review status. Threads are named routes through the graph, including branches, rather than a separate store of duplicated facts.

After automated assessment, a contribution can append a supported node and edge, branch from an existing node, connect two existing threads, or revise an edge. Counterevidence attaches to the affected fact or relationship. Challenging an edge does not delete its endpoint facts. Unsupported adjacency never becomes an implied causal arrow.

Selecting a fact shows its source passages; selecting a relationship shows why that connection is proposed, alternatives, supporting and contrary evidence, uncertainty and revision history. Distinguish supported, provisional and disputed edges through labels and line styles as well as color. New branch endpoints offer a prompt to investigate the next open question. Contributors can preview the proposed graph changes before submitting them. Deduplicate source accounts and fact records before publication.
