"""Audit graph structure and evidence provenance; does not judge historical truth."""
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1] / 'data' / '1816'
errors, warnings = [], []
data = {n: json.loads((ROOT / (n + '.json')).read_text()) for n in
        ('observations', 'relationships', 'sources', 'threads', 'evidence')}
index = {}
for name, records in data.items():
    index[name] = {}
    for item in records:
        key = item.get('id')
        if not key or key in index[name]:
            errors.append(f'{name}: missing or duplicate ID {key}')
        index[name][key] = item
for name in ('observations', 'relationships'):
    for item in data[name]:
        key = item['id']
        for source in item.get('sourceRefs', []):
            if source not in index['sources']: errors.append(f'{key}: missing source {source}')
        if not item.get('evidenceRefs'): warnings.append(f'{key}: passage-level evidence not yet registered')
        for evidence in item.get('evidenceRefs', []):
            if evidence not in index['evidence']: errors.append(f'{key}: missing evidence {evidence}')
        for evidence in item.get('evidenceRefs', []):
            record = index['evidence'].get(evidence)
            if record and record.get('claimId') != key: errors.append(f'{key}: evidence belongs to another claim')
        if name == 'relationships' and item.get('causalStatus') in ('CAUSAL', 'CONTRIBUTORY'):
            review = item.get('causalReview')
            if not review: warnings.append(f'{key}: causal alternative review not registered')
            else:
                if not review.get('searchStatus'): errors.append(f'{key}: missing alternative search status')
                for alternative in review.get('alternatives', []):
                    if alternative.get('assessment') not in ('supported', 'plausible', 'contested', 'contradicted', 'unresolved'): errors.append(f'{key}: invalid alternative assessment')
                    for source in alternative.get('sourceRefs', []):
                        if source not in index['sources']: errors.append(f'{key}: alternative missing source {source}')
                    if alternative.get('assessment') in ('supported', 'contradicted') and not alternative.get('sourceRefs'): errors.append(f'{key}: alternative judgment requires evidence')
        if name == 'relationships':
            for field in ('subjectId', 'objectId'):
                if item.get(field) not in index['observations']: errors.append(f'{key}: invalid {field}')
for item in data['evidence']:
    key = item['id']
    claim = index['observations'].get(item.get('claimId')) or index['relationships'].get(item.get('claimId'))
    if not claim: errors.append(f'{key}: missing claim')
    if item.get('sourceId') not in index['sources']: errors.append(f'{key}: missing source')
    if claim and item.get('sourceId') not in claim.get('sourceRefs', []): errors.append(f'{key}: source absent from claim')
    for field in ('locator', 'accessedAt', 'provenance', 'limitations', 'reviewer'):
        if not item.get(field): errors.append(f'{key}: missing {field}')
    if item.get('reviewStatus') == 'approved' and (not item.get('independentReviewer') or item['independentReviewer'] == item.get('reviewer')):
        errors.append(f'{key}: approval requires a distinct independent reviewer')
for item in data['threads']:
    for node in item['nodeIds']:
        if node not in index['observations']: errors.append(f'{item["id"]}: missing node {node}')
    for edge in item['relationshipIds']:
        rel = index['relationships'].get(edge)
        if not rel: errors.append(f'{item["id"]}: missing edge {edge}')
        elif not {rel['subjectId'], rel['objectId']} <= set(item['nodeIds']): errors.append(f'{item["id"]}: edge endpoints outside thread')
for message in errors: print('ERROR:', message)
for message in warnings: print('WARNING:', message)
print(f'Audit: {len(errors)} errors, {len(warnings)} warnings')
sys.exit(bool(errors))
