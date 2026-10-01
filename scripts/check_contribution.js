// Read-only intake: never writes into the accepted graph.
const fs=require('node:fs'),path=require('node:path');
const {validateSubmission}=require('../contribution.js');
const filename=process.argv[2];
if(!filename){console.error('Usage: node scripts/check_contribution.js contribution.json');process.exit(2);}
try{
  const data={};for(const n of ['sources','observations','relationships','threads'])data[n]=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/1816',n+'.json'),'utf8'));
  data.gaps=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/1816/research-gaps.json'),'utf8'));
  const errors=validateSubmission(JSON.parse(fs.readFileSync(filename,'utf8')),data);
  for(const error of errors)console.error(error);
  console.log(errors.length?'Intake needs corrections.':'Structure checks passed. Independent historical review and repository audit are still required.');
  process.exitCode=errors.length?1:0;
}catch(error){console.error('Could not check contribution: '+error.message);process.exitCode=1;}
