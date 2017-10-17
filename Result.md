# Results

## Setup node v6.11.1 lodash@4.17.4

* node v6.11.1
* lodash@4.17.4
* macOs 10.12.6

### Results

#### node benchmark_defaultTo.js
     
lodash **defaultTo** about **16 times slower**

lodash **defaultTo with curry** about **370 times slower**
     
     fn x 40,689,834 ops/sec ±1.40% (81 runs sampled)
     defaultTo x 2,407,381 ops/sec ±1.94% (83 runs sampled)
     defaultTo curried x 109,760 ops/sec ±3.28% (80 runs sampled)
     Fastest is fn


#### node benchmark_cond.js
     
lodash **cond** about **46 times slower**
     
     fn x 34,809,706 ops/sec ±0.70% (87 runs sampled)
     lodash x 742,376 ops/sec ±1.29% (82 runs sampled)
     Fastest is fn
     
#### node benchmark_eq.js
 
lodash **eq** about **31 times slower**

lodash **eq with curry** about **535 times slower**
     
     fn x 62,704,670 ops/sec ±1.05% (87 runs sampled)
     lodash x 2,792,403 ops/sec ±0.85% (87 runs sampled)
     lodash curried x 117,939 ops/sec ±2.02% (81 runs sampled)
     Fastest is fn

#### node benchmark_includes.js

lodash **lodash.includes** about **3 times slower**

lodash **node6.native.includes** about **16 times slower**

lodash **lodash.includes with curry** about **30 times slower**

    fn includes x 161,745 ops/sec ±0.68% (89 runs sampled)
    fn indexOf x 2,681,208 ops/sec ±0.57% (87 runs sampled)
    lodash x 822,627 ops/sec ±1.50% (85 runs sampled)
    lodash curried x 92,098 ops/sec ±1.73% (86 runs sampled)
    Fastest is fn indexOf

_Result varies with size and content of the array_      
     
#### node benchmark_flow.js
 
lodash **lodash.flow** about **2.5 times slower**
    
     fn x 84,038,948 ops/sec ±1.54% (83 runs sampled)
     lodash x 32,125,324 ops/sec ±1.01% (84 runs sampled)
     Fastest is fn
