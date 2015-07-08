try {
    var assert = require("assert");
}
catch(err) {
    var assert = chai.assert;
}

describe('Z3', function(){
    before(function(done){
        var self = this;
        this.timeout(20000); // 20s
        console.time("load z3");
        loadModule("z3.wrapped.js", "/z3/", function(z3) {
            // 6371 ms
            console.timeEnd("load z3");
            self.z3 = z3;
            var memFileTimeOut = 1000;
            setTimeout(done, memFileTimeOut);
        });
    });

    describe('Properties', function(){
        it('Module present in z3', function(){
            assert.isTrue('Module' in this.z3);
        })
        it('FS present in z3', function(){
            assert.isTrue('FS' in this.z3);
        })
    });

    describe('Solving', function() {
        it('should solve simple constraints', function() {
            var self = this;
            var problem = [
                "(declare-fun top0 () Real)",
                "(declare-fun top1 () Real)",
                "(assert (= top0 top1))",
                "(assert (= top0 500))",
                "(check-sat) (get-value (top0 top1))"
            ].join(" ");

            function run(problem, fileName) {
                if (!fileName) {
                    fileName = "problem.smt2";
                }

                var oldConsoleLog = console.log;
                var stdout = [];
                window.console.log = function(solution) {
                    stdout.push(solution);
                    oldConsoleLog.apply(console, arguments);
                }

                self.z3.FS.createDataFile("/", fileName, "(check-sat) " + problem, !0, !0);

                try {
                    self.z3.Module.callMain(["-smt2", "/" + fileName])
                } catch (exception) {
                    console.error("exception", exception);
                } finally {
                    self.z3.FS.unlink("/" + fileName)
                }

                window.console.log = oldConsoleLog;

                return stdout.join("")
            }

            // window.runIt = run.bind(null, problem);
            // 185.65 ms per solution
            console.time("z3 solving");
            var iterations = 1;
            for (var i = 0; i <= iterations; i++) {
                var solution = run(problem);
            };
            console.timeEnd("z3 solving");

            assert.isTrue(solution.indexOf("top0 500.0") > -1);
            assert.isTrue(solution.indexOf("top1 500.0") > -1);
        })
    })
})