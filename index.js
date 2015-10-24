'use strict';
var coordinates = require('coordinates');
var each = require('ea');
var pause;
var cursor = {};

var transforms = {
  x: {
    prop: 'transform',
    ext: 'px',
    func: 'translateX'
  },
  y: {
    prop: 'transform',
    ext: 'px',
    func: 'translateY'
  },
  scale: {
    prop: 'transform',
    func: 'scale'
  },
  rotate: {
    prop: 'transform',
    ext: 'deg',
    func: 'rotate'
  },
  opacity: {
    prop: 'opacity'
  }
};

var prefix = {
  transform: [
    'webkitTransform',
    'MozTransform',
    'msTransform',
    'oTransform',
    'transform'
  ],
  opacity: [
    'MozOpacity',
    'opacity'
  ]
};

module.exports = Animate;

function Animate(el) {
  if (!(this instanceof Animate)) return new Animate(el);
  if (typeof el === 'string') el = document.querySelector(el);
  if (!el) return;
  this.element = el;
  this._factors = {};
  Animate.elements.push(this);
}

Animate.prototype.set = function(prop, val) {
  this._factors[prop] = typeof val === 'function' ? val : parseInt(val);
  return this;
};

each(transforms, function(transform, prop) {
  Animate.prototype[prop] = function(val) {
    return this.set(prop, val);
  };
});

Animate.prototype.update = function() {
  var self = this;
  var css = {};

  each(transforms, function(transform, param) {
    var value = self.calculate(param);
    value += transform.ext || '';
    value = param === 'opacity' ? value : transform.func + '(' + value + ')';

    each(prefix[transform.prop], function(pref) {
      css[pref] = css[pref] ? css[pref] + ' ' + value : value;
    });
  });

  each(css, function(value, prop) {
    self.element.style[prop] = value;
  });
};

Animate.prototype.calculate = function(param) {
  var factors = this._factors;
  if (typeof factors[param] === 'function') return factors[param](cursor);
  var fi = 2 * Math.PI - cursor.fi;
  var s = 45 * Math.sin(2 * fi);

  var r = cursor.r / 50 /
    Math.sqrt(Math.pow(window.innerWidth, 2) +
    Math.pow(window.innerHeight, 2));

  switch (param) {
    case 'x':
      return cursor.x / 100 * (factors.x || 0);
    case 'y':
      return cursor.y / 100 * (factors.y || 0);
    case 'scale':
      return 1 + (r * (factors.scale || 0));
    case 'opacity':
      return 1 - (r * Math.abs(factors.opacity || 0));
    case 'rotate':
      return -s * r * (factors.rotate || 0);
  }
};

Animate.elements = [];

Animate.on = function() {
  pause = false;
};

Animate.off = function() {
  pause = true;
};

Animate.toggle = function() {
  pause = !pause;
};

window.addEventListener('ontouchstart' in window ||
  'onmsgesturechange' in window ?
  'touchmove' : 'mousemove', position, false);

position({});

function position(e) {
  if (pause) return;
  e = e.type === 'touchmove' ? e.changedTouches[0] : e;

  cursor = coordinates({
    x: e.clientX || 0,
    y: e.clientY || 0
  }, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  each(Animate.elements, function(element) {
    element.update();
  });
}
