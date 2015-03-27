
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
  x : {
    prop : 'transform',
    ext  : 'px',
    func : 'translateX'
  },
  y : {
    prop : 'transform',
    ext  : 'px',
    func : 'translateY'
  },
  scale : {
    prop : 'transform',
    func : 'scale'
  },
  rotate : {
    prop : 'transform',
    ext  : 'deg',
    func : 'rotate'
  },
  opacity : {
    prop : 'opacity'
  }
};

/**
 * CSS prefixes for transform parameters
 */

var prefix = {
  transform : [
    'webkitTransform',
    'MozTransform',
    'msTransform',
    'oTransform',
    'transform'
  ],
  opacity : [
    'MozOpacity',
    'opacity'
  ]
};

/**
 * Expose anm
 */

module.exports = Animate;

/**
 * Anm
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
 * @param {String} prop
 * @param {Number} val
 * @api public
 */

Animate.prototype.set = function(prop, val) {
  this._factors[prop] = parseInt(val);
  return this;
};

/**
 * Attach transform prop
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
 * @api public
 */

Animate.prototype.update = function() {
  var factors = this._factors;
  var element = this.element;
  var values = {};

  values.x = cursor.x * (factors.x || 0) + 'px';
  values.y = cursor.y * (factors.y || 0) + 'px';
  values.scale = 1 + (cursor.r * (factors.scale || 0));
  values.opacity = 1 - (cursor.r * Math.abs(factors.opacity || 0));
  values.rotate = -cursor.s * cursor.r * 100 * (factors.rotate || 0) + 'deg';

  var css = {};
  var transform;

  each(values, function(value, param) {
    transform = transforms[param];
    value = param === 'opacity' ? value : transform.func + '(' + value + ')';

    each(prefix[transform.prop], function(pref) {
      css[pref] = css[pref] ? css[pref] + ' ' + value : value;
    });
  });

  each(css, function(value, prop) {
    element.style[prop] = value;
  });
}

/**
 * Elements
 * @api public
 */

Animate.elements = [];

/**
 * Expose animation on
 * @api public
 */

Animate.on = function() {
  pause = false;
};

/**
 * Expose animation off
 * @api public
 */

Animate.off = function() {
  pause = true;
};

/**
 * Expose animation toggle
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
 * @api private
 */

function position(e) {
  if (pause) return;
  calculatePosition(cursor, e);

  each(Animate.elements, function(element) {
    element.update();
  });
}

/**
 * Calculate cursor position
 * @param {Object} cursor
 * @param {Object} e
 * @api private
 */

function calculatePosition(cursor, e) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  e = e.type === 'touchmove' ? e.changedTouches[0] : e;

  cursor.x = e.clientX - width / 2 || 0;
  cursor.y = e.clientY - height / 2 || 0;
  cursor.fi = (Math.atan(cursor.x === 0 ? Infinity : -cursor.y / cursor.x) +
    (cursor.x < 0 ? Math.PI : (-cursor.y < 0 ? 2 * Math.PI : 0)));
  cursor.s = 45 * Math.sin(2 * cursor.fi) / 100;
  cursor.x /= 100;
  cursor.y /= 100;
  cursor.r = Math.sqrt(Math.pow(cursor.x, 2) + Math.pow(cursor.y, 2)) /
    Math.sqrt(Math.pow(width, 2) +
    Math.pow(height, 2)) * 2;
}

/**
 * Init animations from DOM attributes
 */

parseDom();

/**
 * Parse DOM
 * @api private
 */

function parseDom() {
  var elementClass = document.body.getAttribute('data-anm');
  if (!elementClass) return;

  var elements = document.querySelectorAll(elementClass);

  each(elements, function(el) {
    parseElement(el);
  });
}

/**
 * Parse element
 * @param {Element} element
 * @api private
 */

function parseElement(el) {
  var animated = Animate(el);
  var attr;

  each(transforms, function(transform, param) {
    attr = el.getAttribute('data-speed-' + param);
    if (!attr) return;
    animated[param](attr);
  });
}
