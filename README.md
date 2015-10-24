# anm

> Page animations by mouse and touch moves

## Install

```sh
npm install --save anm
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

Create animation

```js
anm('.element')
anm(document.querySelector('.element'))
```

### .set(prop, val)

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

### .opacity(val)

Set opacity

```js
anm('.element').opacity(50);
```

### .x(val)

Set horizontal movement

```js
anm('.element').x(-15);
```

### .y(val)

Set vertical movement

```js
anm('.element').y(-15);
```

### .scale(val)

Set rescaling

```js
anm('.element').scale(75);
```

### .rotate(val)

Set rotation

```js
anm('.element').rotate(25);
```

### anm.on()

Enable animations

### anm.off()

Disable animations

### anm.toggle()

Toggle enabled of animations

## Support

* Chrome
* Safari
* Firefox
* Opera
* IE 9+

## License

  MIT
