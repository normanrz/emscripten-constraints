try {
    var assert = require("assert");
}
catch(err) {
    var assert = chai.assert;
}

describe('Z3', function(){
    describe('Properties', function(){
        it('Module present in z3', function(){
            assert.isTrue('Module' in z3);
        })
        it('FS present in z3', function(){
            assert.isTrue('FS' in z3);
        })
    })
})