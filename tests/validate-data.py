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

objects=load('data/objects.json'); object_links=load('data/1816/object-relationships.json'); object_types=load('data/object-types.json')
ob=indexed(objects); ol=indexed(object_links); ot=indexed(object_types)
for x in observations:
 assert x['primaryObjectId'] in ob and x['primaryObjectId'] in x['objectRefs'],x['id']
 assert len(x['objectRefs'])==len(set(x['objectRefs']))
 assert all(id in ob and x['id'] in ob[id]['observationIds'] for id in x['objectRefs'])
for x in objects:
 assert x['type'] in ot and x['subtype'] in ot[x['type']]['subtypes'],x['id']
 assert x['label'] and x['description'] and x['identityNote']
 assert x['observationIds'] and all(id in o and x['id'] in o[id]['objectRefs'] for id in x['observationIds'])
 assert set(x['sourceRefs'])=={ref for id in x['observationIds'] for ref in o[id]['sourceRefs']}
 assert x['focusDates']['start']==min(o[id]['startDate'] for id in x['observationIds'])
 assert x['focusDates']['end']==max(o[id]['endDate'] for id in x['observationIds'])
 assert x['focusDates']['meaning']
for x in object_links:
 assert x['subjectId'] in ob and x['objectId'] in ob
 assert x['relationshipKind'] in ['HISTORICAL_CLAIM','PARTICIPATION','CONTEXT']
 assert x['sourceRefs'] and all(id in s for id in x['sourceRefs'])
 assert x['evidenceObservationRefs'] and all(id in o for id in x['evidenceObservationRefs'])
 assert {x['subjectId'],x['objectId']} <= {ref for id in x['evidenceObservationRefs'] for ref in o[id]['objectRefs']}
 assert x['causalStatus'] in ['CAUSAL','CONTRIBUTORY','ASSOCIATED','CONTESTED']
 if x['relationshipKind']!='HISTORICAL_CLAIM':assert x['causalStatus']=='ASSOCIATED' and not x['evidenceRelationshipRefs']
 else:
  assert len(x['evidenceRelationshipRefs'])==1
  original=r[x['evidenceRelationshipRefs'][0]]
  assert x['subjectId']==o[original['subjectId']]['primaryObjectId'] and x['objectId']==o[original['objectId']]['primaryObjectId']
  for key in ['predicate','causalStatus','confidence','explanation','sourceRefs']:assert x[key]==original[key],(x['id'],key)
  assert set(x['evidenceObservationRefs'])=={original['subjectId'],original['objectId']}
assert {ref for x in object_links for ref in x['evidenceRelationshipRefs']}==set(r)
assert ob['OBJ-1816-0008']['id']!=ob['OBJ-tambora']['id']
assert ob['OBJ-PERSON-mary-godwin']['type']=='PERSON' and ob['OBJ-1816-0015']['type']=='WORK'
print(f'PASS: {len(ob)} objects, {len(ol)} object connections; sourced claims retain original directions and uncertainty')
