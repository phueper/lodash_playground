#!/usr/bin/env node
'use strict';

// Note: this measurement needs a empty running couchbase, i.e.
// `docker run --rm -it --name cb_performance -p 8091-8094:8091-8094 -p 11210:11210 couchbase`

const assert = require('assert');
const Benchmark = require('benchmark')
const beautifyBenchmark = require('beautify-benchmark')
const couchbase = require('couchbase');
const request = require('superagent')
const promisify = require('thenify')

const Context = require('borders').default;

const {
  createKeyValueBackendFromPool,
  BucketPool,
  get: bordersGet,
} = require('borders-couchbase-client')

// init couchbase connection
const couchbaseHost = 'localhost'
const couchbasePort = '8091'
const couchbaseRestUrlBase = `http://${couchbaseHost}:${couchbasePort}`

async function initCouchbase() {
  console.log('init couchbase')
  try {
    let res = await request
      .post(`${couchbaseRestUrlBase}/pools/default`)
      .send('memoryQuota=300')
      .send('indexMemoryQuota=300')
    console.log('->', res.status)
    console.log('cb services')
    res = await request
      .post(`${couchbaseRestUrlBase}/node/controller/setupServices`)
      .send('services=kv%2Cindex')
    console.log('->', res.status)
    console.log('credentials')
    res = await request
      .post(`${couchbaseRestUrlBase}/settings/web`)
      .send(`port=${couchbasePort}`)
      .send('username=username')
      .send('password=password')
    console.log('->', res.status)
    console.log('bucket')
    res = await request
      .post(`${couchbaseRestUrlBase}/pools/default/buckets`)
      .auth('username', 'password')
      .send('name=default')
      .send('ramQuotaMB=100')
      .send('authType=sasl')
      .send('bucketType=couchbase')
      .send('flushEnabled=1')
    console.log('->', res.status)
  } catch (e) {
    if (e.status === 401) {
      // hackhack.. assume we already initalized
      return
    }
    console.log('init error', e)
  }
}

(async () => {
  await initCouchbase()

  const cluster = new couchbase.Cluster(`couchbase://${couchbaseHost}`);
// For Couchbase > 4.5 with RBAC Auth
  cluster.authenticate('username', 'password')
  const bucket = cluster.openBucket('default');
  const bucketMgr = await bucket.manager();
  const bucketMgrFlush = promisify(bucketMgr.flush).bind(bucketMgr)
  await bucketMgrFlush();

  const bucketUpsert = promisify(bucket.upsert).bind(bucket)
  console.log('upsert')
  const docObject = { name: 'Patty' }
  await bucketUpsert('testdoc', docObject);

  const pool = new BucketPool(() => bucket)
  const createKeyValueBackend = createKeyValueBackendFromPool(pool)

  const bordersContext = new Context()
    .use(createKeyValueBackend())

  const bucketGet = promisify(bucket.get).bind(bucket)

  // add tests
  new Benchmark.Suite()
    .add('get from couchbase with couchbase module', {
      defer: true,
      minSamples: 250,
      fn: async function (deferred) {
        // console.log('get')
        const result = await bucketGet('testdoc');
        // console.log(result.value);
        assert(result.value.name && result.value.name === docObject.name)
        deferred.resolve();
      }
    })
    .add('get from couchbase through borders', {
      defer: true,
      minSamples: 250,
      fn: async function (deferred) {
        await bordersContext.execute(function* run() {
          const result = yield bordersGet('testdoc')
          // console.log('result', result)
          assert(result.name && result.name === docObject.name)
        }())
        deferred.resolve();
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
      process.exit(-1)
    })
    .on('complete', function () {
      beautifyBenchmark.log()
      console.log('Fastest is ' + this.filter('fastest').map('name'));
      process.exit(0)
    })
    // run async
    .run({ 'async': true });

})
()

