(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep || req);
    }, m, m.exports, outer, modules, cache, entries);

    // store to cache after successful resolve
    cache[id] = m;

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {

'use strict';

var anm = require('andrepolischuk/anm@1.2.0');

anm('.anm-vt')
  .y(-2)
  .scale(-15)
  .opacity(50);

anm('.anm-ht')
  .x(4)
  .scale(-25)
  .opacity(50);

anm('.anm-tl')
  .x(-16)
  .y(2)
  .scale(50)
  .rotate(25);

anm('.anm-gh')
  .x(16)
  .y(-2)
  .scale(50)
  .rotate(-25);

anm('.anm-hb')
  .x(-4)
  .scale(-25)
  .opacity(50);

anm('.anm-vb')
  .y(2)
  .scale(15)
  .opacity(50);

anm('.text-muted').x(2).y(-1);

var buttons = document.querySelectorAll('.btn-default');

buttons[0].addEventListener('click', function() {
  anm.on();
  buttons[1].classList.remove('active');
  buttons[0].classList.add('active');
}, false);

buttons[1].addEventListener('click', function() {
  anm.off();
  buttons[0].classList.remove('active');
  buttons[1].classList.add('active');
}, false);

}, {"andrepolischuk/anm@1.2.0":2}],
2: [function(require, module, exports) {

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
  this._factors[prop] = type(val) === 'function' ?
    val : parseInt(val);
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
  e = e.type === 'touchmove' ? e.changedTouches[0] : e;
  cursor.x = e.clientX - window.innerWidth / 2 || 0;
  cursor.y = e.clientY - window.innerHeight / 2 || 0;
  cursor.fi = (Math.atan(cursor.x === 0 ? Infinity : -cursor.y / cursor.x) +
    (cursor.x < 0 ? Math.PI : (-cursor.y < 0 ? 2 * Math.PI : 0)));
  cursor.s = 45 * Math.sin(2 * cursor.fi);
  cursor.r = Math.sqrt(Math.pow(cursor.x, 2) + Math.pow(cursor.y, 2));
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

}, {"type":3,"component-type":3,"ea":4}],
3: [function(require, module, exports) {
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

}, {}],
4: [function(require, module, exports) {

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
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

array.reverse = function(obj, fn) {
  for (var i = obj.length - 1; i >= 0 ; i--) {
    fn(obj[i], i);
  }
};

/**
 * Iterate object
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
 * @param {Array} obj
 * @param {Function} fn
 * @api private
 */

string.reverse = function(obj, fn) {
  for (var i = obj.length - 1; i >= 0 ; i--) {
    fn(obj.charAt(i), i);
  }
};

}, {"type":3,"component-type":3}]}, {}, {"1":""})