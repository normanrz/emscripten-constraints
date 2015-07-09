try {
  var assert = require("assert");
}
catch(err) {
  var assert = chai.assert;
}

function perfTest(runner, runs) {
  if (typeof runs == "undefined") {
    runs = 100;
  }
  var start = performance.now();
  for(var i = 0; i < runs; i++) {
    runner();
  }
  return (performance.now() - start) / runs;
}
