
var anm = require('..');
var assert = require('assert');

describe('anm', function() {
  it('should return function', function() {
    assert(typeof anm === 'function');
  });

  it('should contain props', function() {
    assert(anm.elements);
  });

  it('should contain methods', function() {
    assert(typeof anm.on === 'function');
    assert(typeof anm.off === 'function');
    assert(typeof anm.toggle === 'function');
  });
});

var sandbox = document.createElement('div');
sandbox.id = 'sandbox';
sandbox.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(sandbox);

var animated = anm(sandbox);

describe('anm(el)', function() {
  it('should return object', function() {
    assert(typeof animated === 'object');
  });

  it('should contain props', function() {
    assert(animated.element);
  });

  it('should contain methods', function() {
    assert(typeof animated.set === 'function');
    assert(typeof animated.opacity === 'function');
    assert(typeof animated.x === 'function');
    assert(typeof animated.y === 'function');
    assert(typeof animated.scale === 'function');
    assert(typeof animated.rotate === 'function');
  });
});
