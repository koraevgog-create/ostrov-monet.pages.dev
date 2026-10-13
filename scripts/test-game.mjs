import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const script=readFileSync('games/smart-coins/city.js','utf8');
function scene(day=1){
 const state={day,energy:3,coins:0,jobsDone:0,jobHistory:[],budget:{saved:0,joy:0,giving:0,learning:0}};
 const env={state,render(){},save(){},tone(){},speak(){},soundEnabled:false,document:{querySelector(){return null}}};
 vm.createContext(env);vm.runInContext(script,env);return env;
}
for(let day=1;day<=3;day++){
 const e=scene(day);e.selectWork(2);
 const fruit=day===1?[2,0,0]:day===2?[1,1,0]:[0,1,2];
 fruit.forEach((n,i)=>{for(let j=0;j<n;j++)e.changeProduct(i,1)});
 e.finishBasket();
 assert.equal(e.state.coins,5,'Correct order rewards coins');
 assert.equal(e.state.energy,2,'Correct order costs one work action');
 e.finishBasket();
 assert.equal(e.state.coins,5,'Same order never rewards twice');
}
const garden=scene();garden.selectWork(1);garden.chooseCrop(2);garden.gardenAction();garden.gardenAction();garden.gardenAction();
assert.equal(garden.state.coins,0,'Garden cannot finish on planting day');
garden.state.day=2;garden.gardenAction();assert.equal(garden.state.coins,5,'Garden rewards after another day');
garden.gardenAction();assert.equal(garden.state.coins,5,'Garden cannot reward twice');
const poor=scene();poor.state.energy=0;poor.selectWork(2);assert.equal(poor.selectedJob,-1);
console.log('Game economy smoke tests passed.');
