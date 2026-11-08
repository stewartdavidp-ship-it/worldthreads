# Focused historical story layout — 0.6.14

The reviewer screenshot showed three overlapping progress summaries before the historical activity: global points/journal, story position, and guided-case readiness/path. The current question appeared below them. Desktop simulations had already shown learners following concrete historical questions and often stopping at dense supporting detail. These are design observations, not demonstrated human learning outcomes.

## Design

- The historical scene leads the main page. A slim header shows the current story, current scene position and a position bar.
- “Your journey” opens a keyboard-accessible native dialog containing current position, the next scene, recorded case requirements, next source/connection action, path guide and journal/rewards.
- Source and connection actions close the journey dialog before opening the evidence inspector. Escape/Close returns to the story. The same existing elements are moved, not copied; reward and saved-state rules stay unchanged.
- Scene position is not completion, verification or mastery. Visited scenes and earned case requirements retain separate labels. Revisiting a scene changes the position bar without erasing previous work.
- Global story/people/library and display navigation remain available. The short homework, AI and orientation exercises retain their own task navigation without the historical-story bar.

## Design references inspected

[Duolingo's home-screen design explanation](https://blog.duolingo.com/new-duolingo-home-screen-design/) describes a clear sequential path, smaller units and secondary guidebooks. [Khan Academy's course/unit mastery explanation](https://support.khanacademy.org/hc/en-us/articles/115002552631-What-are-Course-and-Unit-Mastery) separates overall progress from individual skill detail. These inspire hierarchy and disclosure; Beyond the Reply does not claim their mastery model or their learning outcomes.

## Validation scope

New journey-header scenario checks current position, no progress blocks in the scene, on-demand next checks, Escape/focus, source handoff, no viewing-driven saved-state mutations, unique requirement elements, story/mode switches, narrow viewports, themes, largest text and sampled accessibility. Existing regression navigation now uses the visible global story control when returning to the shelf, and deliberately opens the header journey control for journal actions. The opening test waits for the collapsed comparison state before testing same-URL reload, preserving the existing history behavior.

Full functional confirmation results are recorded separately in the parent outputs directory. These checks do not prove intuitive use or learning effectiveness; uncoached human review remains needed.
