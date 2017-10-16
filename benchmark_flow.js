var Benchmark = require('benchmark')
var lodashfp = require('lodash/fp')

var suite = new Benchmark.Suite;

function pure(v) {
  return v === true;
}

const testFn = function(v) {
  let r = v;
  r = pure(r);
  r = pure(r);
  r = pure(r);
  return r;
}

const testLodash = lodashfp.flow(
    pure,
    pure,
    pure
);

function generateValue() {
  return true;
}

// add tests
suite
  .add('fn', function () {
    let v = generateValue();
    testFn(v);
  })
  .add('lodash', function () {
    let v = generateValue();
    testLodash(v)
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
