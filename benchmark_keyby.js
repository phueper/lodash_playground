var Benchmark = require('benchmark')
var lodashfp = require('lodash/fp')

var suite = new Benchmark.Suite;

testFnKeyBy = function(a, f) {
  return lodashfp.keyBy(f, a)
}

testFnForLoop = function(a) {
  const r = {}
  for (const v of a) {
    r[v.k] = v
  }
  return r
}

testFnForLoopWithF = function(a, f) {
  const r = {}
  for (const v of a) {
    r[f(v)] = v
  }
  return r
}

const range = 1000
function prepareArray() {
  let a = lodashfp.range(0, range).map(i => ({ k: i, o: `o${i}`}));
  return a
}

// add tests
const a = prepareArray()

suite
  .add('for loop with f', function () {
      testFnForLoopWithF(a, v => v.k)
  })
  .add('for Loop', function () {
    testFnForLoop(a)
  })
  .add('lodash keyBy', function () {
    testFnKeyBy(a, v => v.k)
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });
