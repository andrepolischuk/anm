// Anm © 2014 Andrey Polischuk
// https://github.com/andrepolischuk/anm

!function(undefined) {

  'use strict';

  /**
   * Object classes
   */

  var elementClass = document.body.getAttribute('data-anm');

  /**
   * Base options undefined
   */

  if (!elementClass) {
    return false;
  }

  /**
   * IE check
   */

  var msie = /.*MSIE.(\d+)\..*/gi.test(navigator.userAgent);

  /**
   * Pause flag
   */

  var pause;

  /**
   * Effects
   */

  var effects = {
    '-webkit-transform' : 'translate3d',
       '-moz-transform' : 'translate3d',
        '-ms-transform' : 'translate3d',
         '-o-transform' : 'translate',
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
   * Set elements positions
   * @api private
   */

  var position = function(e) {

    if (pause) {
      return false;
    }

    e = e || window.event || {};
    e = e.type === 'touchmove' ? e.changedTouches[0] : e;

    var x = !e ? 0 : (e.clientX - window.innerWidth / 2) * 30 / window.innerWidth;
    var y = !e ? 0 : (e.clientY - window.innerHeight / 2) * 30 / window.innerHeight;

    for (var i = 0, offsetX, offsetY, el, string; i < elements.length; i++) {

      el = elements[i];

      // calculate offsets
      offsetX = x * (+el.getAttribute('data-speed-x') || 0) + 'px';
      offsetY = y * (+el.getAttribute('data-speed-y') || 0) + 'px';

      // set style
      if (msie) {

        el.style.marginLeft = offsetX;
        el.style.marginTop  = offsetY;

      } else {

        string = [offsetX, offsetY].join(',');

        for (var f in effects) {
          if (effects.hasOwnProperty(f)) {
            el.style[f] = [
              effects[f],
              '(',
              string,
              effects[f] === 'translate' ? '' : ',0',
              ')'
            ].join('');
          }
        }

      }

    }

  };

  /**
   * Set start position
   */

  position();

  /**
   * Set move event handler
   */

  window.addEventListener(('ontouchstart' in window || 'onmsgesturechange' in window) ?
    'touchmove' : 'mousemove', position, false);

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
