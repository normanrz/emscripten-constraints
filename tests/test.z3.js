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
        loadModule("z3.wrapped.js", "/z3/", function(z3) {
            self.z3 = z3;
            done();
        });
    }),
    describe('Properties', function(){
        it('Module present in z3', function(){
            assert.isTrue('Module' in this.z3);
        })
        it('FS present in z3', function(){
            assert.isTrue('FS' in this.z3);
        })
    })
})