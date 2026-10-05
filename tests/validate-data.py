"""Check graph integrity; this does not certify historical truth."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def load(path):return json.loads((root/path).read_text())
observations=load('data/1816/observations.json'); relationships=load('data/1816/relationships.json'); threads=load('data/1816/threads.json'); sources=load('data/1816/sources.json'); mechanisms=load('data/mechanisms.json'); gaps=load('data/1816/research-gaps.json')
def indexed(items):
 assert len({x['id'] for x in items})==len(items),'Duplicate IDs'
 return {x['id']:x for x in items}
o,r,t,s,m=map(indexed,[observations,relationships,threads,sources,mechanisms])
for x in observations:
 for key in ['title','startDate','endDate','datePrecision','continent','region','historicalEntity','place','observation','coverageType','system','topic','analyticalRole','evidenceType','confidence','sourceRefs','researchStatus']:assert key in x,(x['id'],key)
 assert x['sourceRefs'] and all(id in s for id in x['sourceRefs'])
 assert set(x['analyticalRole']) <= {'STATE','PRESSURE','SHOCK','RESPONSE','OUTCOME','RESILIENCE','ADAPTATION'}
for x in relationships:
 assert x['subjectId'] in o and x['objectId'] in o
 assert x['causalStatus'] in ['CAUSAL','CONTRIBUTORY','ASSOCIATED','CONTESTED']
 assert x['sourceRefs'] and all(id in s for id in x['sourceRefs'])
 if x['predicate'] in ['PRECEDED','COINCIDED_WITH']:assert x['causalStatus']=='ASSOCIATED'
for x in threads:
 assert all(id in o for id in x['nodeIds'])
 assert all(id in r for id in x['relationshipIds'])
 for id in x['relationshipIds']:assert {r[id]['subjectId'],r[id]['objectId']}<=set(x['nodeIds'])
 assert x['mechanismIds'] and all(id in m for id in x['mechanismIds'])
for x in mechanisms:
 assert all(id in t for id in x['prototypeThreads'])
 assert all(id in o for id in x.get('counterexampleObservationIds',[]))
 assert set(x['prototypeThreads']) == {q['id'] for q in threads if x['id'] in q['mechanismIds']}
g=indexed(gaps)
for x in gaps:
 assert all(id in o for id in x.get('observationIds',[]))
 assert all(id in t for id in x.get('threadIds',[]))
 if x['status']=='Partially addressed':assert x.get('observationIds') and x.get('remainingQuestions'),x['id']
for x in observations:
 assert all(id in g for id in x.get('gapRefs',[]))
 assert x['startDate'] <= x['endDate'],x['id']
 if int(x['id'].split('-')[-1])>=32:assert x.get('uncertainty') and x.get('sourceLocator'),x['id']
for x in sources:
 assert x['url'].startswith('https://') and x.get('title') and x.get('authorOrOrg') and x.get('topics'),x['id']
print(f'PASS: {len(o)} observations, {len(r)} relationships, {len(t)} threads, {len(s)} sources, {len(m)} mechanisms')
