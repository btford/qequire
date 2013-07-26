var should = require('should');
var qequire = require('../qequire');

describe('qequire', function () {
  it('should work on functions', function () {
    qequire.quire(function (cb) { cb('testing') })().finally(function (val) {
      should.equal(val, 'testing');
    });
  });

  it('should work on objects', function () {
    qequire('fs').exists('../README.md').finally(function (val) {
      should.equal(val, true);
    });
  });

  it('should work with objects with circular references', function () {
    var circle = {
      foo: function (cb) {}
    };
    circle.bar = circle;
    var instr = qequire.quire(circle);
    instr.should.have.property('foo');
    instr.should.have.property('bar');
    instr.foo.should.eql(instr.bar.foo);
    instr.should.eql(instr.bar);
  });
});
