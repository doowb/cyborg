
var assert = require('assert');
var Cyborg = require('../');

describe('cyborg', function() {
  it('should create an instance', function() {
    var cyborg = new Cyborg();
    assert(cyborg instanceof Cyborg);
  });

  it('should create an instance without using `new`', function() {
    var cyborg = Cyborg();
    assert(cyborg instanceof Cyborg);
  });
});
