try {
    var assert = require("assert");
}
catch(err) {
    var assert = chai.assert;
}

mocha.setup({globals: ['z3', "Module"]});

var z3 = null;
describe('Z3', function(){
    before(function(done){
        this.timeout(20000); // 20s

        loadModule("wrappedZ3.js", "/z3/", function(z3New) {
            z3 = z3New;
            var memFileTimeOut = 1000;
            setTimeout(done, memFileTimeOut);
        });

    });

    describe('Properties', function(){
        it('Module present in z3', function(){
            assert.isTrue('Module' in z3);
        })
        it('FS present in z3', function(){
            assert.isTrue('FS' in z3);
        })
    });

    describe('Z3 solving', function() {
        it('should solve simple constraints', function() {

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

                z3.FS.createDataFile("/", fileName, "(check-sat) " + problem, !0, !0);

                try {
                    z3.Module.callMain(["-smt2", "/" + fileName])
                } catch (exception) {
                    console.error("exception", exception);
                } finally {
                    z3.FS.unlink("/" + fileName)
                }

                window.console.log = oldConsoleLog;

                return stdout.join("")
            }

            // window.runIt = run.bind(null, problem);
            var solution = run(problem);

            assert.isTrue(solution.indexOf("top0 500.0") > -1);
            assert.isTrue(solution.indexOf("top1 500.0") > -1);
        })
    })
})