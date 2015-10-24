'use strict';
var coordinates = require('coordinates');
var each = require('ea');
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

Animate.prototype.set = function (prop, val) {
  this._factors[prop] = typeof val === 'function' ? val : parseInt(val);
  return this;
};

each(transforms, function (transform, prop) {
  Animate.prototype[prop] = function (val) {
    return this.set(prop, val);
  };
});

Animate.prototype.update = function () {
  var css = {};

  each(transforms, function (transform, param) {
    var value = this.calculate(param);
    value += transform.ext || '';
    value = param === 'opacity' ? value : transform.func + '(' + value + ')';

    each(prefix[transform.prop], function (pref) {
      css[pref] = css[pref] ? css[pref] + ' ' + value : value;
    });
  }.bind(this));

  each(css, function (value, prop) {
    this.element.style[prop] = value;
  }.bind(this));
};

Animate.prototype.calculate = function (param) {
  var factors = this._factors;
  if (typeof factors[param] === 'function') return factors[param](cursor);
  var fi = 2 * Math.PI - cursor.fi;
  var s = 45 * Math.sin(2 * fi);
  var r = cursor.r / 50 / Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));

  switch (param) {
    case 'x': return cursor.x / 100 * (factors.x || 0);
    case 'y': return cursor.y / 100 * (factors.y || 0);
    case 'scale': return 1 + (r * (factors.scale || 0));
    case 'opacity': return 1 - (r * Math.abs(factors.opacity || 0));
    case 'rotate': return -s * r * (factors.rotate || 0);
  }
};

Animate.elements = [];
Animate.eventName = 'ontouchstart' in window || 'onmsgesturechange' in window ? 'touchmove' : 'mousemove';

Animate.on = function () {
  window.addEventListener(Animate.eventName, Animate.position, false);
};

Animate.off = function () {
  cursor = null;
  window.removeEventListener(Animate.eventName, Animate.position, false);
};

Animate.toggle = function () {
  if (cursor === null) return Animate.on();
  Animate.off();
};

Animate.position = function (event) {
  event = event.type === 'touchmove' ? event.changedTouches[0] : event;

  cursor = coordinates({
    x: event.clientX || 0,
    y: event.clientY || 0
  }, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  each(Animate.elements, function (element) {
    element.update();
  });
};

Animate.on();
Animate.position({});
