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

        window.Module = {};
        var self = this;
        self.Module = Module;

        var fileName = "problem.smt2";

        // Route stderr to an overridable method on the object.
        Module.stderr = (function stderr(x) {
            self.stderr(x);
        });


        Module.arguments = ["-smt2", fileName];
        Module.noInitialRun = true;
        Module.noExitRuntime = true;
        Module.TOTAL_MEMORY = 128 * 1024 * 1024;
        var prefixUrl = "/z3/";
        Module.memoryInitializerPrefixURL = prefixUrl;

        loadModule("wrappedZ3.js", "/z3/", function(z3New) {
            z3 = z3New;
            var Module = z3.Module;

            var code = "  (declare-fun top0 () Real) (declare-fun top1 () Real) (declare-fun left2 () Real) (declare-fun left3 () Real) (declare-fun top4 () Real) (declare-fun left5 () Real) (declare-fun angle6 () Real) (declare-fun angle7 () Real) (declare-fun top8 () Real) (declare-fun top9 () Real) (declare-fun left10 () Real) (declare-fun left11 () Real) (declare-fun top12 () Real) (declare-fun left13 () Real) (declare-fun angle14 () Real) (declare-fun angle15 () Real) (declare-fun top16 () Real) (declare-fun top17 () Real) (declare-fun left18 () Real) (declare-fun left19 () Real) (declare-fun top20 () Real) (declare-fun left21 () Real) (declare-fun angle22 () Real) (declare-fun angle23 () Real)  (assert (= top0 top1)) (assert (= (+ left2 left3) 500)) (assert (= top0 top4)) (assert (= left2 left5)) (assert (= angle6 top4)) (assert (>= angle7 90)) (assert (<= angle7 270)) (assert (= top8 top9)) (assert (= (+ left10 left11) 500)) (assert (= top8 top12)) (assert (= left10 left13)) (assert (= angle14 top12)) (assert (>= angle15 90)) (assert (<= angle15 270)) (assert (= top16 top17)) (assert (= (+ left18 left19) 500)) (assert (= top16 top20)) (assert (= left18 left21)) (assert (= angle22 top20)) (assert (>= angle23 90)) (assert (<= angle23 270)) (assert (= left19 165.95441595441596))(check-sat)(get-value (top0 top1 left2 left3 top4 left5 angle6 angle7 top8 top9 left10 left11 top12 left13 angle14 angle15 top16 top17 left18 left19 top20 left21 angle22 angle23 ))";
            z3.FS.createDataFile("/", fileName, "(check-sat)" + code, !0, !0);

            z3.Module.arguments = ["-smt2", fileName];
            z3.Module.noInitialRun = true;
            z3.Module.noExitRuntime = true;
            z3.Module.TOTAL_MEMORY = 128 * 1024 * 1024;
            var prefixUrl = "/z3/";
            z3.Module.memoryInitializerPrefixURL = prefixUrl;


            delete window.Module;
            done();
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

            var code = "  (declare-fun top0 () Real) (declare-fun top1 () Real) (declare-fun left2 () Real) (declare-fun left3 () Real) (declare-fun top4 () Real) (declare-fun left5 () Real) (declare-fun angle6 () Real) (declare-fun angle7 () Real) (declare-fun top8 () Real) (declare-fun top9 () Real) (declare-fun left10 () Real) (declare-fun left11 () Real) (declare-fun top12 () Real) (declare-fun left13 () Real) (declare-fun angle14 () Real) (declare-fun angle15 () Real) (declare-fun top16 () Real) (declare-fun top17 () Real) (declare-fun left18 () Real) (declare-fun left19 () Real) (declare-fun top20 () Real) (declare-fun left21 () Real) (declare-fun angle22 () Real) (declare-fun angle23 () Real)  (assert (= top0 top1)) (assert (= (+ left2 left3) 500)) (assert (= top0 top4)) (assert (= left2 left5)) (assert (= angle6 top4)) (assert (>= angle7 90)) (assert (<= angle7 270)) (assert (= top8 top9)) (assert (= (+ left10 left11) 500)) (assert (= top8 top12)) (assert (= left10 left13)) (assert (= angle14 top12)) (assert (>= angle15 90)) (assert (<= angle15 270)) (assert (= top16 top17)) (assert (= (+ left18 left19) 500)) (assert (= top16 top20)) (assert (= left18 left21)) (assert (= angle22 top20)) (assert (>= angle23 90)) (assert (<= angle23 270)) (assert (= left19 165.95441595441596))(check-sat)(get-value (top0 top1 left2 left3 top4 left5 angle6 angle7 top8 top9 left10 left11 top12 left13 angle14 angle15 top16 top17 left18 left19 top20 left21 angle22 angle23 ))";

            function run(code, fileName) {
                if (!fileName) {
                    fileName = "problem.smt2";
                }

                debugger;
                // z3.FS.init(function() {}, function() {}, function() {});
                var oldConsoleLog = console.log;
                window.console.log = function() {
                    oldConsoleLog.apply(console, arguments);
                }
                window.stdout = [];
                // z3.FS.createDataFile("/", fileName, "(check-sat)" + code, !0, !0);

                try {
                    z3.Module.callMain(["-smt2", "/" + fileName])
                } catch (exception) {
                    console.error("exception", exception);
                } finally {
                    z3.FS.unlink("/" + fileName)
                }
                return window.stdout.join("")
            }

            window.runIt = run.bind(null, code, "newProblem.smt2");

            // var returnValue = run(code);
            // console.log("returnValue",  returnValue);
            // assert.isTrue(!!returnValue);
        })
    })
})