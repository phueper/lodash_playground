#!/usr/bin/env node
'use strict';

const Benchmark = require('benchmark')
const beautifyBenchmark = require('beautify-benchmark')

const Context = require('borders').default;

const value = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// yuck... sync sleep :/ ... makes simulating "blocking IO" simple
const { usleep } = require('sleep')
const IO_SLEEP_MS=0.001
const performIo = () => {
  usleep(IO_SLEEP_MS * 1000)
}

function* generatorFunc() {
  for (let i = 0; i < value.length; i += 1) {
    performIo()
    yield value[i]
  }
}

const bordersContext = new Context()
  .use({
    FUNC: (index) => {
      // console.log('in backend', index);
      performIo()
      return value[index]
    },
    NOOP: () => {performIo()},
  })

// add tests
new Benchmark.Suite()
  .add('plain generator function', function () {
    const gen = generatorFunc()
    let genValue = gen.next()
    const val = []
    while (!genValue.done) {
      val.push(genValue.value)
      genValue = gen.next()
    }
    // console.log('generator returned', val)
  })
  .add('plain generator function through promise', {
    defer: true,
    fn: function (deferred) {
      const promise = new Promise((resolve, reject) => {
        const gen = generatorFunc()
        let genValue = gen.next()
        const val = []
        while (!genValue.done) {
          val.push(genValue.value)
          genValue = gen.next()
        }
        // console.log('generator returned', val)
        resolve();
      })
      promise.then(
        (v) => {
          // console.log('promise resolved', v)
          deferred.resolve()
        },
        (e) => {
          console.log('promise rejected', e)
          deferred.resolve()
        }
      )
    }
  })
    .add('plain generator executed in borders context',
        {
            defer: true,
            fn: function (deferred) {
                const execute = bordersContext.execute(function* run() {
                    const gen = generatorFunc()
                    let genValue = gen.next()
                    const val = []
                    while (!genValue.done) {
                        val.push(genValue.value)
                        genValue = gen.next()
                    }
                    return val
                }())
                execute.then(
                    (v) => {
                        // console.log('execute resolved', v)
                        deferred.resolve()
                    },
                    (e) => {
                        console.log('execute rejected', e)
                        deferred.resolve()
                    }
                )
            }
        })
    .add('plain noop executed in borders context',
        {
            defer: true,
            fn: function (deferred) {
                const execute = bordersContext.execute(function* run() {performIo()}())
                execute.then(
                    (v) => {
                        // console.log('execute resolved', v)
                        deferred.resolve()
                    },
                    (e) => {
                        console.log('execute rejected', e)
                        deferred.resolve()
                    }
                )
            }
        })
    .add('function through borders',
        {
            defer: true,
            fn: function (deferred) {
                const execute = bordersContext.execute(function* run() {
                    const val = []
                    for (let i = 0; i < value.length; i += 1) {
                        val.push(yield { type: 'FUNC', payload: i })
                    }
                    return val
                }())
                execute.then(
                    (v) => {
                        // console.log('execute resolved', v)
                        deferred.resolve()
                    },
                    (e) => {
                        console.log('execute rejected', e)
                        deferred.resolve()
                    }
                )
            }
        })
    .add('noop through borders',
        {
            defer: true,
            fn: function (deferred) {
                const execute = bordersContext.execute(function* run() {
                    const val = []
                    for (let i = 0; i < value.length; i += 1) {
                        yield { type: 'NOOP' }
                    }
                    return val
                }())
                execute.then(
                    (v) => {
                        // console.log('execute resolved', v)
                        deferred.resolve()
                    },
                    (e) => {
                        console.log('execute rejected', e)
                        deferred.resolve()
                    }
                )
            }
        })
    // add listeners
  .on('start', function () {
    console.log('Starting tests...');
  })
  .on('cycle', function (event) {
    // console.log(String(event.target));
    beautifyBenchmark.add(event.target);
  })
  .on('error', function (event) {
    console.log('Benchmark error:', event);
  })
  .on('complete', function () {
    beautifyBenchmark.log()
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });
