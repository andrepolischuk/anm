(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _anm = require('anm');

var _anm2 = _interopRequireDefault(_anm);

(0, _anm2['default'])('.vertical-p').y(25);
(0, _anm2['default'])('.vertical-m').y(-25);
(0, _anm2['default'])('.horizontal-p').x(50);
(0, _anm2['default'])('.horizontal-m').x(-50);
(0, _anm2['default'])('.scale-p').scale(50);
(0, _anm2['default'])('.scale-m').scale(-50);
(0, _anm2['default'])('.rotate-p').rotate(50);
(0, _anm2['default'])('.rotate-m').rotate(-50);
(0, _anm2['default'])('.opacity-p').opacity(75);

},{"anm":2}],2:[function(require,module,exports){

'use strict';

/**
 * Module dependencies
 */

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

var each = require('ea');

/**
 * Pause flag
 */

var pause;

/**
 * Cursor position
 */

var cursor = {};

/**
 * Transform parameters
 */

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

/**
 * CSS prefixes for transform parameters
 */

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

/**
 * Expose anm
 */

module.exports = Animate;

/**
 * Animate
 *
 * @param {String|Element} el
 * @api public
 */

function Animate(el) {
  if (!(this instanceof Animate)) return new Animate(el);
  if (type(el) === 'string') el = document.querySelector(el);
  if (!el) return;

  this.element = el;
  this._factors = {};

  Animate.elements.push(this);
}

/**
 * Attach transform props
 *
 * @param  {String} prop
 * @param  {Number} val
 * @return {Object}
 * @api public
 */

Animate.prototype.set = function(prop, val) {
  this._factors[prop] = type(val) === 'function' ?
    val : parseInt(val);
  return this;
};

/**
 * Attach transform prop
 *
 * @param  {Number} val
 * @return {Object}
 * @api public
 */

each(transforms, function(transform, prop) {
  Animate.prototype[prop] = function(val) {
    this.set(prop, val);
    return this;
  };
});

/**
 * Update element transform
 *
 * @api public
 */

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

/**
 * Calculate element transform
 *
 * @param  {String} param
 * @return {Number}
 * @api public
 */

Animate.prototype.calculate = function(param) {
  var factors = this._factors;
  if (type(factors[param]) === 'function') return factors[param](cursor);

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
      return -cursor.s * r * (factors.rotate || 0);
  }
};

/**
 * Expose elements
 *
 * @api public
 */

Animate.elements = [];

/**
 * Expose animation on
 *
 * @api public
 */

Animate.on = function() {
  pause = false;
};

/**
 * Expose animation off
 *
 * @api public
 */

Animate.off = function() {
  pause = true;
};

/**
 * Expose animation toggle
 *
 * @api public
 */

Animate.toggle = function() {
  pause = !pause;
};

/**
 * Add handling
 */

window.addEventListener('ontouchstart' in window ||
  'onmsgesturechange' in window ?
  'touchmove' : 'mousemove', position, false);

/**
 * Set start position
 */

position({});

/**
 * Set elements positions
 *
 * @param {Object} e
 * @api private
 */

function position(e) {
  if (pause) return;
  calculatePosition(e);

  each(Animate.elements, function(element) {
    element.update();
  });
}

/**
 * Calculate cursor position
 *
 * @param {Object} e
 * @api private
 */

function calculatePosition(e) {
  e = e.type === 'touchmove' ? e.changedTouches[0] : e;
  cursor.x = e.clientX - window.innerWidth / 2 || 0;
  cursor.y = e.clientY - window.innerHeight / 2 || 0;
  cursor.fi = (Math.atan(cursor.x === 0 ? Infinity : -cursor.y / cursor.x) +
    (cursor.x < 0 ? Math.PI : (-cursor.y < 0 ? 2 * Math.PI : 0)));
  cursor.s = 45 * Math.sin(2 * cursor.fi);
  cursor.r = Math.sqrt(Math.pow(cursor.x, 2) + Math.pow(cursor.y, 2));
}

},{"component-type":3,"ea":4,"type":3}],3:[function(require,module,exports){
/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'nan';
  if (val && val.nodeType === 1) return 'element';

  val = val.valueOf
    ? val.valueOf()
    : Object.prototype.valueOf.apply(val)

  return typeof val;
};

},{}],4:[function(require,module,exports){

'use strict';

/**
 * Module dependencies
 */

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

/**
 * Has own property
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose direct iterate
 */

module.exports = each;

/**
 * Expose reverse iterate
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

module.exports.reverse = function(obj, fn) {
  return each(obj, fn, 'reverse');
};

/**
 * Iteration router
 *
 * @param {Object|Array} obj
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function each(obj, fn, direction) {
  if (typeof fn === 'function') {
    switch (type(obj)) {
      case 'array':
        return (array[direction] || array)(obj, fn);
      case 'object':
        if (type(obj.length) === 'number') {
          return (array[direction] || array)(obj, fn);
        }
        return (object[direction] || object)(obj, fn);
      case 'string':
        return (string[direction] || string)(obj, fn);
    }
  }
}

/**
 * Iterate array
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

function array(obj, fn) {
  for (var i = 0; i < obj.length; i++) {
    fn(obj[i], i);
  }
}

/**
 * Iterate array in reverse order
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

array.reverse = function(obj, fn) {
  for (var i = obj.length - 1; i >= 0; i--) {
    fn(obj[i], i);
  }
};

/**
 * Iterate object
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

function object(obj, fn) {
  for (var i in obj) {
    if (has.call(obj, i)) {
      fn(obj[i], i);
    }
  }
}

/**
 * Iterate object in reverse order
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

object.reverse = function(obj, fn) {
  var keys = [];
  for (var k in obj) {
    if (has.call(obj, k)) {
      keys.push(k);
    }
  }
  for (var i = keys.length - 1; i >= 0; i--) {
    fn(obj[keys[i]], keys[i]);
  }
};

/**
 * Iterate string
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

function string(obj, fn) {
  for (var i = 0; i < obj.length; i++) {
    fn(obj.charAt(i), i);
  }
}

/**
 * Iterate string in reverse order
 *
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

string.reverse = function(obj, fn) {
  for (var i = obj.length - 1; i >= 0; i--) {
    fn(obj.charAt(i), i);
  }
};

},{"component-type":3,"type":3}]},{},[1]);
