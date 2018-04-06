'use strict';

const assert = require('assert')
const Benchmark = require('benchmark')
const lodashfp = require('lodash/fp')
const lodash = require('lodash')
const Immutable = require('immutable')
const beautifyBenchmark = require('beautify-benchmark')

const numberOfProps = 500

let currentIdx = 0
const createPropName = i => `p.${i}`
const nextPropName = () => createPropName((currentIdx++) % numberOfProps)

const createObject = (_numberOfProps) => {
  let rval = {};
  for (let i = 0; i < _numberOfProps; i++) {
    rval[createPropName(i)] = `value-of-${createPropName(i)}`
  }
  return rval
}

console.log('Setup object...', numberOfProps)
const object = createObject(numberOfProps)
const immutableObject = Immutable.fromJS(object)
const value = 'foo'
console.log('Setup done')

// add tests
new Benchmark.Suite()
    .add('native immutable set', function () {
        const key = nextPropName()
        const newObject = {
            ...object,
            [key]: value,
        }
        assert(newObject[key] === value, 'native set eq')
        assert(object[key] !== value, 'native set uneq')
    })
    .add('lodash immutable set', function () {
        const key = nextPropName();
        const newObject = lodash.clone(object);
        lodash.set(newObject, key, value);
        assert(newObject[key] === value, 'lodash set eq')
        assert(object[key] !== value, 'lodash set uneq')
    })
    .add('lodashfp immutable set', function () {
        const key = nextPropName()
        const newObject = lodashfp.set(key, value, object);
        assert(newObject[key] === value, 'lodashfp set eq')
        assert(object[key] !== value, 'lodashfp set uneq')
    })
    .add('Immutable immutable set', function () {
        const key = nextPropName()
        const newImmutableObject = immutableObject.set(key, value)
        assert(newImmutableObject.get(key) === value, 'Immutable set eq')
        assert(immutableObject.get(key) !== value, 'Immutable set uneq')
    })
    // add listeners
    .on('start', function () {
        console.log('Starting tests...');
    })
    .on('cycle', function (event) {
        beautifyBenchmark.add(event.target);
    })
    .on('complete', function () {
        beautifyBenchmark.log()
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });
