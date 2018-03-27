'use strict';

const Benchmark = require('benchmark')
const lodash = require('lodash')
const Immutable = require('immutable')
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

console.log('Setup...', levels, propsPerLevel)
const deepObject = createDeepObject()

// add tests
new Benchmark.Suite()
  .add('clone with JSON parse/stringify', function () {
    // const obj = Object.assign({}, deepObject)
    const obj = JSON.parse(JSON.stringify(deepObject))
  })
  .add('lodash cloneDeep', function () {
    const obj = lodash.cloneDeep(deepObject)
  })
  .add('Immutable fromJS', function () {
    const immutable = Immutable.fromJS(deepObject)
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
