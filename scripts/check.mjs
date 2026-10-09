import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const paths=['index.html','assets/site.css','games/smart-coins/index.html','games/smart-coins/styles.css','games/smart-coins/data.js','games/smart-coins/city.js','games/smart-coins/missions.js','games/smart-coins/app.js'];
for(const p of paths){if(!existsSync(p))throw Error('Missing: '+p);}
const home=readFileSync('index.html','utf8'),game=readFileSync('games/smart-coins/index.html','utf8');
if(!home.includes('./assets/site.css'))throw Error('Portal stylesheet not connected');
for(const name of ['styles.css','data.js','city.js','missions.js','app.js'])if(!game.includes('./'+name))throw Error('Missing game asset reference: '+name);
if(game.includes('<style>')||game.includes('<script>'))throw Error('Inline code still exists');
const js=['data.js','city.js','missions.js','app.js'];
for(const filename of js)execFileSync(process.execPath,['--check','games/smart-coins/'+filename]);
const app=readFileSync('games/smart-coins/app.js','utf8');
if(!app.includes("kids-smart-coins-v1"))throw Error('Save key changed: existing progress could be lost');
if(!app.includes("show('adventure')"))throw Error('Game entry point missing');
console.log('All static checks passed.');
