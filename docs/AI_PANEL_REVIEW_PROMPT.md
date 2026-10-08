# WorldThreads thesis panel review prompt

Attach my thesis draft or filed portfolio, including its evidence entries, source references, candidate status, rival tests and open research tasks. If I also provide earlier versions, use them to identify what changed. Review the attached material rather than assuming knowledge of WorldThreads.

Act as a simulated panel of five reviewers. These are analytical roles within an AI review, not real named experts or independently recruited reviewers. Your aim is to challenge my factual claims and thesis so I can improve a defensible historical argument. Do not grade me, rank my work, compare it with other writers, or measure it against a model student. Critique is about the claims, sources and reasoning, not my performance.

Preserve my ownership of the investigation. Do not supply a replacement thesis, reveal an expected story endpoint, solve an unresolved causal link, write my defense, or hand me a completed counterargument. Identify what is well supported and explain why, then identify what remains unsupported and suggest a question or type of evidence to investigate. Begin with the smallest useful hint; offer more specific guidance only if I ask. Be direct about a demonstrated factual error and cite its basis—do not conceal an error as a puzzle. Unchecked claims must remain unchecked.

Begin by restating my question, provisional thesis, place/date/population scope and unresolved research in plain language. Identify missing attachments or evidence before reviewing. Separate my interpretations from documented observations, hypotheses and unreviewed local/AI candidates. An explicit unresolved conclusion can be appropriate.

Produce separate initial reviews under these roles before synthesizing them:

1. Historical researcher: check chronology, context, anachronism and whether retrospective accounts are being treated as contemporary testimony.
2. Source auditor: check whether each central claim is supported by its cited passage. Distinguish original documents, transcriptions, secondary interpretations, mirrors and repeated uses of the same underlying evidence.
3. Causal critic: test the mechanism, chronology, rival explanations and what evidence could distinguish them. Association or sequence alone does not establish causation.
4. Scope and perspective reviewer: check whether claims generalize beyond the observed place, dates, population or source coverage; identify whose experiences may be missing without inventing them.
5. Argument and communication reviewer: assess whether the question, claim, evidence roles, counterarguments and qualifications form a coherent argument a reader can follow. Editing style cannot repair missing evidence.

When tools permit, inspect cited sources and their specific passages. Report which you actually opened, which you could not access and what remains unchecked. If you cannot browse or view an attachment, say so. A working link is not proof of support or independence. Never invent a quotation, citation, event, motive, missing document or source check. New source leads must be labeled as leads, not evidence. Keep any quoted excerpts brief and identify their location.

Name the strongest supported parts as well as weaknesses, with claim IDs and the evidence that earns that assessment. Praise must be specific to support, not generic encouragement.

For each substantive objection, provide:

- A claim ID and the exact claim or document section under review.
- The objection and why it affects the argument.
- Its basis: an inspected passage, internal document inconsistency, methodological concern, or unverified question.
- A precise source/locator where inspected; otherwise explicitly state that the passage has not been checked.
- A useful next action: verify, compare, seek a specified type of record, narrow, revise, retain with a stated limit, or suspend.
- What finding would change this assessment.

Do not require a source merely to fill a slot, treat badges as evidence, count multiple interpretations as independent corroboration, or reject a thesis simply because it acknowledges a gap. Distinguish insufficient support from a demonstrated contradiction.

Finish with:

A. A short synthesis that preserves reviewer disagreements rather than voting them away.
B. A claim-by-claim table: claim ID, reviewer role, finding, evidence/access status, effect on the argument, proposed next action.
C. The three most consequential research or revision tasks, ordered by how much they could change the thesis.
D. Questions that help me decide how to narrow or qualify my own thesis; do not write the revised thesis for me.
E. Questions I should answer in a defense, including a prompt to develop and test a rival explanation myself. Do not provide the finished rival argument or its answer.
F. A response worksheet: objection ID, my decision (accept / investigate / retain with reasons / suspend), source checked, resulting argument change, and remaining uncertainty.

Overall status must be “Advisory AI critique; source checks and scholarly judgment remain bounded by the reported evidence.” Do not issue academic certification, an automatic pass, or an unexplained numerical quality score.


## Built-in copy-and-return workflow

In the thesis workspace, select Present your portfolio and file the research round. Open “Take my portfolio to an AI review panel”, prepare the prompt, and copy it into your preferred assistant. The generated prompt includes the selected filed thesis, evidence, references and a version-specific JSON schema, so an additional attachment is unnecessary for those contents. Copy the complete assistant JSON back into WorldThreads and choose “Bring review into my presentation”.

The built-in return format takes precedence over the prose/table format above. It uses summary, five reviewers with strengths and concerns, disagreements, nextSteps, defenseQuestions and sourceChecks. Concerns reference C1 (thesis), C2–C4 (evidence interpretations), or document. Each declares its basis and what could change the assessment. WorldThreads rejects another filed version’s request ID and unsupported grading fields; it cannot verify the truth of the assistant’s commentary or reported access.

Open a reviewer, record your own decision and reasoning, then download the portfolio with the critique and your responses. Any thesis revision remains a separate action; file and review a new version when needed. No AI service receives data automatically.


Use the JSON code block’s **Copy** control when returning the response. Some assistants' whole-message Copy formats ordinary text as Markdown and may escape URLs, producing invalid JSON. The generated prompt now requests a fenced JSON code block. If parsing fails, ask the assistant to return the same critique in a valid JSON code block; do not alter the historical findings merely to make an import pass.
