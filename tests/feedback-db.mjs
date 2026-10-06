import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
export function feedbackEnv(origin='https://stewartdavidp-ship-it.github.io'){
 const raw=new DatabaseSync(':memory:');raw.exec(fs.readFileSync(new URL('../feedback-worker/schema.sql',import.meta.url),'utf8'));
 const DB={raw,prepare(sql){const s=raw.prepare(sql);let params=[];const q={bind(...v){params=v;return q;},async first(){return s.get(...params)||null;},async run(){return {meta:{changes:s.run(...params).changes}};}};return q;},async batch(queries){raw.exec('BEGIN');try{const out=[];for(const q of queries)out.push(await q.run());raw.exec('COMMIT');return out;}catch(e){raw.exec('ROLLBACK');throw e;}}};
 return {DB,ALLOWED_ORIGINS:origin,FEEDBACK_RATE_SECRET:'local-test-only-secret-not-production'};
}
