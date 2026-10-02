"""Behavior checks for provenance failures and review queue interpretation."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
class AuditTests(unittest.TestCase):
    def run_audit(self, mutate=None):
        with tempfile.TemporaryDirectory() as folder:
            p = Path(folder)
            data = {n: json.loads((ROOT/'data/1816'/f'{n}.json').read_text()) for n in ('observations','relationships','sources','threads','evidence','research-missions')}
            if mutate: mutate(data)
            for n, records in data.items(): (p/f'{n}.json').write_text(json.dumps(records))
            result = subprocess.run([sys.executable, str(ROOT/'scripts/audit.py'), '--data-dir', str(p), '--report', str(p/'report.json')], capture_output=True, text=True)
            return result, json.loads((p/'report.json').read_text())
    def test_complete_inspection_supersedes_partial_access_queue(self):
        result, report = self.run_audit()
        self.assertEqual(result.returncode, 0, result.stdout)
        self.assertFalse(any(x['sourceId']=='SRC-005' for x in report['limitedAccess']))
        self.assertTrue(any(x['dependencyGroup']=='SUGAULI-TREATY-TEXT' for x in report['sourceDependenceChecks']))
    def test_mission_cannot_reference_missing_claim(self):
        result, _ = self.run_audit(lambda d: d['research-missions'][0].update(claimRefs=['missing']))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('unknown mission claim', result.stdout)

    def test_missing_access_scope_rejected(self):
        result, _ = self.run_audit(lambda d: d['evidence'][0].pop('accessScope'))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('missing or invalid access scope', result.stdout)
    def test_self_approval_rejected(self):
        def mutate(d):
            e=d['evidence'][0];e.update(reviewStatus='approved', independentReviewer=e['reviewer'])
        result, _=self.run_audit(mutate)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('distinct independent reviewer', result.stdout)
    def test_wrong_owner_rejected(self):
        result, _=self.run_audit(lambda d: d['evidence'][0].update(claimId=d['observations'][1]['id']))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('evidence belongs to another claim', result.stdout)

if __name__ == '__main__': unittest.main()
