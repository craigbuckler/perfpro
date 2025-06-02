// PerfPro tests
import { describe, it } from 'node:test';
import assert from 'node:assert';

import { PerfPro } from '../perfpro.js';

const
  ppName = 'test',
  perf = new PerfPro(ppName);

perf.mark('start');
await wait();
perf.mark('wait1');
await wait();
perf.mark('wait1');
await wait();
perf.mark('wait1');
perf.mark('wait2');
await wait();
perf.mark('wait2');
perf.mark('wait3');
await wait();
perf.mark('wait3');
await wait(1);

const
  s = perf.duration('start'),
  w1 = perf.duration('wait1'),
  w2 = perf.duration('wait2'),
  w3 = perf.duration('wait3'),
  ne = perf.duration('notexists');

// check marks exist
describe('mark checks', async () => {

  it('start check', () => assert(s));
  it('wait1 check', () => assert(w1));
  it('wait2 check', () => assert(w2));
  it('wait3 check', () => assert(w3));
  it('exist check', () => assert(!ne));

  const mCount = perf.allDurations().length;
  it('mark count', () => assert.equal( mCount, 4 ));

});

// check durations
describe('duration checks', async () => {

  it('wait totals', () => assert(w1 + w2 + w3 < s));

});


// duplicate class checks
describe('duplicate checks', async () => {

  const p2 = new PerfPro(ppName);

  it('match w1', () => assert.deepStrictEqual( perf.duration('wait1'), p2.duration('wait1') ));

  it('match all 1', () => assert.deepStrictEqual( perf.allDurations(['wait1','wait2','wait3']), p2.allDurations(['wait1','wait2','wait3']) ));

  it('match all 2', () => assert.deepStrictEqual( perf.allDurations(null, ['start']), p2.allDurations(null, ['start']) ));

});


// add entrties to another class
describe('add new wait checks', async () => {

  const p3 = new PerfPro(ppName);
  p3.mark('wait4');
  await wait();
  p3.mark('wait4');

  it('match w4', () => assert.equal( perf.duration('wait4'), p3.duration('wait4') ));

  it('match all', () => assert.deepStrictEqual( perf.allDurations(null, ['start']), p3.allDurations(null, ['start']) ));

  it('start does not match', () => assert.notEqual( perf.duration('start'), p3.duration('start') ));

});


// clear entries
describe('clear entries', async () => {

  const
    pcName = 'testclear',
    pc1 = new PerfPro(pcName);

  pc1.mark('start');
  pc1.mark('startdel');
  pc1.mark('startdel');
  await wait();
  pc1.mark('startdel');
  pc1.mark('startdel');
  await wait(1);

  const pc2 = new PerfPro(pcName);
  const preLen1 = pc2.allDurations().length;

  it('match pre-clear count 1', () => assert.equal( preLen1, 2 ));
  it('match pre-clear 1', () => assert.deepStrictEqual( pc1.allDurations(), pc2.allDurations() ));

  pc1.clear('startdel');
  const preLen2 = pc2.allDurations().length;

  it('match pre-clear count 2', () => assert.equal( preLen2, 1 ));
  it('match pre-clear 2', () => assert.deepStrictEqual( pc1.allDurations(), pc2.allDurations() ));

  pc1.clear();
  const postLen = pc2.allDurations().length;

  it('match post-clear count', () => assert.equal( postLen, 0 ));
  it('match post-clear', () => assert.deepStrictEqual( pc1.allDurations(), pc2.allDurations() ));

});


// pause for a specific or random time up
function wait(time) {

  time = time || Math.random() * 1000;

  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });

}
