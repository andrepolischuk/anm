# anm

  > Page animations by mouse and touch moves

## Instalation

```sh
$ npm install --save anm
$ component install andrepolischuk/anm
```

## Usage

```js
var anm = require('anm');

anm('.element')
  .x(15)
  .y(-15)
  .scale(10)
  .opacity(50);
```

## API

### anm(element)

  Return [animate](#animate)

```js
anm('.element')
anm(document.querySelector('.element'))
```

### anm.elements

  Animated elements array

### anm.on()

  Enable animations

### anm.off()

  Disable animations

### anm.toggle()

  Toggle enabled of animations

### Animate

#### Animate#set(prop, val)

  Set transform factor

```js
anm('.element').set('scale', 50);
```

  or transform function

```js
anm('.element').set('x', function(cursor) {
  return cursor.x * 0.5;
});
```

  All factors set in percent of max value.
  Positive values set direct motion, negative - inverse (excluding opacity).

#### Animate#opacity(val)

  Set opacity

```js
anm('.element').opacity(50);
```

#### Animate#x(val)

  Set horizontal movement

```js
anm('.element').x(-15);
```

#### Animate#y(val)

  Set vertical movement

```js
anm('.element').y(-15);
```

#### Animate#scale(val)

  Set rescaling

```js
anm('.element').scale(75);
```

#### Animate#rotate(val)

  Set rotation

```js
anm('.element').rotate(25);
```

## Support

  * Chrome
  * Safari
  * Firefox
  * Opera
  * IE 9+

## License

  MIT
