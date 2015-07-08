try {
    var assert = require("assert");
}
catch(err) {
    var assert = chai.assert;
}

mocha.setup({globals: ['z3']});

var z3 = null;
describe('Z3', function(){
    before(function(done){
        this.timeout(20000); // 20s
        loadModule("wrappedZ3.js", "/z3/", function(z3New) {
            z3 = z3New;
            done();
        });
    }),
    describe('Properties', function(){
        it('Module present in z3', function(){
            assert.isTrue('Module' in z3);
        })
        it('FS present in z3', function(){
            assert.isTrue('FS' in z3);
        })
    })
})