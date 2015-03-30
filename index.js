
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
