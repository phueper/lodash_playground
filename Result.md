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
     
lodash **eq** about **31 times slower**

lodash **eq with curry** about **535 times slower**
     
     fn x 11,917 ops/sec ±0.91% (86 runs sampled)
     lodash x 1,002,000 ops/sec ±1.09% (87 runs sampled)
     lodash curried x 96,738 ops/sec ±1.92% (83 runs sampled)
     fn2 x 12,226 ops/sec ±0.78% (85 runs sampled)
     Fastest is lodash

#### node benchmark_includes.js
     
lodash **lodash.includes** about **4 times slower**

lodash **node6.native.includes** about **15 times slower**

lodash **lodash.includes with curry** about **50 times slower**

     lodash x 984,460 ops/sec ±0.83% (85 runs sampled)
     lodash curried x 93,686 ops/sec ±1.74% (80 runs sampled)
     fn includes x 309,131 ops/sec ±0.72% (86 runs sampled)
     fn indexOf x 4,725,067 ops/sec ±0.80% (85 runs sampled)
     Fastest is fn indexOf

#### node benchmark_flow.js
 
lodash **lodash.flow** about **2.5 times slower**
    
     fn x 84,038,948 ops/sec ±1.54% (83 runs sampled)
     lodash x 32,125,324 ops/sec ±1.01% (84 runs sampled)
     Fastest is fn
