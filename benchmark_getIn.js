'use strict';

const Benchmark = require('benchmark')
const lodashfp = require('lodash/fp')
const lodash = require('lodash')
const Immutable = require('immutable')
const assert = require('assert')
const deepFreeze = require('deep-freeze-strict')
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
console.log('Setup frozen...')
const deepObjectFrozen = deepFreeze(Object.assign({}, deepObject))
console.log('Setup Immutable...')
const deepObjectImmutable = Immutable.fromJS(deepObject)

// console.log(JSON.stringify(deepObject, null, 4))
// console.log(JSON.stringify(createPath(), null, 4))

const path = createPath()

// add tests
new Benchmark.Suite()
  .add('native get/access', function () {
    let val = deepObject;
    let index = 0
    while (index < path.length) {
      val = val[path[index++]]
    }
    assert.equal(val, value)
  })
  .add('native get/access frozen', function () {
    let val = deepObjectFrozen;
    let index = 0
    while (index < path.length) {
      val = val[path[index++]]
    }
    assert.equal(val, value)
  })
  .add('native reduce', function () {
    const val = path.reduce((currentValue, currentPath) => {
      return currentValue[currentPath]
    }, deepObject);
    assert.equal(val, value)
  })
  .add('native reduce frozen', function () {
    const val = path.reduce((currentValue, currentPath) => {
      return currentValue[currentPath]
    }, deepObjectFrozen);
    assert.equal(val, value)
  })
  .add('lodash get', function () {
    const val = lodash.get(deepObject, path)
    assert.equal(val, value)
  })
  .add('lodash get frozen', function () {
    const val = lodash.get(deepObjectFrozen, path)
    assert.equal(val, value)
  })
  .add('lodashfp get', function () {
    const val = lodashfp.get(path, deepObject)
    assert.equal(val, value)
  })
  .add('lodashfp get curried', function () {
    const val = lodashfp.get(path)(deepObject)
    assert.equal(val, value)
  })
  .add('lodashfp get frozen', function () {
    const val = lodashfp.get(path, deepObjectFrozen)
    assert.equal(val, value)
  })
  .add('Immutable getIn', function () {
    const val = deepObjectImmutable.getIn(path)
    assert.equal(val, value)
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
