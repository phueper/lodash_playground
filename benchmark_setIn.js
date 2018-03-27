'use strict';

const Benchmark = require('benchmark')
const lodashfp = require('lodash/fp')
const lodash = require('lodash')
const Immutable = require('immutable')
const assert = require('assert')
const beautifyBenchmark = require('beautify-benchmark')

const value = Math.random()

const levels = 5
const propsPerLevel = 20

const createDeepObject = (currentLevel = 0) => {
  let rval = {};
  if (currentLevel === levels - 1) {
    for (let prop = 0; prop < propsPerLevel; prop++) {
      rval[`p${currentLevel}.${prop}`] = value
    }
  } else {
    for (let prop = 0; prop < propsPerLevel; prop++) {
      rval[`p${currentLevel}.${prop}`] = createDeepObject(currentLevel + 1)
    }
  }
  return rval
}

const createPath = () => {
  const rval = []
  for (let level = 0; level < levels; level++) {
    const prop = Math.floor(Math.random() * propsPerLevel)
    rval.push(`p${level}.${prop}`)
  }
  return rval
}

console.log('Setup...', levels, propsPerLevel)
const deepObject = createDeepObject()
console.log('Setup Immutable...')
const deepObjectImmutable = Immutable.fromJS(deepObject)
console.log('Setup done')

// console.log(JSON.stringify(deepObject, null, 4))
// console.log(JSON.stringify(createPath(), null, 4))

const path = createPath()

// add tests
new Benchmark.Suite()
  .add('lodash set', function () {
    const val = lodash.set(deepObject, path, 0)
    assert(val, value)
  })
  .add('lodashfp set', function () {
    const val = lodashfp.set(path, deepObject, 0)
    assert(val, value)
  })
  .add('lodashfp set curried', function () {
    const val = lodashfp.set(path)(deepObject)(0)
    assert(val, value)
  })
  .add('Immutable setIn', function () {
    const val = deepObjectImmutable.setIn(path, 0)
    assert(val, value)
  })
  // add listeners
  .on('start', function () {
    console.log('Starting tests...');
  })
  .on('cycle', function (event) {
    // console.log(String(event.target));
    beautifyBenchmark.add(event.target);
  })
  .on('complete', function () {
    beautifyBenchmark.log()
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });
