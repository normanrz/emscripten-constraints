var fs = require("fs");

// mock window
global.window = global;

// mock XMLHttpRequest
global.XMLHttpRequest = function() {
  var _this = this;

  this.open = function(method, path, isAsynchronous) {
    this.path = "." + path;
    this.isAsynchronous = (isAsynchronous === undefined) ? true : false;
  };
  this.send = function() {
    if (this.isAsynchronous) {
      fs.readFile(this.path, 'utf8', function (err, data) {
        _this.DONE = true;
        _this.readyState = true;
        _this.responseText = data;
        _this.status = 200;
        _this.onreadystatechange();
      });
    } else {
      var data = fs.readFileSync(this.path, 'utf8');
      _this.responseText = data;
    }
  };
};

// require("./tests/test.rhea");

var loadRhea = require("./rhea/module.rhea");
loadRhea(function(rhea) {
  var v1 = new rhea._Module.Variable(12);
  console.log("v1", v1);
})


var loadZ3 = require("./z3/module.z3");
loadZ3().then(function(z3) {
  console.log("final callback invoked");

  var problem = [
    "(declare-fun top0 () Real)",
    "(declare-fun top1 () Real)",
    "(assert (= top0 top1))",
    "(assert (= top0 500))",
    "(check-sat) (get-value (top0 top1))"
  ].join(" ");

  var solution = z3.solveProblem(problem);
  console.log("solution", solution);
});
