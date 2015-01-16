// Anm © 2014-2015 Andrey Polischuk
// github.com/andrepolischuk/anm

!function() {

  'use strict';

  /**
   * Object classes
   */

  var elementClass = document.body.getAttribute('data-anm');

  /**
   * Base options undefined
   */

  if (!elementClass) {
    return;
  }

  /**
   * IE lt 9 detection
   */

  var msie = /MSIE.\d+\./gi.test(navigator.userAgent) &&
    +navigator.userAgent.replace(/.*MSIE.(\d+)\..*/gi, "$1") < 9;

  /**
   * Event name
   */

  var eventName = 'ontouchstart' in window ||
    'onmsgesturechange' in window ? 'touchmove' : 'mousemove';

  /**
   * Pause flag
   */

  var pause;

  /**
   * Effects
   */

  var effects = [
    'x',
    'y',
    'scale',
    'opacity',
    'rotate'
  ];

  /**
   * Transform map
   */

  var transformMap = {
    'webkitTransform' : 'translate3d',
    'MozTransform' : 'translate3d',
    'msTransform' : 'translate3d',
    'OTransform' : 'translate',
    'transform' : 'translate3d'
  };

  /**
   * Anm
   * @api public
   */

  function anm() {

  }

  /**
   * Elements
   * @api public
   */

  var elements = anm.elements = document.querySelectorAll(elementClass);

  /**
   * On animation
   * @api public
   */

  anm.on = function() {
    pause = false;
  };

  /**
   * Off animation
   * @api public
   */

  anm.off = function() {
    pause = true;
  };

  /**
   * Toggle animation
   * @api public
   */

  anm.toggle = function() {
    pause = !pause;
  };

  /**
   * Calculate cursor position
   * @param  {Object} e
   * @return {Object}
   * @api private
   */

  function calculatePosition(e) {
    var pos = {};
    pos.x = e.clientX - window.innerWidth / 2 || 0;
    pos.y = e.clientY - window.innerHeight / 2 || 0;
    pos.fi = (Math.atan(pos.x === 0 ? Infinity : -pos.y / pos.x) +
      (pos.x < 0 ? Math.PI : (-pos.y < 0 ? 2 * Math.PI : 0)));
    pos.s = 45 * Math.sin(2 * pos.fi) / 100;
    pos.x /= 100;
    pos.y /= 100;
    pos.r = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2)) /
      Math.sqrt(Math.pow(window.innerWidth, 2) +
      Math.pow(window.innerHeight, 2)) * 2;
    return pos;
  }

  /**
   * Calculate element factors
   * @param  {Object} el
   * @return {Object}
   * @api private
   */

  function calculateFactors(el) {
    var fact = {};
    for (var i = 0; i < effects.length; i++) {
      fact[effects[i]] = +el.getAttribute('data-speed-' + effects[i]) || 0;
    }
    return fact;
  }

  /**
   * Calculate element transforms
   * @param  {Object} pos
   * @param  {Object} fact
   * @return {Object}
   * @api private
   */

  function calculateTransforms(pos, fact) {
    var transform = {};
    transform.x = pos.x * fact.x + 'px';
    transform.y = pos.y * fact.y + 'px';
    transform.scale = 1 + (pos.r * fact.scale);
    transform.opacity = 1 - (pos.r * Math.abs(fact.opacity));
    transform.rotate = -pos.s * pos.r * 100 * fact.rotate + 'deg';
    return transform;
  }

  /**
   * Set element transform styles
   * @param  {Object} el
   * @param  {Object} transform
   * @return {Object}
   * @api private
   */

  function setElementStyle(el, transform) {

    if (msie) {

      el.style.marginLeft = transform.x;
      el.style.marginTop = transform.y;

    } else {

      for (var m in transformMap) {
        if (transformMap.hasOwnProperty(m)) {
          el.style[m] = [
            transformMap[m],
            '(',
            transform.x + ',' + transform.y,
            transformMap[m] === 'translate' ? '' : ',0',
            ') scale(',
            transform.scale,
            ') rotate(',
            transform.rotate,
            ')'
          ].join('');
        }
      }

      el.style.opacity = transform.opacity;
      el.style.MozOpacity = transform.opacity;

    }

  }

  /**
   * Set elements positions
   * @api private
   */

  function position(e) {

    if (pause) {
      return;
    }

    e = e.type === 'touchmove' ? e.changedTouches[0] : e;
    var fact, transform, pos = calculatePosition(e);

    for (var i = 0, el; i < elements.length; i++) {
      el = elements[i];
      fact = calculateFactors(el);
      transform = calculateTransforms(pos, fact);
      setElementStyle(el, transform);
    }

  }

  /**
   * Set start position
   */

  position({});

  /**
   * Set move event handler
   */

  if (window.addEventListener) {
    window.addEventListener(eventName, position, false);
  } else {
    window.attachEvent('onmousemove', function() {
      position.call(window, window.event);
    });
  }

  /**
   * Module exports
   */

  if (typeof define === 'function' && define.amd) {

    define([], function() {
      return anm;
    });

  } else if (typeof module !== 'undefined' && module.exports) {

    module.exports = anm;

  } else {

    this.anm = anm;

  }

}.call(this);
