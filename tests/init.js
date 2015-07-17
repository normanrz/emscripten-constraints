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
