# Anm

  Page animations by mouse and touch moves

## Instalation

  Browser:

```html
<script src="https://cdn.rawgit.com/andrepolischuk/anm/1.1.0/anm.min.js"></script>
```

  Component(1):

```sh
$ component install andrepolischuk/anm
```

  Npm:

```sh
$ npm install anm
```

## Example

```js
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
anm('.element')
  .set('scale', 50);
```

  or transform function

```js
anm('.element')
  .set('x', function(cursor) {
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

## Data attributes

  Define animations via data-* attributes

### Elements

  Set elements class:

```html
<body data-anm=".anm">
```

## Factors

### data-speed-x

  Set horizontal motion

```html
<h2 data-speed-x="25">...</h2>
```

### data-speed-y

  Set vertical motion

```html
<h2 data-speed-y="-15">...</h2>
```

### data-speed-scale

  Set scaling

```html
<h2 data-speed-scale="-40">...</h2>
```

### data-speed-opacity

  Set opacity

```html
<h2 data-speed-opacity="50">...</h2>
```

### data-speed-rotation

  Set rotation

```html
<h2 data-speed-rotate="35">...</h2>
```

## Support

  * Chrome
  * Safari
  * Firefox
  * Opera
  * Internet Explorer 9+

## License

  MIT
