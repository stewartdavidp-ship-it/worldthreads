/* Inspected source summaries; working hypotheses never publish graph claims. */
(function(){
const url='https://pmc.ncbi.nlm.nih.gov/articles/PMC5242558/';
const card=(id,title,type,summary,limits,locator,question)=>({id,title,type,summary,limits,locator,question,date:'2017 study of 1816 · Alexander et al.',sourceUrl:url});
const fisheries={
 id:'CASE-FISHERIES',title:'Why did 1816 become the mackerel year?',
 claim:'Cold weather alone explains the change in Gulf of Maine fishing.',
 boundary:'A strong hypothesis to test, not a recorded finding. Separate fish behavior, fishing choices and trade.',
 sourcesNote:'These are summaries from one modern study, which combines historical records and biological inference. They are not independent corroborations. Follow the locators to inspect its evidence.',sourceUrl:url,
 questionMap:['Weather conditions?','Fish availability?','Fishing choices?','Lasting change?'],
 comparisonPrompt:'Does a clue explain fish availability, people’s choices or what entered the export record? Identify a connection that remains uncertain.',
 leads:[
 card('temperature','What was actually measured?','Record + assumption','Salem air readings were used to approximate nearby water temperatures.','Air is not water; the study assumes a lag.','Results · Daily temperature parameters', 'Which part was measured, and which part was assumed?'),
 card('species','Why not every fish?','Biological inference','The reconstruction ranks early-arriving alewives less favorably than mackerel in 1816.','These are inferred conditions, not observed fish counts.','Table 4 · All conditions · Adult, 1816','Would a cold year affect every species equally?'),
 card('effort','Why change what people caught?','Historical interpretation','The authors connect crop failure and food scarcity with increased fishing pressure.','Local effort is not directly measured here.','Human adaptation to Tambora','What could distinguish demand for food from fish abundance?'),
 card('adaptation','Why did the change last?','Longer-term comparison','The marine-fishing shift continued beyond the cold event.','Persistence does not identify a unique cause.','Abstract; Discussion','What would you expect if weather were the only influence?')
 ],
 extension:{title:'Round 2 · Test the rival explanations',intro:'Your group has a possible chain. Now challenge it with three different clues. Reveal these together on your call. Three friends take one clue each; a fourth compares the explanations. What changes, and what still needs evidence?',cards:[
 card('trade','Could trade explain growth?','Rival explanation','Overall exports grew after 1814, alongside postwar economic expansion.','Aggregate growth can hide species differences.','Figure 1; Introduction','Does this explain overall exports, the species switch, or both?'),
 card('gear','Was a new hook the answer?','Chronology check','The mackerel jig dates to about 1815; widespread use before 1820 is unproven.','Invention is not adoption.','Results · Human influences · mackerel jig','Which dates would establish whether adoption preceded the switch?'),
 card('records','What does an export record miss?','Measurement boundary','Inspection returns count pickled exports, not all fish caught or eaten.','Exports are not abundance.','Introduction · Fish inspectors’ reports','What additional record would distinguish abundance, effort and consumption?')
 ]},
 nextQuestions:['Which local records distinguish fish availability from increased fishing effort?','Did adoption of the mackerel jig precede the change in fishing?','Do species-level export records support the same story as aggregate exports?']
};
window.WorldThreadsGroupCases={
 'CASE-FRANKENSTEIN':{...WorldThreadsInvestigation,comparisonPrompt:'Which clues concern setting, trigger, inspiration or continued writing? Explain differences with evidence.',nextQuestions:['Did the ghost-story challenge precede the idea?','Did scientific conversations shape the story’s subject?','When did drafting continue after the weather improved?']},
 'CASE-FISHERIES':fisheries
};
})();
