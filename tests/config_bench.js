try {
  var assert = require("assert");
}
catch(err) {
  var assert = chai.assert;
}

function perfTest(runner, runs) {
  return function () {
    if (typeof runs == "undefined") {
      runs = 100;
    }
    var start = performance.now();
    for(var i = 0; i < runs; i++) {
      runner.call(this);
    }
    var time = (performance.now() - start) / runs;
    this._runnable.title += ": " + time.toFixed(3) + "ms";
    return time;
  };
}


var benchmarks = [];
for (var file in window.__karma__.files) {
    if (/\/base\/tests\/bench\.(.)*\.js$/.test(file)) {
        benchmarks.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
        'module.rhea': '/base/rhea/module.rhea',
        'module.z3': '/base/z3/module.z3',
        'loader': '/base/loader',
    },

    // ask Require.js to load these files (all our benchmarks)
    deps: benchmarks,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
