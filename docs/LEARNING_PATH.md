# Learning to investigate with AI

Published 0.5.90 · 4 November 2026. Product/learning design, not demonstrated learning efficacy.

## Product purpose

WorldThreads is a guided learning experience for asking questions, evaluating evidence and developing explanations with AI assistance. Historical investigations supply substantive practice; activity milestones track participation. The learning goal is the person's judgment, not a polished generated answer, agreement with an assistant or a badge collection. The first paper can begin as a short bounded explanation.

The homepage now states that purpose and recommends the introduction before the first exercise. Existing story, object and research entry points remain available. `?learn=worldthreads` opens the introduction; `?practice=quotle` remains a direct exercise shortcut. The guide is optional and does not add artificial quiz gates.

## Sequence and learner actions

1. **Orientation (three short screens).** Explain the purpose and route; explore four AI roles with their benefits and checks; distinguish claim, source, evidence and reasoning. Role/concept buttons show one focused panel rather than a long page. Research includes external source checks, independent corroboration, context, limitations and revision.
2. **Quote investigation.** Preserve the existing Quotle case. A confident answer, a source lead and an adversarial review are different objects to evaluate. The learner selects a research task, checks a passage, explains a reviewer decision before receiving comparison guidance, and writes a correction and next source. Fixed teaching examples remain clearly labeled.
3. **Research bridge (three screens).** Explain an arguable working thesis and the parts of a paper; explore WorldThreads' Source → Observation → Relationship → Thread → Mechanism model in plain language; explain the external-assistant workflow. The quote exercise practises checking a particular fact; a historical thesis requires a broader, supportable explanation and alternatives. Do not present the learner's quote conclusion as a verified thesis.
4. **First historical story.** Retain existing Czech/Korean evidence, prediction/reveal, source-scope checkpoints and player-authored explanation. The research workspace, imported suggestions, rival tests, revisions, version-specific portfolios and exports remain authoritative.
5. **Everyday use.** Offer purchase, news and work situations without making factual recommendations. Learners write their own question, delegated AI task, verification plan and evidence/expertise boundary. Switching examples never replaces their writing. A self-contained prompt is generated from those notes, and a readable Markdown download preserves both plan and prompt. Everyday research can continue in the person's assistant; it need not be imported into the historical corpus.

The quote ending recommends the research bridge and retains a secondary direct-story route for people who know the method. Everyday planning is accessible from the first story's ending and from the thesis overview's optional research-step menu. Returning users can revisit the guide and recover their notes.

## AI workflow explained to the learner

Choose a gap in WorldThreads → prepare/copy its research prompt → paste into the person's external assistant → bring its formatted suggestions back → inspect source passages and scope → accept, question or exclude suggestions → revise the person's explanation and record why.

The guide does not itself invoke an AI service or claim an example came from a live conversation. It explains both the value of a return (connections, evidence decisions, saved versions) and its limits (format validation is not historical verification). External AI is optional. Source access failures and uninspected leads remain explicit; multiple models or copied websites do not establish independent confirmation.

## Research basis and interpretation

Primary pages inspected on 4 November 2026:

- Anthropic AI Fluency: https://academy.claude.com/collections/collaborating-with-ai . Relevant concepts: delegation, task description, discernment and diligence. We use these to explain responsibility for the task and its evaluation; the guide is original teaching copy, not a reproduction of the course.
- Experience AI: https://experience-ai.org/en/units/using-llms-strategically-for-learning-13-16 . Its five-lesson unit covers LLM behavior, guiding/challenging interactions, prompts, evaluation and overreliance. This supports treating critical use as more than prompt wording; it is curriculum comparison, not efficacy evidence for our implementation.
- Digital Inquiry Group: https://cor.inquirygroup.org/research/lateral-reading-on-the-open-internet/ . The classroom study reports improved credibility judgments after teaching lateral reading. We incorporate the habit of checking who produced an unfamiliar source using information outside that source. This result does not establish general transfer from WorldThreads.
- Bastani et al.: https://www.pnas.org/doi/10.1073/pnas.2422633122 . In one high-school mathematics setting, ordinary AI practice assistance harmed subsequent unassisted performance, while hints-oriented safeguards largely avoided that harm. Avoid claiming AI universally erodes critical thinking, that hints prove independent learning gains, or that this validates a history application.
- Harvard thesis guidance: https://writingcenter.fas.harvard.edu/thesis . Supports the central, arguable, appropriately scoped claim developed through analysis of evidence.
- Harvard counterargument guidance: https://writingcenter.fas.harvard.edu/counterargument . Supports considering serious alternatives throughout the investigation and revising when warranted, rather than adding a token objection at the end.

References and the limits of the inference are available in an optional disclosure in the app. The design hypothesis is that a visible investigation, learner-owned reasoning and specific verification choices can help people practise AI research. Actual learner evidence is still needed.

## State and interface safeguards

`worldthreads-learning-path-v1` stores only guide location, selected explanatory panels and the everyday plan. Conflicting or unfamiliar saved data is preserved; failed saving leaves the current plan downloadable. It does not write historical data, quote decisions, historical rewards, saved theses or immutable portfolios. Selecting a panel never fills in an argument or accepts evidence.

The guide is a distinct browser-history route. Back/Forward and reload retain its section; explicit exits clear its entry query. The original story and thesis navigation remain available. Controls use buttons, groups, live explanatory panels, labeled text fields and expandable detail. Dark/light themes, text scaling and small-screen reflow apply.

## Validation and next human study

`tests/learning-path.cjs` covers homepage discovery, orientation, concept/role interaction, the quote exercise, thesis/paper/model/assistant bridge, first-story decisions and own argument, everyday plan and generated prompt, download, thesis handoff/export, history/reload, unchanged graph/rewards/writing before handoff, preserved previous thesis, future-version/blocked storage, keyboard activation, narrow largest-text layouts/themes and sampled accessibility.

Primary plan passed 59/59. Final dedicated learning-path, quote, navigation matrix, evidence-close race and appearance checks passed. 48 JavaScript syntax checks and graph/object validation passed. Returning learners get accurate resume labels, and explicit navigation away clears the tutorial entry query so reload does not force it back. Automated scenarios establish functionality, not comprehension, engagement, retention or skill transfer. Native Safari/WebKit coverage is not claimed for this change.

Prioritize a human pilot over adding more guide pages. Ask learners to explain the app's purpose, distinguish a source from evidence, justify a reviewer decision, locate the real assistant workflow, and apply the method to unfamiliar everyday material. Compare independent reasoning before/after and include a delayed task before claiming durable transfer. Do not compare learners with one another or award research mastery from page visits.


0.5.90 published from aa07539fb5af8d69cc4755cbcc0f409f0cc32881 on 4 November 2026. Hosted validation 41868253133 and Pages 41868249791 succeeded. The public learning-path scenario passed through the introduction, quote exercise, research bridge, first-story own argument, everyday plan/prompt, thesis/export, reload/history and preservation checks. Public entry: https://stewartdavidp-ship-it.github.io/worldthreads/?learn=worldthreads . Functional confirmation, not human learning validation.
